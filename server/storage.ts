import { 
  users, 
  otpCodes, 
  customerProfiles, 
  providerProfiles, 
  jobs, 
  wallets, 
  transactions, 
  jobUnlocks,
  adminSettings,
  notifications,
  adminActionLogs,
  reviews,
  subscriptions,
  referrals,
  aiLogs,
  enhancedNotifications,
  seoPages,
  whatsappLogs,
  type User, 
  type InsertUser,
  type OtpCode,
  type InsertOtpCode,
  type CustomerProfile,
  type InsertCustomerProfile,
  type ProviderProfile,
  type InsertProviderProfile,
  type Job,
  type InsertJob,
  type Wallet,
  type InsertWallet,
  type Transaction,
  type InsertTransaction,
  type JobUnlock,
  type InsertJobUnlock,
  type AdminSetting,
  type InsertAdminSetting,
  type Notification,
  type InsertNotification,
  type AdminActionLog,
  type InsertAdminActionLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Profile completion methods
  completeCustomerProfile(userId: string, profileData: any): Promise<User>;
  completeProviderProfile(userId: string, profileData: any): Promise<User>;
  
  // OTP methods
  createOtp(otp: InsertOtpCode): Promise<OtpCode>;
  getValidOtp(phoneNumber: string, code: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: string): Promise<void>;
  
  // Profile methods
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile | undefined>;
  
  createProviderProfile(profile: InsertProviderProfile): Promise<ProviderProfile>;
  getProviderProfile(userId: string): Promise<ProviderProfile | undefined>;
  updateProviderProfile(userId: string, updates: Partial<ProviderProfile>): Promise<ProviderProfile | undefined>;
  getPendingProviders(): Promise<ProviderProfile[]>;
  approveProvider(userId: string): Promise<void>;
  rejectProvider(userId: string): Promise<void>;
  
  // Job methods
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: string): Promise<Job | undefined>;
  getJobsNearLocation(latitude: number, longitude: number, radiusKm: number): Promise<Job[]>;
  getCustomerJobs(customerId: string): Promise<Job[]>;
  closeJob(jobId: string): Promise<void>;
  reopenJob(jobId: string): Promise<void>;
  hireAgain(originalJobId: string, newJobData: InsertJob): Promise<Job>;
  
  // Wallet methods
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  getWallet(providerId: string): Promise<Wallet | undefined>;
  updateWalletBalance(providerId: string, amount: string): Promise<Wallet | undefined>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getWalletTransactions(walletId: string): Promise<Transaction[]>;
  
  // Job unlock methods
  createJobUnlock(unlock: InsertJobUnlock): Promise<JobUnlock>;
  getJobUnlocks(jobId: string): Promise<JobUnlock[]>;
  hasProviderUnlockedJob(jobId: string, providerId: string): Promise<boolean>;
  incrementJobUnlockCount(jobId: string): Promise<void>;
  getCustomerUnlockedJobs(customerId: string): Promise<any[]>;
  
  // Admin methods
  getDashboardStats(): Promise<any>;
  getAllUsers(): Promise<User[]>;
  getAllJobs(): Promise<Job[]>;
  getAllWallets(): Promise<Wallet[]>;
  getAllTransactions(): Promise<Transaction[]>;
  getRecentAdminActions(): Promise<any[]>;
  createAdminActionLog(adminId: string, action: string, targetId?: string, targetType?: string, details?: string): Promise<void>;
  updateGlobalSettings(key: string, value: string, category: string, adminId: string): Promise<void>;
  getGlobalSettings(): Promise<any[]>;
  sendNotification(userId: string, title: string, message: string, type: string): Promise<void>;
  getAllNotifications(userId?: string): Promise<any[]>;
  
  // Phase 4 methods
  createReview(reviewData: any): Promise<any>;
  getJobReviews(jobId: string): Promise<any[]>;
  getProviderReviews(providerId: string): Promise<any[]>;
  updateProviderRating(providerId: string): Promise<void>;
  createSubscription(subscriptionData: any): Promise<any>;
  getActiveSubscription(userId: string): Promise<any>;
  createReferral(referralData: any): Promise<any>;
  getReferralByCode(code: string): Promise<any>;
  logAiAction(logData: any): Promise<void>;
  createWhatsappLog(logData: any): Promise<void>;
  getSeoPage(slug: string): Promise<any>;
  createSeoPage(pageData: any): Promise<any>;
  detectDuplicateJob(jobData: any): Promise<any[]>;
  autoDetectCategory(description: string): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // OTP methods
  async createOtp(otp: InsertOtpCode): Promise<OtpCode> {
    const [otpCode] = await db.insert(otpCodes).values(otp).returning();
    return otpCode;
  }

  async getValidOtp(phoneNumber: string, code: string): Promise<OtpCode | undefined> {
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.phoneNumber, phoneNumber),
          eq(otpCodes.code, code),
          eq(otpCodes.isUsed, false),
          sql`${otpCodes.expiresAt} > NOW()`
        )
      );
    return otp || undefined;
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, id));
  }

  // Profile methods
  async createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile> {
    const [customerProfile] = await db.insert(customerProfiles).values(profile).returning();
    return customerProfile;
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    const [profile] = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId));
    return profile || undefined;
  }

  async updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile | undefined> {
    const [profile] = await db
      .update(customerProfiles)
      .set(updates)
      .where(eq(customerProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async createProviderProfile(profile: InsertProviderProfile): Promise<ProviderProfile> {
    const [providerProfile] = await db.insert(providerProfiles).values(profile).returning();
    return providerProfile;
  }

  async getProviderProfile(userId: string): Promise<ProviderProfile | undefined> {
    const [profile] = await db.select().from(providerProfiles).where(eq(providerProfiles.userId, userId));
    return profile || undefined;
  }

  async updateProviderProfile(userId: string, updates: Partial<ProviderProfile>): Promise<ProviderProfile | undefined> {
    const [profile] = await db
      .update(providerProfiles)
      .set(updates)
      .where(eq(providerProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getPendingProviders(): Promise<ProviderProfile[]> {
    return await db.select().from(providerProfiles).where(eq(providerProfiles.status, 'pending'));
  }

  async approveProvider(userId: string): Promise<void> {
    await db
      .update(providerProfiles)
      .set({ status: 'approved', approvedAt: new Date() })
      .where(eq(providerProfiles.userId, userId));
  }

  async rejectProvider(userId: string): Promise<void> {
    await db
      .update(providerProfiles)
      .set({ status: 'rejected' })
      .where(eq(providerProfiles.userId, userId));
  }

  // Job methods
  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  // Duplicate method removed - getJob already exists with same functionality

  async getAllJobs(): Promise<Job[]> {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    return allJobs;
  }

  async getJobsNearLocation(latitude: number, longitude: number, radiusKm: number): Promise<Job[]> {
    // Using Haversine formula to calculate distance
    const jobsNear = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.status, 'open'),
          sql`(
            6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(${jobs.latitude})) * 
              cos(radians(${jobs.longitude}) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(${jobs.latitude}))
            )
          ) <= ${radiusKm}`
        )
      )
      .orderBy(desc(jobs.createdAt));
    
    return jobsNear;
  }

  async getCustomerJobs(customerId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.customerId, customerId))
      .orderBy(desc(jobs.createdAt));
  }

  // Wallet methods
  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async getWallet(providerId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.providerId, providerId));
    return wallet || undefined;
  }

  async updateWalletBalance(providerId: string, amount: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .update(wallets)
      .set({ balance: amount })
      .where(eq(wallets.providerId, providerId))
      .returning();
    return wallet || undefined;
  }

  // Transaction methods
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getWalletTransactions(walletId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.walletId, walletId))
      .orderBy(desc(transactions.createdAt));
  }

  // Job unlock methods
  async createJobUnlock(unlock: InsertJobUnlock): Promise<JobUnlock> {
    const [newUnlock] = await db.insert(jobUnlocks).values(unlock).returning();
    return newUnlock;
  }

  async getJobUnlocks(jobId: string): Promise<JobUnlock[]> {
    return await db.select().from(jobUnlocks).where(eq(jobUnlocks.jobId, jobId));
  }

  async hasProviderUnlockedJob(jobId: string, providerId: string): Promise<boolean> {
    const [unlock] = await db
      .select()
      .from(jobUnlocks)
      .where(and(eq(jobUnlocks.jobId, jobId), eq(jobUnlocks.providerId, providerId)));
    return !!unlock;
  }

  async incrementJobUnlockCount(jobId: string): Promise<void> {
    await db
      .update(jobs)
      .set({ unlockCount: sql`${jobs.unlockCount} + 1` })
      .where(eq(jobs.id, jobId));
  }

  // Profile completion methods
  async completeCustomerProfile(userId: string, profileData: any): Promise<User> {
    // Update user table
    const [user] = await db
      .update(users)
      .set({
        name: profileData.name,
        email: profileData.email,
        password: profileData.password,
        profileCompleted: true
      })
      .where(eq(users.id, userId))
      .returning();

    // Check if customer profile already exists
    const [existingProfile] = await db
      .select()
      .from(customerProfiles)
      .where(eq(customerProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      // Update existing profile
      await db
        .update(customerProfiles)
        .set({
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString()
        })
        .where(eq(customerProfiles.userId, userId));
    } else {
      // Create new profile
      await db
        .insert(customerProfiles)
        .values({
          userId: userId,
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString()
        });
    }

    return user;
  }

  async completeProviderProfile(userId: string, profileData: any): Promise<User> {
    // Update user table
    const [user] = await db
      .update(users)
      .set({
        name: profileData.name,
        email: profileData.email,
        password: profileData.password,
        profileCompleted: true
      })
      .where(eq(users.id, userId))
      .returning();

    // Check if provider profile already exists
    const [existingProfile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      // Update existing profile
      await db
        .update(providerProfiles)
        .set({
          businessName: profileData.businessName,
          businessDetails: profileData.businessDetails,
          serviceCategories: profileData.serviceCategories,
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString(),
          serviceRadius: profileData.serviceRadius,
          documentsUploaded: profileData.documents?.length > 0 || false,
          documents: profileData.documents || []
        })
        .where(eq(providerProfiles.userId, userId));
    } else {
      // Create new profile
      await db
        .insert(providerProfiles)
        .values({
          userId: userId,
          businessName: profileData.businessName,
          businessDetails: profileData.businessDetails,
          serviceCategories: profileData.serviceCategories,
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString(),
          serviceRadius: profileData.serviceRadius,
          status: 'pending',
          documentsUploaded: profileData.documents?.length > 0 || false,
          documents: profileData.documents || []
        });
    }

    return user;
  }

  // Enhanced Job Methods
  async closeJob(jobId: string): Promise<void> {
    await db.update(jobs).set({ status: 'closed' }).where(eq(jobs.id, jobId));
  }

  async reopenJob(jobId: string): Promise<void> {
    await db.update(jobs).set({ status: 'open' }).where(eq(jobs.id, jobId));
  }

  async hireAgain(originalJobId: string, newJobData: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(newJobData).returning();
    return job;
  }

  async getCustomerUnlockedJobs(customerId: string): Promise<any[]> {
    try {
      const unlocked = await db
        .select({
          id: jobUnlocks.id,
          jobId: jobUnlocks.jobId,
          providerId: jobUnlocks.providerId,
          providerName: users.name,
          providerPhone: users.phoneNumber,
          providerRating: sql<string>`COALESCE(${providerProfiles.rating}, '0')`.as('providerRating'),
          unlockedAt: jobUnlocks.unlockedAt,
        })
        .from(jobUnlocks)
        .innerJoin(jobs, eq(jobUnlocks.jobId, jobs.id))
        .innerJoin(users, eq(jobUnlocks.providerId, users.id))
        .leftJoin(providerProfiles, eq(users.id, providerProfiles.userId))
        .where(eq(jobs.customerId, customerId))
        .orderBy(desc(jobUnlocks.unlockedAt));

      return unlocked.map(unlock => ({
        ...unlock,
        providerRating: parseFloat(unlock.providerRating || '0'),
        whatsappLink: unlock.providerPhone 
          ? `https://wa.me/${unlock.providerPhone.replace('+', '')}?text=Hi, I saw your profile on ServiceConnect and would like to discuss the job.`
          : undefined
      }));
    } catch (error) {
      console.error('Error in getCustomerUnlockedJobs:', error);
      return [];
    }
  }

  // Admin methods
  async getDashboardStats(): Promise<any> {
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const activeProviders = await db.select({ count: sql<number>`count(*)` }).from(providerProfiles).where(eq(providerProfiles.status, 'approved'));
    const totalJobs = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    const monthlyRevenue = await db.select({ sum: sql<number>`sum(amount::numeric)` }).from(transactions).where(eq(transactions.type, 'unlock'));
    const pendingProviders = await db.select({ count: sql<number>`count(*)` }).from(providerProfiles).where(eq(providerProfiles.status, 'pending'));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      activeProviders: activeProviders[0]?.count || 0,
      totalJobs: totalJobs[0]?.count || 0,
      monthlyRevenue: monthlyRevenue[0]?.sum || 0,
      pendingApprovals: pendingProviders[0]?.count || 0
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Duplicate method removed - getAllJobs already exists in MemStorage above

  async getAllWallets(): Promise<Wallet[]> {
    return await db.select().from(wallets).orderBy(desc(wallets.lastRechargeAt));
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getRecentAdminActions(): Promise<any[]> {
    return await db
      .select({
        id: adminActionLogs.id,
        action: adminActionLogs.action,
        targetId: adminActionLogs.targetId,
        targetType: adminActionLogs.targetType,
        details: adminActionLogs.details,
        createdAt: adminActionLogs.createdAt,
        adminName: users.name
      })
      .from(adminActionLogs)
      .leftJoin(users, eq(adminActionLogs.adminId, users.id))
      .orderBy(desc(adminActionLogs.createdAt))
      .limit(10);
  }

  async createAdminActionLog(adminId: string, action: string, targetId?: string, targetType?: string, details?: string): Promise<void> {
    await db.insert(adminActionLogs).values({
      adminId,
      action,
      targetId,
      targetType,
      details
    });
  }

  async updateGlobalSettings(key: string, value: string, category: string, adminId: string): Promise<void> {
    await db
      .insert(adminSettings)
      .values({
        settingKey: key,
        settingValue: value,
        category,
        updatedBy: adminId
      })
      .onConflictDoUpdate({
        target: adminSettings.settingKey,
        set: {
          settingValue: value,
          updatedBy: adminId,
          updatedAt: sql`now()`
        }
      });
  }

  async getGlobalSettings(): Promise<any[]> {
    return await db.select().from(adminSettings).orderBy(adminSettings.category, adminSettings.settingKey);
  }

  async sendNotification(userId: string, title: string, message: string, type: string): Promise<void> {
    await db.insert(notifications).values({
      userId,
      title,
      message,
      type
    });
  }

  async getAllNotifications(userId?: string): Promise<any[]> {
    const query = db.select().from(notifications);
    
    if (userId) {
      return await query.where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
    }
    
    return await query.orderBy(desc(notifications.createdAt)).limit(50);
  }

  // Phase 4 Implementation
  async createReview(reviewData: any): Promise<any> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    
    // Update provider rating
    await this.updateProviderRating(reviewData.providerId);
    
    return review;
  }

  async getJobReviews(jobId: string): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        customerName: users.name,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.customerId, users.id))
      .where(eq(reviews.jobId, jobId));
  }

  async getProviderReviews(providerId: string): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        customerName: users.name,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.customerId, users.id))
      .where(eq(reviews.providerId, providerId));
  }

  async updateProviderRating(providerId: string): Promise<void> {
    const avgRating = await db
      .select({ avg: sql<number>`avg(cast(rating as decimal))` })
      .from(reviews)
      .where(eq(reviews.providerId, providerId));

    if (avgRating[0]?.avg) {
      await db
        .update(providerProfiles)
        .set({ rating: avgRating[0].avg.toString() })
        .where(eq(providerProfiles.userId, providerId));
    }
  }

  async createSubscription(subscriptionData: any): Promise<any> {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }

  async getActiveSubscription(userId: string): Promise<any> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ))
      .orderBy(desc(subscriptions.createdAt));
    
    return subscription;
  }

  async createReferral(referralData: any): Promise<any> {
    const [referral] = await db.insert(referrals).values(referralData).returning();
    return referral;
  }

  async getReferralByCode(code: string): Promise<any> {
    const [referral] = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referralCode, code));
    
    return referral;
  }

  async logAiAction(logData: any): Promise<void> {
    await db.insert(aiLogs).values(logData);
  }

  async createWhatsappLog(logData: any): Promise<void> {
    await db.insert(whatsappLogs).values(logData);
  }

  async getSeoPage(slug: string): Promise<any> {
    const [page] = await db
      .select()
      .from(seoPages)
      .where(and(eq(seoPages.slug, slug), eq(seoPages.isActive, true)));
    
    return page;
  }

  async createSeoPage(pageData: any): Promise<any> {
    const [page] = await db.insert(seoPages).values(pageData).returning();
    return page;
  }

  async detectDuplicateJob(jobData: any): Promise<any[]> {
    // Simple duplicate detection based on title and location similarity
    const duplicates = await db
      .select()
      .from(jobs)
      .where(and(
        eq(jobs.customerId, jobData.customerId),
        eq(jobs.category, jobData.category),
        eq(jobs.status, 'open')
      ))
      .limit(5);

    return duplicates.filter(job => 
      job.title.toLowerCase().includes(jobData.title.toLowerCase().substring(0, 10)) ||
      job.location.toLowerCase().includes(jobData.location.toLowerCase().substring(0, 10))
    );
  }

  async autoDetectCategory(description: string): Promise<string> {
    // Simple category detection based on keywords
    const text = description.toLowerCase();
    
    if (text.includes('clean') || text.includes('maid') || text.includes('house')) {
      return 'Home Cleaning';
    }
    if (text.includes('plumb') || text.includes('pipe') || text.includes('leak')) {
      return 'Plumbing';
    }
    if (text.includes('electric') || text.includes('wire') || text.includes('power')) {
      return 'Electrical';
    }
    if (text.includes('beauty') || text.includes('makeup') || text.includes('hair')) {
      return 'Beauty & Personal Care';
    }
    if (text.includes('repair') || text.includes('fix') || text.includes('maintenance')) {
      return 'Home Repairs';
    }
    
    return 'General Services';
  }
}

export const storage = new DatabaseStorage();
