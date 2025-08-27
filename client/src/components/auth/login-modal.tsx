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
import { ArrowLeft } from "lucide-react";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const otpSchema = z.object({
  code: z.string().min(6, "OTP must be 6 digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
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

  const loginMutation = useMutation({
    mutationFn: async (data: PhoneFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      setPhoneData(variables);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      
      // In development, show and auto-fill the OTP code
      if (data.code) {
        otpForm.setValue("code", data.code);
        toast({
          title: "Development Mode",
          description: `Your OTP code is: ${data.code} (Auto-filled)`,
          variant: "default",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your phone number.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      if (!phoneData) throw new Error("Phone data not available");
      
      const response = await apiRequest("POST", "/api/auth/login-verify", {
        phoneNumber: phoneData.phoneNumber,
        code: data.code,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (!data.user.isApproved) {
        toast({
          title: "Account Pending Approval",
          description: "Your account is pending admin approval. Please wait for approval to access the platform.",
          variant: "destructive",
        });
        onClose();
        return;
      }

      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });

      onClose();
      
      // Redirect based on user type
      if (data.user.userType === "customer") {
        setLocation("/customer/dashboard");
      } else if (data.user.userType === "provider") {
        setLocation("/provider/dashboard");
      } else if (data.user.userType === "admin") {
        setLocation("/admin/dashboard");
      }
      
      // Refresh page to update auth state
      window.location.reload();
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
    loginMutation.mutate(data);
  };

  const onOtpSubmit = (data: OTPFormData) => {
    verifyMutation.mutate(data);
  };

  const handleBack = () => {
    setStep("phone");
    setPhoneData(null);
    otpForm.reset();
  };

  const handleClose = () => {
    setStep("phone");
    setPhoneData(null);
    phoneForm.reset();
    otpForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="login-modal">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === "phone" ? "Sign In" : "Verify OTP"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "phone" 
              ? "Enter your phone number to sign in" 
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
                  disabled={loginMutation.isPending}
                  data-testid="button-send-otp"
                >
                  {loginMutation.isPending ? "Sending OTP..." : "Send OTP"}
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
                  data-testid="button-verify-otp"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify & Sign In"}
                </Button>
              </form>
            </Form>
          )}

          {step === "phone" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={onSwitchToRegister}
                  data-testid="button-switch-to-register"
                >
                  Sign up
                </Button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}