import { 
  users, 
  otpCodes, 
  customerProfiles, 
  providerProfiles, 
  jobs, 
  wallets, 
  transactions, 
  jobUnlocks,
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
  type InsertJobUnlock
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

    // Create or update customer profile
    await db
      .insert(customerProfiles)
      .values({
        userId: userId,
        location: profileData.location,
        latitude: profileData.latitude?.toString(),
        longitude: profileData.longitude?.toString()
      })
      .onConflictDoUpdate({
        target: customerProfiles.userId,
        set: {
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString()
        }
      });

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

    // Create or update provider profile
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
      })
      .onConflictDoUpdate({
        target: providerProfiles.userId,
        set: {
          businessName: profileData.businessName,
          businessDetails: profileData.businessDetails,
          serviceCategories: profileData.serviceCategories,
          location: profileData.location,
          latitude: profileData.latitude?.toString(),
          longitude: profileData.longitude?.toString(),
          serviceRadius: profileData.serviceRadius,
          documentsUploaded: profileData.documents?.length > 0 || false,
          documents: profileData.documents || []
        }
      });

    return user;
  }
}

export const storage = new DatabaseStorage();
