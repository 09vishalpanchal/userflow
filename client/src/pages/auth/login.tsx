import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Login() {
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
        title: "Login Failed",
        description: error.message || "Please check your phone number.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      if (!phoneData) throw new Error("Phone data not found");
      
      const response = await apiRequest("POST", "/api/auth/login-verify", {
        ...phoneData,
        code: data.code,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Redirect based on user type
      switch (data.user.userType) {
        case "customer":
          setLocation("/customer/dashboard");
          break;
        case "provider":
          setLocation("/provider/dashboard");
          break;
        case "admin":
          setLocation("/admin/dashboard");
          break;
        default:
          setLocation("/");
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
    loginMutation.mutate(data);
  };

  const onOTPSubmit = (data: OTPFormData) => {
    verifyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="login-page">
      <Card className="w-full max-w-md" data-testid="login-card">
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
            <CardTitle className="text-2xl font-bold" data-testid="text-login-title">
              {step === "phone" ? "Welcome Back" : "Verify Phone"}
            </CardTitle>
          </div>
          <CardDescription data-testid="text-login-description">
            {step === "phone" 
              ? "Enter your phone number to sign in" 
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-send-otp"
                >
                  {loginMutation.isPending ? "Sending..." : "Send OTP"}
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
                        <Input
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="text-center text-lg font-mono tracking-widest"
                          {...field}
                          data-testid="input-otp"
                          autoComplete="one-time-code"
                        />
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
                  {verifyMutation.isPending ? "Verifying..." : "Sign In"}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => setLocation("/auth/register")} data-testid="link-register">
                Sign Up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
