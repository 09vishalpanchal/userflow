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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Briefcase, FileText } from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Please enter the service location"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

// Categories will be fetched dynamically

export default function PostJob() {
  const [, setLocation] = useLocation();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [user] = useState({ id: "36e9478b-1381-4fd8-8342-0d1905343017" }); // Using actual logged-in user ID
  const { toast } = useToast();

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    enabled: true,
  });

  const serviceCategories = (categoriesData as any)?.categories || [];

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  const postJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await apiRequest("POST", "/api/jobs", {
        customerId: user.id,
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted Successfully",
        description: "Your job has been posted and nearby service providers will be notified.",
      });
      setLocation("/customer/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Post Job",
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
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          form.setValue("location", data.display_name || `${latitude}, ${longitude}`);
          form.setValue("latitude", latitude.toString());
          form.setValue("longitude", longitude.toString());
          
          toast({
            title: "Location detected",
            description: "Your current location has been added.",
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
          description: "Please enter the location manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = (data: JobFormData) => {
    postJobMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="post-job-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8" data-testid="page-header">
          <Button
            variant="ghost"
            onClick={() => setLocation("/customer/dashboard")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Post a New Job</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Describe your service requirements to connect with qualified providers
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card data-testid="job-form-card">
            <CardHeader>
              <CardTitle data-testid="text-form-title">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-job">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase size={16} />
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., House cleaning service needed"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceCategories.map((category: string) => (
                              <SelectItem key={category} value={category} data-testid={`option-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText size={16} />
                          Job Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your requirements in detail. Include any specific needs, preferences, or timing requirements."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-description"
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
                              placeholder="Enter the address where service is needed"
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

                  <div className="bg-muted/50 p-4 rounded-lg" data-testid="posting-info">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Nearby service providers will be notified instantly</li>
                      <li>• Up to 3 providers can unlock your contact details</li>
                      <li>• You'll receive direct contact from interested providers</li>
                      <li>• Choose the best provider for your needs</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={postJobMutation.isPending}
                    data-testid="button-post-job"
                  >
                    {postJobMutation.isPending ? "Posting Job..." : "Post Job"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
