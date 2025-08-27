import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userTypeEnum = pgEnum('user_type', ['customer', 'provider', 'admin']);
export const jobStatusEnum = pgEnum('job_status', ['open', 'closed']);
export const providerStatusEnum = pgEnum('provider_status', ['pending', 'approved', 'rejected']);
export const transactionTypeEnum = pgEnum('transaction_type', ['recharge', 'unlock', 'refund', 'subscription']);
export const reviewRatingEnum = pgEnum('review_rating', ['1', '2', '3', '4', '5']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'expired', 'cancelled']);
export const subscriptionTypeEnum = pgEnum('subscription_type', ['basic', 'premium', 'enterprise']);
export const aiLogTypeEnum = pgEnum('ai_log_type', ['category_detection', 'duplicate_detection', 'auto_close']);
export const notificationTypeEnum = pgEnum('notification_type', ['approval', 'rejection', 'unlock', 'review', 'system', 'promotional']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  name: text("name"),
  email: text("email"),
  password: text("password"), // Optional password
  userType: userTypeEnum("user_type").notNull(),
  isVerified: boolean("is_verified").default(false),
  isBlocked: boolean("is_blocked").default(false),
  profileCompleted: boolean("profile_completed").default(false), // Track if profile is completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export const providerProfiles = pgTable("provider_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  businessName: text("business_name"),
  businessDetails: text("business_details"),
  serviceCategories: text("service_categories").array(),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  serviceRadius: integer("service_radius").default(5), // in km
  maxServiceRadius: integer("max_service_radius").default(20),
  status: providerStatusEnum("status").default('pending'),
  documentsUploaded: boolean("documents_uploaded").default(false),
  documents: text("documents").array(), // Array of document URLs
  gallery: text("gallery").array(), // Array of image URLs for public profile
  publicProfile: text("public_profile"), // Public description for customers
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'), // Average rating
  totalJobs: integer("total_jobs").default(0), // Total completed jobs
  approvedAt: timestamp("approved_at"),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  originalDescription: text("original_description"), // Before AI enhancement
  budget: text("budget"), // Budget range
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  status: jobStatusEnum("status").default('open'),
  unlockCount: integer("unlock_count").default(0),
  maxUnlocks: integer("max_unlocks").default(3),
  notificationsSent: boolean("notifications_sent").default(false), // Track if notifications sent
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  balance: decimal("balance", { precision: 10, scale: 2 }).default('0'),
  lastRechargeAt: timestamp("last_recharge_at"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => wallets.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  jobId: varchar("job_id").references(() => jobs.id), // for unlock transactions
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobUnlocks = pgTable("job_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Admin Settings Table
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  category: text("category").notNull(), // pricing, notifications, etc
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // approval, rejection, unlock_success, low_balance, manual
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Actions Log
export const adminActionLogs = pgTable("admin_action_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(), // approve_provider, block_user, add_balance, etc
  targetId: varchar("target_id"), // user id, job id, etc
  targetType: text("target_type"), // user, job, wallet, etc
  details: text("details"), // additional context as JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: Reviews and Ratings
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  rating: reviewRatingEnum("rating").notNull(),
  comment: text("comment"),
  isHelpful: boolean("is_helpful").default(true), // For filtering fake reviews
  isVerified: boolean("is_verified").default(false), // Admin verification
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: Subscription Plans
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: subscriptionTypeEnum("type").notNull(),
  status: subscriptionStatusEnum("status").default('active'),
  monthlyUnlocks: integer("monthly_unlocks").notNull(), // Number of free unlocks per month
  priorityJobs: boolean("priority_jobs").default(false), // Show jobs first
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  autoRenew: boolean("auto_renew").default(true),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: Referral System
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  refereeId: varchar("referee_id").notNull().references(() => users.id),
  referralCode: varchar("referral_code", { length: 20 }).notNull().unique(),
  creditsEarned: decimal("credits_earned", { precision: 10, scale: 2 }).default('0'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: AI Automation Logs
export const aiLogs = pgTable("ai_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id),
  type: aiLogTypeEnum("type").notNull(),
  originalData: text("original_data"), // Original job title/description
  processedData: text("processed_data"), // AI processed version
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
  action: text("action"), // Action taken (e.g., 'category_changed', 'job_flagged')
  details: text("details"), // Additional details
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: Enhanced Notifications
export const enhancedNotifications = pgTable("enhanced_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"), // Deep link or action URL
  isRead: boolean("is_read").default(false),
  priority: integer("priority").default(1), // 1=low, 2=medium, 3=high
  metadata: text("metadata"), // JSON metadata for complex notifications
  expiresAt: timestamp("expires_at"), // Auto-expire promotional notifications
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: SEO Landing Pages
export const seoPages = pgTable("seo_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 200 }).notNull().unique(), // e.g., "plumbers-in-delhi"
  city: text("city").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(), // SEO title
  description: text("description").notNull(), // SEO description
  content: text("content").notNull(), // AI generated content
  isActive: boolean("is_active").default(true),
  views: integer("views").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: Subscription Usage Tracking
export const subscriptionUsage = pgTable("subscription_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptions.id),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  unlocksUsed: integer("unlocks_used").default(0),
  unlocksLimit: integer("unlocks_limit").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Phase 4: WhatsApp Integration
export const whatsappLogs = pgTable("whatsapp_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  message: text("message").notNull(),
  clicked: boolean("clicked").default(false),
  clickedAt: timestamp("clicked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  providerProfile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.userId],
  }),
  jobs: many(jobs),
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.providerId],
  }),
  jobUnlocks: many(jobUnlocks),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [customerProfiles.userId],
    references: [users.id],
  }),
}));

