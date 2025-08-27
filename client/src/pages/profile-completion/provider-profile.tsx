import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { providerProfileCompletionSchema, type ProviderProfileCompletion } from "@shared/schema";
import { MapPin, User, Briefcase, FileText, Settings, Upload } from "lucide-react";

const serviceCategories = [
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
  "Catering"
];

export default function ProviderProfile() {
  const [, setLocation] = useLocation();
  
  // Get userId from URL parameters
  const userId = new URLSearchParams(window.location.search).get("userId");
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<File[]>([]);
  
  const form = useForm<ProviderProfileCompletion>({
    resolver: zodResolver(providerProfileCompletionSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      businessName: "",
      businessDetails: "",
      serviceCategories: [],
      location: "",
      serviceRadius: 5,
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProviderProfileCompletion) => {
      // Use JSON format since file upload isn't implemented yet
      const response = await apiRequest("POST", "/api/profile/provider/complete", {
        userId: userId || '',
        profileData: data
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Submitted!",
        description: "Your profile has been submitted for admin approval. You'll be notified once approved.",
      });
      
      // Redirect to dashboard
      setLocation("/provider/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit profile.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProviderProfileCompletion) => {
    if (documents.length === 0) {
      toast({
        title: "Documents Required",
        description: "Please upload at least one verification document.",
        variant: "destructive",
      });
      return;
    }
    
    profileMutation.mutate(data);
  };

  const detectLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mockAddress = "Koramangala, Bangalore, Karnataka 560095";
        
        form.setValue("location", mockAddress);
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        
        toast({
          title: "Location Detected",
          description: "Your business location has been automatically filled.",
        });
      },
      () => {
        toast({
          title: "Location Access Denied",
          description: "Please enter your business address manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Only images and PDF files are allowed.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setDocuments(prev => [...prev, ...validFiles]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Business Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase size={18} />
          Business Information
        </h3>
        
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Your business or service name" {...field} data-testid="input-business-name" />
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
              <FormLabel>Business Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your business, experience, and services you provide..."
                  className="min-h-[120px]"
                  {...field} 
                  data-testid="input-business-details"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="serviceCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Categories</FormLabel>
              <FormDescription>
                Select the services you provide (at least one required)
              </FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceCategories.map((category) => (
                  <FormItem key={category} className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(category)}
                        onCheckedChange={(checked) => {
                          const updatedCategories = checked
                            ? [...(field.value || []), category]
                            : (field.value || []).filter((c) => c !== category);
                          field.onChange(updatedCategories);
                        }}
                        data-testid={`checkbox-${category}`}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{category}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Location & Service Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} />
          Location & Service Area
        </h3>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder="Enter your business address" 
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
        
        <FormField
          control={form.control}
          name="serviceRadius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Radius: {field.value} km</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  data-testid="slider-service-radius"
                />
              </FormControl>
              <FormDescription>
                How far are you willing to travel for jobs?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Document Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText size={18} />
          Verification Documents
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Documents (ID Proof, GST Certificate, License, etc.)
            </label>
            <Input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleDocumentUpload}
              className="cursor-pointer"
              data-testid="input-documents"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: Images (JPG, PNG) and PDF. Max size: 5MB per file.
            </p>
          </div>
          
          {documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Documents:</p>
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm truncate">{doc.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDocument(index)}
                    data-testid={`remove-document-${index}`}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="provider-profile-page">
      <Card className="w-full max-w-3xl" data-testid="profile-form">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
            <Briefcase size={24} className="text-primary" />
            Complete Provider Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Step {step} of 3 - Please provide your business details for verification
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form-provider-profile">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <div className="flex justify-between pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => step > 1 ? setStep(step - 1) : setLocation("/")}
                  data-testid="button-back"
                >
                  {step > 1 ? "Previous" : "Skip for Now"}
                </Button>
                
                {step < 3 ? (
                  <Button 
                    type="button" 
                    onClick={() => setStep(step + 1)}
                    data-testid="button-next"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={profileMutation.isPending}
                    data-testid="button-submit"
                  >
                    {profileMutation.isPending ? "Submitting..." : "Submit for Approval"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}