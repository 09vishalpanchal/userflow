import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
      userType: "customer",
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
      
      // In development, show the OTP code
      if (data.code) {
        toast({
          title: "Development Mode",
          description: `Your OTP code is: ${data.code}`,
          variant: "default",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      if (!phoneData) throw new Error("Phone data not found");
      
      const response = await apiRequest("POST", "/api/auth/verify-otp", {
        ...phoneData,
        code: data.code,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      
      // Redirect based on user type
      if (phoneData?.userType === "customer") {
        setLocation(`/customer/profile?userId=${data.user.id}`);
      } else {
        setLocation(`/provider/profile?userId=${data.user.id}`);
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

  const onOTPSubmit = (data: OTPFormData) => {
    verifyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="register-page">
      <Card className="w-full max-w-md" data-testid="register-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {step === "otp" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("phone")}
                data-testid="button-back"
              >
                <ArrowLeft size={16} />
              </Button>
            )}
            <CardTitle className="text-2xl font-bold" data-testid="text-register-title">
              {step === "phone" ? "Create Account" : "Verify Phone"}
            </CardTitle>
          </div>
          <CardDescription data-testid="text-register-description">
            {step === "phone" 
              ? "Enter your phone number to get started" 
              : "Enter the 6-digit code sent to your phone"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4" data-testid="form-phone">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
                          {...field}
                          data-testid="input-phone"
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
                      <FormLabel>I am a</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          data-testid="radio-user-type"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="customer" id="customer" data-testid="radio-customer" />
                            <Label htmlFor="customer">Customer (Looking for services)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="provider" id="provider" data-testid="radio-provider" />
                            <Label htmlFor="provider">Service Provider (Offering services)</Label>
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
                  {registerMutation.isPending ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4" data-testid="form-otp">
                <FormField
                  control={otpForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
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
                  {verifyMutation.isPending ? "Verifying..." : "Verify & Create Account"}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => setLocation("/auth/login")} data-testid="link-login">
                Sign In
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
