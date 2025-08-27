import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertOtpSchema, insertCustomerProfileSchema, insertProviderProfileSchema, insertJobSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { phoneNumber, userType } = z.object({
        phoneNumber: z.string(),
        userType: z.enum(['customer', 'provider'])
      }).parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phoneNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this phone number" });
      }

      // Generate OTP (6 digits)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createOtp({
        phoneNumber,
        code,
        expiresAt,
        isUsed: false
      });

      // In production, send SMS with OTP code
      console.log(`OTP for ${phoneNumber}: ${code}`);
      
      res.json({ 
        message: "OTP sent successfully",
        // In development, return the code for testing
        ...(process.env.NODE_ENV === 'development' && { code })
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, code, userType } = z.object({
        phoneNumber: z.string(),
        code: z.string(),
        userType: z.enum(['customer', 'provider'])
      }).parse(req.body);

      const otp = await storage.getValidOtp(phoneNumber, code);
      if (!otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await storage.markOtpAsUsed(otp.id);

      // Create user (requires admin approval)
      const user = await storage.createUser({
        phoneNumber,
        userType,
        isVerified: true,
        isApproved: false // Requires admin approval
      });

      // Create wallet for providers
      if (userType === 'provider') {
        await storage.createWallet({
          providerId: user.id,
          balance: '0'
        });
      }

      res.json({ 
        message: "Phone verified successfully. Your account is pending admin approval.",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
          isVerified: user.isVerified,
          isApproved: user.isApproved
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phoneNumber } = z.object({
        phoneNumber: z.string()
      }).parse(req.body);

      const user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isBlocked) {
        return res.status(403).json({ message: "Account is blocked" });
      }

      if (!user.isApproved) {
        return res.status(403).json({ message: "Account is pending admin approval" });
      }

      // Generate OTP for login
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await storage.createOtp({
        phoneNumber,
        code,
        expiresAt,
        isUsed: false
      });

      console.log(`Login OTP for ${phoneNumber}: ${code}`);
      
      res.json({ 
        message: "OTP sent successfully",
        ...(process.env.NODE_ENV === 'development' && { code })
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/login-verify", async (req, res) => {
    try {
      const { phoneNumber, code } = z.object({
        phoneNumber: z.string(),
        code: z.string()
      }).parse(req.body);

      const otp = await storage.getValidOtp(phoneNumber, code);
      if (!otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isApproved) {
        return res.status(403).json({ message: "Account is pending admin approval" });
      }

      await storage.markOtpAsUsed(otp.id);

      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
          isApproved: user.isApproved
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Profile routes
  app.post("/api/profiles/customer", async (req, res) => {
    try {
      const profileData = insertCustomerProfileSchema.parse(req.body);
      const profile = await storage.createCustomerProfile(profileData);
      
      // Update user with name and email
      await storage.updateUser(profileData.userId, {
        name: req.body.name,
        email: req.body.email
      });

      res.json({ profile });
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.post("/api/profiles/provider", async (req, res) => {
    try {
      const profileData = insertProviderProfileSchema.parse(req.body);
      const profile = await storage.createProviderProfile(profileData);
      
      // Update user with name and email
      await storage.updateUser(profileData.userId, {
        name: req.body.name,
        email: req.body.email
      });

      res.json({ profile });
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.get("/api/profiles/customer/:userId", async (req, res) => {
    try {
      const profile = await storage.getCustomerProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json({ profile });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profiles/provider/:userId", async (req, res) => {
    try {
      const profile = await storage.getProviderProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json({ profile });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Job routes
  app.post("/api/jobs", async (req, res) => {
    try {
      console.log("Raw job data received:", req.body);
      const jobData = insertJobSchema.parse(req.body);
      console.log("Parsed job data:", jobData);
      const job = await storage.createJob(jobData);
      
      // TODO: Send notifications to nearby providers
      
      res.json({ job });
    } catch (error) {
      console.error("Job creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ 
          message: "Invalid job data", 
          errors: error.errors 
        });
      } else {
        res.status(400).json({ message: "Invalid job data" });
      }
    }
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        "Home Cleaning",
        "Plumbing",
        "Electrical Work", 
        "Carpentry",
        "Painting",
        "HVAC",
        "Appliance Repair",
        "Gardening",
        "Beauty & Spa",
        "Auto Services",
        "Tech Support",
        "Tutoring",
        "Pet Care",
        "Moving Services",
        "Photography",
        "Catering",
        "Event Planning",
        "Interior Design"
      ];
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Browse Jobs API
  app.get("/api/jobs/browse", async (req, res) => {
    try {
      const { category, city, radius, search } = req.query;
      const jobs = await storage.getAllJobs(); // Get all jobs from database
      
      // Filter jobs based on query parameters
      let filteredJobs = jobs.filter(job => job.status === 'open');
      
      if (category && category !== 'All Categories') {
        filteredJobs = filteredJobs.filter(job => job.category === category);
      }
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        );
      }

      res.json({ jobs: filteredJobs });
    } catch (error) {
      console.error("Browse jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Recent Jobs API for homepage
  app.get("/api/jobs/recent", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      const recentJobs = jobs
        .filter(job => job.status === 'open')
        .sort((a, b) => {
          const dateB = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateA = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        })
        .slice(0, 3); // Get 3 most recent jobs
      
      res.json({ jobs: recentJobs });
    } catch (error) {
      console.error("Recent jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Individual Job Details API
  app.get("/api/job/:jobId", async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await storage.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get customer info for the job
      const customer = await storage.getUser(job.customerId);
      
      const jobWithCustomer = {
        ...job,
        customer: {
          name: customer?.name || "Anonymous",
          rating: 4.8, // Could be calculated from reviews
          totalJobs: 15 // Could be counted from database
        }
      };

      res.json({ job: jobWithCustomer });
    } catch (error) {
      console.error("Job details error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/near", async (req, res) => {
    try {
      const { latitude, longitude, radius = 5 } = z.object({
        latitude: z.string().transform(Number),
        longitude: z.string().transform(Number),
        radius: z.string().transform(Number).optional()
      }).parse(req.query);

      const jobs = await storage.getJobsNearLocation(latitude, longitude, radius);
      res.json({ jobs });
    } catch (error) {
      res.status(400).json({ message: "Invalid location parameters" });
    }
  });

  app.get("/api/jobs/customer/:customerId", async (req, res) => {
    try {
      const jobs = await storage.getCustomerJobs(req.params.customerId);
      res.json({ jobs });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/jobs/:jobId/unlock", async (req, res) => {
    try {
      const { providerId } = z.object({
        providerId: z.string()
      }).parse(req.body);

      const job = await storage.getJob(req.params.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if ((job.unlockCount || 0) >= (job.maxUnlocks || 3)) {
        return res.status(400).json({ message: "Maximum unlocks reached for this job" });
      }

      // Check if provider already unlocked this job
      const hasUnlocked = await storage.hasProviderUnlockedJob(req.params.jobId, providerId);
      if (hasUnlocked) {
        return res.status(400).json({ message: "You have already unlocked this job" });
      }

      // Check wallet balance
      const wallet = await storage.getWallet(providerId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const unlockPrice = 100; // ₹100 per unlock
      if (parseFloat(wallet.balance || '0') < unlockPrice) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Deduct from wallet
      const newBalance = (parseFloat(wallet.balance || '0') - unlockPrice).toString();
      await storage.updateWalletBalance(providerId, newBalance);

      // Create transaction record
      await storage.createTransaction({
        walletId: wallet.id,
        type: 'unlock',
        amount: unlockPrice.toString(),
        jobId: req.params.jobId,
        description: `Unlocked job: ${job.title}`
      });

      // Create unlock record
      await storage.createJobUnlock({
        jobId: req.params.jobId,
        providerId
      });

      // Increment unlock count
      await storage.incrementJobUnlockCount(req.params.jobId);

      // Get customer details for contact
      const customer = await storage.getUser(job.customerId);
      
      res.json({ 
        message: "Job unlocked successfully",
        customerContact: {
          name: customer?.name,
          phoneNumber: customer?.phoneNumber
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Wallet routes
  app.get("/api/wallet/:providerId", async (req, res) => {
    try {
      const wallet = await storage.getWallet(req.params.providerId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const transactions = await storage.getWalletTransactions(wallet.id);
      
      res.json({ 
        wallet,
        transactions 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/wallet/:providerId/recharge", async (req, res) => {
    try {
      const { amount } = z.object({
        amount: z.number().positive()
      }).parse(req.body);

      const wallet = await storage.getWallet(req.params.providerId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const newBalance = (parseFloat(wallet.balance || '0') + amount).toString();
      await storage.updateWalletBalance(req.params.providerId, newBalance);

      // Create transaction record
      await storage.createTransaction({
        walletId: wallet.id,
        type: 'recharge',
        amount: amount.toString(),
        description: `Wallet recharge of ₹${amount}`
      });

      res.json({ 
        message: "Wallet recharged successfully",
        newBalance 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid recharge amount" });
    }
  });

  // Profile completion routes
  app.post("/api/profile/customer/complete", async (req, res) => {
    try {
      const { userId, ...profileData } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const user = await storage.completeCustomerProfile(userId, profileData);
      
      res.json({ 
        message: "Customer profile completed successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileCompleted: user.profileCompleted
        }
      });
    } catch (error) {
      console.error("Customer profile completion error:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });

  app.post("/api/profile/provider/complete", async (req, res) => {
    try {
      // Handle both JSON and FormData formats
      let userId, profileData;
      
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        // JSON format
        ({ userId, profileData } = req.body);
      } else {
        // FormData format
        userId = req.body.userId;
        profileData = req.body.profileData;
      }
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Parse profile data if it's a string (from multipart/form-data)
      const parsedProfileData = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
      
      const user = await storage.completeProviderProfile(userId, parsedProfileData);
      
      res.json({ 
        message: "Provider profile submitted for approval",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileCompleted: user.profileCompleted
        }
      });
    } catch (error) {
      console.error("Provider profile completion error:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });

  // Enhanced Admin routes
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json({ stats });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/actions/recent", async (req, res) => {
    try {
      const actions = await storage.getRecentAdminActions();
      res.json({ actions });
    } catch (error) {
      console.error("Recent actions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/providers/pending", async (req, res) => {
    try {
      const providers = await storage.getPendingProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get pending users for approval
  app.get("/api/admin/users/pending", async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      res.json({ users: pendingUsers });
    } catch (error) {
      console.error("Get pending users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Approve user
  app.post("/api/admin/users/:userId/approve", async (req, res) => {
    try {
      const { adminId } = req.body;
      await storage.approveUser(req.params.userId);
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Approved user", req.params.userId, 'user', 'User account approved');
        // Send approval notification
        await storage.sendNotification(
          req.params.userId,
          "Account Approved",
          "Your account has been approved! You can now access all features.",
          "approval"
        );
      }
      
      res.json({ message: "User approved successfully" });
    } catch (error) {
      console.error("Approve user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reject user
  app.post("/api/admin/users/:userId/reject", async (req, res) => {
    try {
      const { adminId, reason } = req.body;
      await storage.rejectUser(req.params.userId);
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Rejected user", req.params.userId, 'user', reason || 'User registration rejected');
        // Send rejection notification
        await storage.sendNotification(
          req.params.userId,
          "Account Rejected",
          `Your account registration has been rejected. ${reason || 'Please contact support for more information.'}`,
          "rejection"
        );
      }
      
      res.json({ message: "User rejected successfully" });
    } catch (error) {
      console.error("Reject user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json({ jobs });
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/wallets", async (req, res) => {
    try {
      const wallets = await storage.getAllWallets();
      res.json({ wallets });
    } catch (error) {
      console.error("Get wallets error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json({ transactions });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getGlobalSettings();
      res.json({ settings });
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const { key, value, category, adminId } = req.body;
      
      if (!key || !value || !category || !adminId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      await storage.updateGlobalSettings(key, value, category, adminId);
      await storage.createAdminActionLog(adminId, `Updated setting: ${key}`, key, 'setting');
      
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/notifications/send", async (req, res) => {
    try {
      const { userId, title, message, type, adminId } = req.body;
      
      if (!userId || !title || !message || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      await storage.sendNotification(userId, title, message, type);
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, `Sent notification: ${title}`, userId, 'notification');
      }
      
      res.json({ message: "Notification sent successfully" });
    } catch (error) {
      console.error("Send notification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/notifications", async (req, res) => {
    try {
      const { userId } = req.query;
      const notifications = await storage.getAllNotifications(userId as string);
      res.json({ notifications });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/wallet/add-balance", async (req, res) => {
    try {
      const { providerId, amount, adminId } = req.body;
      
      if (!providerId || !amount || !adminId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const currentWallet = await storage.getWallet(providerId);
      if (!currentWallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      const newBalance = (parseFloat(currentWallet.balance) + parseFloat(amount)).toString();
      await storage.updateWalletBalance(providerId, newBalance);
      
      // Create transaction record
      await storage.createTransaction({
        walletId: currentWallet.id,
        type: 'recharge',
        amount: amount,
        description: `Admin balance addition by ${adminId}`
      });
      
      await storage.createAdminActionLog(adminId, `Added ₹${amount} to provider wallet`, providerId, 'wallet');
      
      res.json({ message: "Balance added successfully", newBalance });
    } catch (error) {
      console.error("Add balance error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/providers/:userId/approve", async (req, res) => {
    try {
      const { adminId } = req.body;
      await storage.approveProvider(req.params.userId);
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Approved provider", req.params.userId, 'provider');
        // Send approval notification
        await storage.sendNotification(
          req.params.userId,
          "Profile Approved!",
          "Your service provider profile has been approved. You can now start receiving job requests.",
          "approval"
        );
      }
      
      res.json({ message: "Provider approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/providers/:userId/reject", async (req, res) => {
    try {
      const { adminId, reason } = req.body;
      await storage.rejectProvider(req.params.userId);
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Rejected provider", req.params.userId, 'provider', reason);
        // Send rejection notification
        await storage.sendNotification(
          req.params.userId,
          "Profile Rejected",
          `Your service provider application has been rejected. ${reason || 'Please review and resubmit with correct information.'}`,
          "rejection"
        );
      }
      
      res.json({ message: "Provider rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/users/:userId/block", async (req, res) => {
    try {
      const { adminId, reason } = req.body;
      await storage.updateUser(req.params.userId, { isBlocked: true });
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Blocked user", req.params.userId, 'user', reason);
        // Send block notification
        await storage.sendNotification(
          req.params.userId,
          "Account Blocked",
          `Your account has been temporarily blocked. ${reason || 'Please contact support for more information.'}`,
          "block"
        );
      }
      
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/users/:userId/unblock", async (req, res) => {
    try {
      const { adminId } = req.body;
      await storage.updateUser(req.params.userId, { isBlocked: false });
      
      if (adminId) {
        await storage.createAdminActionLog(adminId, "Unblocked user", req.params.userId, 'user');
        // Send unblock notification
        await storage.sendNotification(
          req.params.userId,
          "Account Restored",
          "Your account has been restored. You can now access all platform features.",
          "unblock"
        );
      }
      
      res.json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: Enhanced Job Management Routes
  app.post("/api/jobs/:jobId/close", async (req, res) => {
    try {
      await storage.closeJob(req.params.jobId);
      res.json({ message: "Job closed successfully" });
    } catch (error) {
      console.error("Close job error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/jobs/:jobId/reopen", async (req, res) => {
    try {
      await storage.reopenJob(req.params.jobId);
      res.json({ message: "Job reopened successfully" });
    } catch (error) {
      console.error("Reopen job error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/jobs/hire-again", async (req, res) => {
    try {
      const { originalJobId, ...newJobData } = req.body;
      
      // Auto-detect category if not provided or vague
      if (!newJobData.category || newJobData.category === 'General Services') {
        const detectedCategory = await storage.autoDetectCategory(newJobData.description);
        newJobData.category = detectedCategory;
        
        // Log AI action
        await storage.logAiAction({
          jobId: null,
          type: 'category_detection',
          originalData: newJobData.description,
          processedData: detectedCategory,
          confidence: '0.85',
          action: 'category_suggested'
        });
      }
      
      // Check for duplicate jobs
      const duplicates = await storage.detectDuplicateJob(newJobData);
      if (duplicates.length > 0) {
        await storage.logAiAction({
          jobId: null,
          type: 'duplicate_detection',
          originalData: JSON.stringify(newJobData),
          processedData: `Found ${duplicates.length} similar jobs`,
          confidence: '0.75',
          action: 'duplicate_flagged'
        });
        
        return res.status(409).json({
          message: "Similar job detected",
          duplicates: duplicates.slice(0, 3),
          suggestion: "You have similar active jobs. Consider updating existing ones instead."
        });
      }
      
      const newJob = await storage.hireAgain(originalJobId, newJobData);
      res.json({ message: "Job reposted successfully", job: newJob });
    } catch (error) {
      console.error("Hire again error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/unlocked/:customerId", async (req, res) => {
    try {
      const unlockedJobs = await storage.getCustomerUnlockedJobs(req.params.customerId);
      res.json({ unlockedJobs });
    } catch (error) {
      console.error("Get unlocked jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: Reviews & Rating System
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = {
        ...req.body,
        createdAt: new Date(),
      };
      
      const review = await storage.createReview(reviewData);
      res.json({ message: "Review submitted successfully", review });
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/reviews/job/:jobId", async (req, res) => {
    try {
      const reviews = await storage.getJobReviews(req.params.jobId);
      res.json({ reviews });
    } catch (error) {
      console.error("Get job reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/reviews/provider/:providerId", async (req, res) => {
    try {
      const reviews = await storage.getProviderReviews(req.params.providerId);
      res.json({ reviews });
    } catch (error) {
      console.error("Get provider reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: WhatsApp Integration
  app.post("/api/whatsapp/log", async (req, res) => {
    try {
      await storage.createWhatsappLog(req.body);
      res.json({ message: "WhatsApp interaction logged" });
    } catch (error) {
      console.error("WhatsApp log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: Subscription Plans
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscription = await storage.createSubscription(req.body);
      res.json({ message: "Subscription created successfully", subscription });
    } catch (error) {
      console.error("Create subscription error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/subscriptions/:userId", async (req, res) => {
    try {
      const subscription = await storage.getActiveSubscription(req.params.userId);
      res.json({ subscription });
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: Referral System
  app.post("/api/referrals", async (req, res) => {
    try {
      const referralData = {
        ...req.body,
        referralCode: `REF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: new Date(),
      };
      
      const referral = await storage.createReferral(referralData);
      res.json({ message: "Referral created successfully", referral });
    } catch (error) {
      console.error("Create referral error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/referrals/:code", async (req, res) => {
    try {
      const referral = await storage.getReferralByCode(req.params.code);
      if (!referral) {
        return res.status(404).json({ message: "Referral code not found" });
      }
      res.json({ referral });
    } catch (error) {
      console.error("Get referral error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Phase 4: SEO Landing Pages
  app.get("/api/seo/:slug", async (req, res) => {
    try {
      const page = await storage.getSeoPage(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Increment views
      await storage.createSeoPage({
        ...page,
        views: page.views + 1,
        lastUpdated: new Date()
      });
      
      res.json({ page });
    } catch (error) {
      console.error("Get SEO page error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/seo/pages", async (req, res) => {
    try {
      const page = await storage.createSeoPage(req.body);
      res.json({ message: "SEO page created successfully", page });
    } catch (error) {
      console.error("Create SEO page error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
