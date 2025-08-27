import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, User, Mail } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(5, "Please enter your complete address"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CustomerProfile() {
  const [, setLocation] = useLocation();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  // Get userId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!userId) throw new Error("User ID not found");
      
      const response = await apiRequest("POST", "/api/profiles/customer", {
        userId,
        name: data.name,
        email: data.email,
        location: data.location,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your customer profile has been set up successfully.",
      });
      setLocation("/customer/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Profile Setup Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address (in a real app, you'd use Google Maps API)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          form.setValue("location", data.display_name || `${latitude}, ${longitude}`);
          form.setValue("latitude", latitude.toString());
          form.setValue("longitude", longitude.toString());
          
          toast({
            title: "Location detected",
            description: "Your current location has been added to your profile.",
          });
        } catch (error) {
          form.setValue("location", `${latitude}, ${longitude}`);
          form.setValue("latitude", latitude.toString());
          form.setValue("longitude", longitude.toString());
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        toast({
          title: "Location access denied",
          description: "Please enter your location manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = (data: ProfileFormData) => {
    profileMutation.mutate(data);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="error-state">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Invalid Access</h2>
            <p className="text-muted-foreground mb-4">User information not found.</p>
            <Button onClick={() => setLocation("/auth/register")} data-testid="button-register">
              Register Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="customer-profile-page">
      <Card className="w-full max-w-2xl" data-testid="profile-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" data-testid="text-profile-title">Complete Your Profile</CardTitle>
          <p className="text-muted-foreground" data-testid="text-profile-description">
            Let's set up your customer profile to get personalized service recommendations
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-profile">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          data-testid="input-name"
                        />
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
                      <FormLabel className="flex items-center gap-2">
                        <Mail size={16} />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin size={16} />
                      Your Location
                    </FormLabel>
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
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        data-testid="button-get-location"
                      >
                        {isGettingLocation ? "Getting..." : "Use Current"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg" data-testid="location-note">
                <p className="text-sm text-muted-foreground">
                  <MapPin size={14} className="inline mr-1" />
                  Your location helps us recommend nearby service providers and show you relevant services in your area.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={profileMutation.isPending}
                data-testid="button-complete-profile"
              >
                {profileMutation.isPending ? "Creating Profile..." : "Complete Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
