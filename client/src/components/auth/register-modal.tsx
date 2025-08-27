import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  userType: z.enum(["customer", "provider"]),
});

const otpSchema = z.object({
  code: z.string().min(6, "OTP must be 6 digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  defaultUserType?: "customer" | "provider";
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, defaultUserType }: RegisterModalProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
      userType: defaultUserType || "customer",
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: PhoneFormData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
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
        title: "Registration Failed",
        description: error.message || "Please check your phone number.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      if (!phoneData) throw new Error("Phone data not available");
      
      const response = await apiRequest("POST", "/api/auth/verify-otp", {
        phoneNumber: phoneData.phoneNumber,
        code: data.code,
        userType: phoneData.userType,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please complete your profile.",
      });

      onClose();

      // Redirect to profile completion
      if (phoneData?.userType === "customer") {
        setLocation(`/profile/customer?userId=${data.user.id}`);
      } else {
        setLocation(`/profile/provider?userId=${data.user.id}`);
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
    registerMutation.mutate(data);
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
      <DialogContent className="sm:max-w-md" data-testid="register-modal">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === "phone" ? "Create Account" : "Verify OTP"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "phone" 
              ? "Join ServiceConnect to get started" 
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
                
                <FormField
                  control={phoneForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I want to</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 gap-4"
                          data-testid="radio-user-type"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="customer" id="customer" />
                            <Label htmlFor="customer" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Find Services</div>
                                <div className="text-sm text-muted-foreground">
                                  Book services from local providers
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="provider" id="provider" />
                            <Label htmlFor="provider" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Provide Services</div>
                                <div className="text-sm text-muted-foreground">
                                  Offer your services to customers
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={registerMutation.isPending}
                  data-testid="button-send-otp"
                >
                  {registerMutation.isPending ? "Sending OTP..." : "Send OTP"}
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
                  {verifyMutation.isPending ? "Verifying..." : "Create Account"}
                </Button>
              </form>
            </Form>
          )}

          {step === "phone" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={onSwitchToLogin}
                  data-testid="button-switch-to-login"
                >
                  Sign in
                </Button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}