export const providerProfilesRelations = relations(providerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [providerProfiles.userId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  customer: one(users, {
    fields: [jobs.customerId],
    references: [users.id],
  }),
  unlocks: many(jobUnlocks),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  provider: one(users, {
    fields: [wallets.providerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
  job: one(jobs, {
    fields: [transactions.jobId],
    references: [jobs.id],
  }),
}));

export const jobUnlocksRelations = relations(jobUnlocks, ({ one }) => ({
  job: one(jobs, {
    fields: [jobUnlocks.jobId],
    references: [jobs.id],
  }),
  provider: one(users, {
    fields: [jobUnlocks.providerId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const adminActionLogsRelations = relations(adminActionLogs, ({ one }) => ({
  admin: one(users, {
    fields: [adminActionLogs.adminId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertOtpSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
});

export const insertProviderProfileSchema = createInsertSchema(providerProfiles).omit({
  id: true,
  approvedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  unlockCount: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  lastRechargeAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertJobUnlockSchema = createInsertSchema(jobUnlocks).omit({
  id: true,
  unlockedAt: true,
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAdminActionLogSchema = createInsertSchema(adminActionLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;
export type InsertOtpCode = z.infer<typeof insertOtpSchema>;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type InsertProviderProfile = z.infer<typeof insertProviderProfileSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type JobUnlock = typeof jobUnlocks.$inferSelect;
export type InsertJobUnlock = z.infer<typeof insertJobUnlockSchema>;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AdminActionLog = typeof adminActionLogs.$inferSelect;
export type InsertAdminActionLog = z.infer<typeof insertAdminActionLogSchema>;

// Phase 4 Types
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
export type AiLog = typeof aiLogs.$inferSelect;
export type InsertAiLog = typeof aiLogs.$inferInsert;
export type EnhancedNotification = typeof enhancedNotifications.$inferSelect;
export type InsertEnhancedNotification = typeof enhancedNotifications.$inferInsert;
export type SeoPage = typeof seoPages.$inferSelect;
export type InsertSeoPage = typeof seoPages.$inferInsert;
export type SubscriptionUsage = typeof subscriptionUsage.$inferSelect;
export type InsertSubscriptionUsage = typeof subscriptionUsage.$inferInsert;
export type WhatsappLog = typeof whatsappLogs.$inferSelect;
export type InsertWhatsappLog = typeof whatsappLogs.$inferInsert;

// Phase 4 Schemas
export const insertReviewSchema = createInsertSchema(reviews);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertReferralSchema = createInsertSchema(referrals);
export const insertAiLogSchema = createInsertSchema(aiLogs);
export const insertEnhancedNotificationSchema = createInsertSchema(enhancedNotifications);
export const insertSeoPageSchema = createInsertSchema(seoPages);
export const insertSubscriptionUsageSchema = createInsertSchema(subscriptionUsage);
export const insertWhatsappLogSchema = createInsertSchema(whatsappLogs);

// Profile completion schemas
export const customerProfileCompletionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  location: z.string().min(5, "Please enter a complete address"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const providerProfileCompletionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  businessDetails: z.string().min(20, "Please provide detailed business information"),
  serviceCategories: z.array(z.string()).min(1, "Select at least one service category"),
  location: z.string().min(5, "Please enter your business address"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  serviceRadius: z.number().min(1).max(20).default(5),
});

export type CustomerProfileCompletion = z.infer<typeof customerProfileCompletionSchema>;
export type ProviderProfileCompletion = z.infer<typeof providerProfileCompletionSchema>;
