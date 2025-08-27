import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, User, Mail, Briefcase, FileText, Upload, CheckCircle } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessDetails: z.string().min(20, "Business details must be at least 20 characters"),
  location: z.string().min(5, "Please enter your complete address"),
  serviceCategories: z.array(z.string()).min(1, "Please select at least one service category"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Categories will be fetched dynamically

export default function ProviderProfile() {
  const [, setLocation] = useLocation();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const { toast } = useToast();

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    enabled: true,
  });

  const serviceCategories = (categoriesData as any)?.categories || [];

  // Get userId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      businessDetails: "",
      location: "",
      serviceCategories: [],
      latitude: "",
      longitude: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!userId) throw new Error("User ID not found");
      
      const response = await apiRequest("POST", "/api/profiles/provider", {
        userId,
        name: data.name,
        email: data.email,
        businessName: data.businessName,
        businessDetails: data.businessDetails,
        location: data.location,
        serviceCategories: data.serviceCategories,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        documentsUploaded,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Submitted",
        description: "Your provider profile has been submitted for admin approval.",
      });
      setLocation("/provider/dashboard");
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

  const handleDocumentUpload = () => {
    // In a real app, this would handle file upload to cloud storage
    setDocumentsUploaded(true);
    toast({
      title: "Documents uploaded",
      description: "Your business documents have been uploaded successfully.",
    });
  };

  const onSubmit = (data: ProfileFormData) => {
    if (!documentsUploaded) {
      toast({
        title: "Documents Required",
        description: "Please upload your business documents before submitting.",
        variant: "destructive",
      });
      return;
    }
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
    <div className="min-h-screen bg-background p-4" data-testid="provider-profile-page">
      <div className="max-w-4xl mx-auto">
        <Card data-testid="profile-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" data-testid="text-profile-title">Complete Your Provider Profile</CardTitle>
            <p className="text-muted-foreground" data-testid="text-profile-description">
              Set up your business profile to start receiving service requests from customers
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-profile">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" data-testid="text-personal-info">Personal Information</h3>
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
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" data-testid="text-business-info">Business Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase size={16} />
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your business name"
                            {...field}
                            data-testid="input-business-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText size={16} />
                          Business Details
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business, experience, and services in detail"
                            className="min-h-[100px]"
                            {...field}
                            data-testid="textarea-business-details"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin size={16} />
                          Service Location
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Enter your business address or service area"
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
                </div>

                {/* Service Categories */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" data-testid="text-service-categories">Service Categories</h3>
                  <FormField
                    control={form.control}
                    name="serviceCategories"
                    render={() => (
                      <FormItem>
                        <div className="grid md:grid-cols-3 gap-4">
                          {serviceCategories.map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name="serviceCategories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, category])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== category
                                                )
                                              )
                                        }}
                                        data-testid={`checkbox-${category.toLowerCase().replace(/\s+/g, '-')}`}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {category}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" data-testid="text-documents">Business Documents</h3>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {documentsUploaded ? (
                      <div className="text-green-600" data-testid="documents-uploaded">
                        <CheckCircle size={48} className="mx-auto mb-4" />
                        <p className="font-semibold">Documents Uploaded Successfully</p>
                        <p className="text-sm text-muted-foreground">Your documents have been uploaded and will be reviewed by our admin team.</p>
                      </div>
                    ) : (
                      <div data-testid="documents-upload">
                        <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <p className="font-semibold mb-2">Upload Business Documents</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload your business license, ID proof, GST certificate (if applicable), and any other relevant documents
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDocumentUpload}
                          data-testid="button-upload-documents"
                        >
                          <Upload size={16} className="mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg" data-testid="approval-info">
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your profile and documents will be reviewed by our admin team</li>
                    <li>• You'll receive an approval notification within 24-48 hours</li>
                    <li>• Once approved, you can start receiving job notifications</li>
                    <li>• You'll need to maintain wallet balance to unlock customer contacts</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={profileMutation.isPending}
                  data-testid="button-submit-profile"
                >
                  {profileMutation.isPending ? "Submitting..." : "Submit for Approval"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
