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

      // Create user
      const user = await storage.createUser({
        phoneNumber,
        userType,
        isVerified: true
      });

      // Create wallet for providers
      if (userType === 'provider') {
        await storage.createWallet({
          providerId: user.id,
          balance: '0'
        });
      }

      res.json({ 
        message: "Phone verified successfully",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
          isVerified: user.isVerified
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

      await storage.markOtpAsUsed(otp.id);

      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified
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
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      
      // TODO: Send notifications to nearby providers
      
      res.json({ job });
    } catch (error) {
      res.status(400).json({ message: "Invalid job data" });
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

      if (job.unlockCount >= job.maxUnlocks) {
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
      if (parseFloat(wallet.balance) < unlockPrice) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Deduct from wallet
      const newBalance = (parseFloat(wallet.balance) - unlockPrice).toString();
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

      const newBalance = (parseFloat(wallet.balance) + amount).toString();
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

  // Admin routes
  app.get("/api/admin/providers/pending", async (req, res) => {
    try {
      const providers = await storage.getPendingProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/providers/:userId/approve", async (req, res) => {
    try {
      await storage.approveProvider(req.params.userId);
      res.json({ message: "Provider approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/providers/:userId/reject", async (req, res) => {
    try {
      await storage.rejectProvider(req.params.userId);
      res.json({ message: "Provider rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/users/:userId/block", async (req, res) => {
    try {
      await storage.updateUser(req.params.userId, { isBlocked: true });
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/users/:userId/unblock", async (req, res) => {
    try {
      await storage.updateUser(req.params.userId, { isBlocked: false });
      res.json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
