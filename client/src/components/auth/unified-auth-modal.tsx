import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authUtils } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const otpSchema = z.object({
  code: z.string().min(6, "OTP must be 6 digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnifiedAuthModal({ isOpen, onClose }: UnifiedAuthModalProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const authMutation = useMutation({
    mutationFn: async (data: PhoneFormData) => {
      if (isLogin) {
        // Try login first
        const response = await apiRequest("POST", "/api/auth/login", data);
        return { type: 'login', data: await response.json() };
      } else {
        // Register new user as customer (they'll choose role during profile completion)
        const response = await apiRequest("POST", "/api/auth/register", {
          ...data,
          userType: 'customer'
        });
        return { type: 'register', data: await response.json() };
      }
    },
    onSuccess: (result, variables) => {
      setPhoneData(variables);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      
      // In development, show and auto-fill the OTP code
      if (result.data.code) {
        otpForm.setValue("code", result.data.code);
        toast({
          title: "Development Mode",
          description: `Your OTP code is: ${result.data.code} (Auto-filled)`,
          variant: "default",
        });
      }
    },
    onError: (error: any) => {
      if (error.message === "User not found" && isLogin) {
        // User doesn't exist, switch to register mode
        setIsLogin(false);
        toast({
          title: "Account Not Found",
          description: "Creating a new account for this phone number.",
        });
        // Retry as registration
        authMutation.mutate(phoneData!);
      } else {
        toast({
          title: isLogin ? "Login Failed" : "Registration Failed",
          description: error.message || "Please check your phone number.",
          variant: "destructive",
        });
      }
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      if (!phoneData) throw new Error("Phone data not available");
      
      if (isLogin) {
        const response = await apiRequest("POST", "/api/auth/login-verify", {
          phoneNumber: phoneData.phoneNumber,
          code: data.code,
        });
        return { type: 'login', data: await response.json() };
      } else {
        const response = await apiRequest("POST", "/api/auth/verify-otp", {
          phoneNumber: phoneData.phoneNumber,
          code: data.code,
          userType: 'customer'
        });
        return { type: 'register', data: await response.json() };
      }
    },
    onSuccess: (result) => {
      const { type, data } = result;
      
      if (type === 'login') {
        if (!data.user.isApproved && data.user.userType === 'provider') {
          toast({
            title: "Account Pending Approval",
            description: "Your provider account is pending admin approval. Please wait for approval to access the platform.",
            variant: "destructive",
          });
          onClose();
          return;
        }

        // Save user to localStorage
        authUtils.saveUser(data.user);

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        onClose();
        
        // Check if user needs to complete profile
        if (!data.user.name || !data.user.email) {
          // User needs to complete profile
          if (data.user.userType === "customer") {
            setLocation(`/profile/customer?userId=${data.user.id}`);
          } else if (data.user.userType === "provider") {
            setLocation(`/profile/provider?userId=${data.user.id}`);
          }
        } else {
          // Redirect to dashboard
          if (data.user.userType === "customer") {
            setLocation("/customer/dashboard");
          } else if (data.user.userType === "provider") {
            setLocation("/provider/dashboard");
          } else if (data.user.userType === "admin") {
            setLocation("/admin/dashboard");
          }
        }
        
        // Refresh page to update auth state
        window.location.reload();
      } else {
        // Registration success - redirect to profile selection
        toast({
          title: "Account Created!",
          description: "Please complete your profile to get started.",
        });

        onClose();
        
        // Redirect to profile selection page where user can choose their role
        setLocation(`/profile/select?userId=${data.user.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP code.",
        variant: "destructive",
      });
    },
  });

  const onPhoneSubmit = (data: PhoneFormData) => {
    authMutation.mutate(data);
  };

  const onOtpSubmit = (data: OTPFormData) => {
    verifyMutation.mutate(data);
  };

  const handleBack = () => {
    setStep("phone");
    setPhoneData(null);
    setIsLogin(true);
    otpForm.reset();
  };

  const handleClose = () => {
    setStep("phone");
    setPhoneData(null);
    setIsLogin(true);
    phoneForm.reset();
    otpForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === "phone" ? "Welcome to ServiceConnect" : "Verify OTP"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "phone" 
              ? "Enter your phone number to continue" 
              : "Enter the 6-digit code sent to your phone"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "phone" && (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
                          {...field} 
                          data-testid="input-phone-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={authMutation.isPending}
                  data-testid="button-continue"
                >
                  {authMutation.isPending ? "Sending OTP..." : "Continue"}
                </Button>
              </form>
            </Form>
          )}

          {step === "otp" && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    data-testid="button-back"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Code sent to {phoneData?.phoneNumber}
                  </span>
                </div>

                <FormField
                  control={otpForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field} data-testid="input-otp">
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={verifyMutation.isPending}
                  data-testid="button-verify"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
                </Button>
              </form>
            </Form>
          )}

          {step === "phone" && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our{" "}
                <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>
                {" "}and{" "}
                <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}