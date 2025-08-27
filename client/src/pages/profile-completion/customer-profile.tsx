import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { customerProfileCompletionSchema, type CustomerProfileCompletion } from "@shared/schema";
import { MapPin, User, Mail, Lock, Home } from "lucide-react";

export default function CustomerProfile() {
  const [, setLocation] = useLocation();
  
  // Get userId from URL parameters
  const userId = new URLSearchParams(window.location.search).get("userId");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CustomerProfileCompletion>({
    resolver: zodResolver(customerProfileCompletionSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: CustomerProfileCompletion) => {
      const response = await apiRequest("POST", "/api/profile/customer/complete", {
        userId: userId,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Completed!",
        description: "Your profile has been set up successfully.",
      });
      
      // Redirect to dashboard
      setLocation("/customer/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerProfileCompletion) => {
    profileMutation.mutate(data);
  };

  // Mock Google Maps integration for now
  const detectLocation = () => {
    // In production, this would use Google Maps Geolocation API
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocoding - in production would call Google Maps API
        const mockAddress = "Koramangala, Bangalore, Karnataka 560095";
        
        form.setValue("location", mockAddress);
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        
        toast({
          title: "Location Detected",
          description: "Your location has been automatically filled.",
        });
      },
      () => {
        toast({
          title: "Location Access Denied",
          description: "Please enter your address manually.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="customer-profile-page">
      <Card className="w-full max-w-2xl" data-testid="profile-form">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
            <User size={24} className="text-primary" />
            Complete Your Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Please provide your details to start posting jobs
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-customer-profile">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User size={18} />
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Set a password for future logins" 
                          type="password" 
                          {...field} 
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home size={18} />
                  Address Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="Enter your complete address" 
                            {...field} 
                            data-testid="input-location"
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={detectLocation}
                          data-testid="button-detect-location"
                        >
                          <MapPin size={16} className="mr-1" />
                          Detect
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/")}
                  data-testid="button-skip"
                >
                  Skip for Now
                </Button>
                <Button 
                  type="submit" 
                  disabled={profileMutation.isPending}
                  data-testid="button-complete"
                >
                  {profileMutation.isPending ? "Saving..." : "Complete Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}