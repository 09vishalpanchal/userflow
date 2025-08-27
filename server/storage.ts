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
  getPendingUsers(): Promise<User[]>;
  approveUser(userId: string): Promise<void>;
  rejectUser(userId: string): Promise<void>;
  
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
  getAllProviders(): Promise<any[]>;
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
  // Mock data for demo purposes
  private mockProviders = [
    {
      id: 'prov_1',
      businessName: 'CleanPro Services',
      businessDetails: 'Professional home cleaning service with 5+ years of experience. We use eco-friendly products and provide deep cleaning solutions.',
      location: 'Bangalore',
      serviceCategories: ['Home Cleaning', 'Deep Cleaning'],
      startingPrice: 800,
      createdAt: new Date('2024-01-15'),
      rating: 4.8,
      reviewCount: 156,
      availability: 'Available Today',
      experience: 5
    },
    {
      id: 'prov_2',
      businessName: 'QuickFix Plumbing',
      businessDetails: 'Licensed plumber specializing in residential and commercial plumbing repairs, installations, and maintenance.',
      location: 'Mumbai',
      serviceCategories: ['Plumbing', 'Pipe Repair'],
      startingPrice: 500,
      createdAt: new Date('2024-01-20'),
      rating: 4.6,
      reviewCount: 89,
      availability: 'Available Now',
      experience: 7
    },
    {
      id: 'prov_3',
      businessName: 'ElectroMax Solutions',
      businessDetails: 'Certified electrician providing safe and reliable electrical services for homes and offices.',
      location: 'Delhi',
      serviceCategories: ['Electrical Work', 'Wiring'],
      startingPrice: 600,
      createdAt: new Date('2024-01-25'),
      rating: 4.9,
      reviewCount: 203,
      availability: 'Available This Week',
      experience: 8
    },
    {
      id: 'prov_4',
      businessName: 'CarpentryKing',
      businessDetails: 'Expert carpenter for furniture repair, custom woodwork, and home renovations.',
      location: 'Chennai',
      serviceCategories: ['Carpentry', 'Furniture Repair'],
      startingPrice: 750,
      createdAt: new Date('2024-02-01'),
      rating: 4.7,
      reviewCount: 124,
      availability: 'Available Tomorrow',
      experience: 6
    },
    {
      id: 'prov_5',
      businessName: 'ColorCraft Painters',
      businessDetails: 'Professional painting service for interior and exterior walls with premium quality paints.',
      location: 'Hyderabad',
      serviceCategories: ['Painting', 'Interior Design'],
      startingPrice: 400,
      createdAt: new Date('2024-02-05'),
      rating: 4.5,
      reviewCount: 78,
      availability: 'Available Next Week',
      experience: 4
    },
    {
      id: 'prov_6',
      businessName: 'GreenThumb Gardening',
      businessDetails: 'Landscape design and garden maintenance services for residential properties.',
      location: 'Pune',
      serviceCategories: ['Gardening', 'Landscaping'],
      startingPrice: 300,
      createdAt: new Date('2024-02-10'),
      rating: 4.4,
      reviewCount: 67,
      availability: 'Flexible',
      experience: 3
    }
  ];

  private mockJobs = [
    {
      id: 'job_1',
      title: 'Deep Cleaning for 3BHK Apartment',
      description: 'Need professional deep cleaning service for my 3BHK apartment. Kitchen, bathrooms, living areas, and bedrooms need thorough cleaning. Prefer eco-friendly products.',
      category: 'Home Cleaning',
      location: 'Bangalore',
      budget: 2500,
      urgency: 'asap',
      createdAt: new Date('2024-02-15'),
      customerName: 'Priya Sharma',
      proposals: 8
    },
    {
      id: 'job_2',
      title: 'Kitchen Sink Pipe Leakage Repair',
      description: 'My kitchen sink pipe is leaking and needs immediate attention. Water is dripping constantly and I need a professional plumber to fix it.',
      category: 'Plumbing',
      location: 'Mumbai',
      budget: 1200,
      urgency: 'urgent',
      createdAt: new Date('2024-02-16'),
      customerName: 'Amit Patel',
      proposals: 12
    },
    {
      id: 'job_3',
      title: 'Electrical Wiring for New Room',
      description: 'Need electrical wiring done for a newly constructed room. Requires power outlets, lights, and fan connections. Safety is priority.',
      category: 'Electrical Work',
      location: 'Delhi',
      budget: 5000,
      urgency: 'flexible',
      createdAt: new Date('2024-02-14'),
      customerName: 'Rahul Kumar',
      proposals: 6
    },
    {
      id: 'job_4',
      title: 'Wooden Cabinet Repair',
      description: 'My wooden kitchen cabinet door is broken and needs repair. The hinges are damaged and the door won\'t close properly.',
      category: 'Carpentry',
      location: 'Chennai',
      budget: 800,
      urgency: 'asap',
      createdAt: new Date('2024-02-17'),
      customerName: 'Lakshmi Iyer',
      proposals: 4
    },
    {
      id: 'job_5',
      title: 'Interior Wall Painting - Living Room',
      description: 'Looking for professional painters to paint my living room walls. Room size is approximately 200 sq ft. Need color consultation too.',
      category: 'Painting',
      location: 'Hyderabad',
      budget: 3500,
      urgency: 'flexible',
      createdAt: new Date('2024-02-13'),
      customerName: 'Suresh Reddy',
      proposals: 9
    },
    {
      id: 'job_6',
      title: 'Garden Landscaping and Maintenance',
      description: 'Need landscaping services for my front garden. Want to plant new flowers, trim existing plants, and general maintenance.',
      category: 'Gardening',
      location: 'Pune',
      budget: 2000,
      urgency: 'flexible',
      createdAt: new Date('2024-02-12'),
      customerName: 'Neha Joshi',
      proposals: 3
    },
    {
      id: 'job_7',
      title: 'AC Repair and Servicing',
      description: 'My split AC is not cooling properly and making strange noises. Need immediate repair and servicing by certified technician.',
      category: 'HVAC',
      location: 'Bangalore',
      budget: 1500,
      urgency: 'urgent',
      createdAt: new Date('2024-02-18'),
      customerName: 'Vikram Singh',
      proposals: 15
    },
    {
      id: 'job_8',
      title: 'Laptop Hardware Issue Fix',
      description: 'My laptop screen is flickering and sometimes goes blank. Need technical expert to diagnose and fix the hardware issue.',
      category: 'Tech Support',
      location: 'Mumbai',
      budget: 2200,
      urgency: 'asap',
      createdAt: new Date('2024-02-19'),
      customerName: 'Anjali Gupta',
      proposals: 7
    }
  ];
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
    return allJobs.concat(this.mockJobs);
  }

  async getAllProviders(): Promise<any[]> {
    // Get real providers from database - only select fields that actually exist
    const realProviders = await db
      .select({
        id: providerProfiles.id,
        businessName: providerProfiles.businessName,
        businessDetails: providerProfiles.businessDetails,
        location: providerProfiles.location,
        serviceCategories: providerProfiles.serviceCategories,
        rating: providerProfiles.rating,
        totalJobs: providerProfiles.totalJobs,
        status: providerProfiles.status
      })
      .from(providerProfiles)
      .where(eq(providerProfiles.status, 'approved'));
    
    // Transform the data to match expected format with default values
    const transformedProviders = realProviders.map(provider => ({
      ...provider,
      startingPrice: 500, // Default price
      reviewCount: provider.totalJobs || 0,
      availability: 'Available Today', // Default availability
      experience: 2, // Default experience years
      createdAt: new Date().toISOString(), // Current date as fallback
      // Ensure all mock provider fields are included
      name: provider.businessName
    }));
    
    // Combine with mock data
    return transformedProviders.concat(this.mockProviders);
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

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users)
      .where(and(eq(users.isVerified, true), eq(users.isApproved, false)))
      .orderBy(desc(users.createdAt));
  }

  async approveUser(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async rejectUser(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ isApproved: false })
      .where(eq(users.id, userId));
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
