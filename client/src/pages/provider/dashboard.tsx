import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Wallet, Eye, Phone, User, AlertCircle, CheckCircle, Settings } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  unlockCount: number;
  maxUnlocks: number;
  createdAt: string;
}

interface ProviderProfile {
  status: "pending" | "approved" | "rejected";
  serviceRadius: number;
  maxServiceRadius: number;
}

export default function ProviderDashboard() {
  const [, setLocation] = useLocation();
  const [user] = useState({ id: "provider-1", name: "John Service Provider" }); // This would come from auth context
  const [radius, setRadius] = useState(5);
  const { toast } = useToast();

  // Get provider profile
  const { data: profileData } = useQuery({
    queryKey: ["/api/profiles/provider", user.id],
    enabled: !!user.id,
  });

  const profile: ProviderProfile = profileData?.profile || { status: "pending", serviceRadius: 5, maxServiceRadius: 20 };

  // Get wallet information
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["/api/wallet", user.id],
    enabled: !!user.id && profile.status === "approved",
  });

  // Get nearby jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/near", { latitude: "40.7128", longitude: "-74.0060", radius }],
    enabled: profile.status === "approved",
  });

  const jobs: Job[] = jobsData?.jobs || [];
  const wallet = walletData?.wallet;
  const balance = wallet ? parseFloat(wallet.balance) : 0;
  const unlockPrice = 100; // ₹100 per unlock

  const unlockJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("POST", `/api/jobs/${jobId}/unlock`, {
        providerId: user.id,
      });
      return response.json();
    },
    onSuccess: (data, jobId) => {
      toast({
        title: "Job Unlocked Successfully",
        description: `Customer contact: ${data.customerContact.name} - ${data.customerContact.phoneNumber}`,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/near"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Unlock Job",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUnlockJob = (jobId: string) => {
    if (balance < unlockPrice) {
      toast({
        title: "Insufficient Balance",
        description: "Please recharge your wallet to unlock this job.",
        variant: "destructive",
      });
      setLocation("/provider/wallet");
      return;
    }
    unlockJobMutation.mutate(jobId);
  };

  if (profile.status === "pending") {
    return (
      <div className="min-h-screen bg-background" data-testid="pending-approval">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <AlertCircle className="mx-auto mb-4 text-yellow-500" size={64} />
              <CardTitle className="text-2xl" data-testid="text-pending-title">Profile Under Review</CardTitle>
              <CardDescription data-testid="text-pending-description">
                Your provider profile and documents are being reviewed by our admin team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We'll notify you once your profile is approved. This usually takes 24-48 hours.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold mb-2">What's being reviewed:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Business license and registration documents</li>
                    <li>• Identity verification</li>
                    <li>• Service qualifications and certifications</li>
                    <li>• Business address and contact information</li>
                  </ul>
                </div>
                <Button onClick={() => setLocation("/")} data-testid="button-home">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profile.status === "rejected") {
    return (
      <div className="min-h-screen bg-background" data-testid="rejected-state">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
              <CardTitle className="text-2xl" data-testid="text-rejected-title">Profile Rejected</CardTitle>
              <CardDescription data-testid="text-rejected-description">
                Unfortunately, your provider profile application was not approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please contact our support team for more details about the rejection reasons.
              </p>
              <Button onClick={() => setLocation("/")} data-testid="button-contact-support">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="provider-dashboard">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-testid="dashboard-header">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-welcome">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground" data-testid="text-subtitle">Find jobs and manage your service business</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/provider/wallet")}
              data-testid="button-wallet"
            >
              <Wallet size={16} className="mr-2" />
              Wallet: ₹{balance.toFixed(2)}
            </Button>
            <Button variant="outline" data-testid="button-settings">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
          <Card data-testid="card-wallet-balance">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-balance">₹{balance.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-available-jobs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-available-jobs">{jobs.length}</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-service-radius">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Service Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-radius">{radius} km</div>
            </CardContent>
          </Card>

          <Card data-testid="card-status">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-green-600" data-testid="badge-status">
                <CheckCircle size={14} className="mr-1" />
                Active
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Radius Settings */}
        <Card className="mb-8" data-testid="radius-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-radius-title">
              <MapPin size={20} />
              Service Radius Settings
            </CardTitle>
            <CardDescription data-testid="text-radius-description">
              Adjust your service radius to see more or fewer job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="radius">Radius: {radius} km</Label>
                <Input
                  id="radius"
                  type="range"
                  min="5"
                  max={profile.maxServiceRadius}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
                  data-testid="slider-radius"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Max: {profile.maxServiceRadius} km
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs */}
        <Tabs defaultValue="available" className="space-y-6" data-testid="jobs-tabs">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="available" data-testid="tab-available">Available Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" data-testid="tab-content-available">
            <div className="space-y-4">
              {jobsLoading ? (
                <div className="text-center py-8" data-testid="loading-jobs">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card data-testid="empty-state">
                  <CardContent className="text-center py-12">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">No jobs available</h3>
                    <p className="text-muted-foreground">Try increasing your service radius to see more opportunities</p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => {
                  const canUnlock = job.unlockCount < job.maxUnlocks;
                  const hasBalance = balance >= unlockPrice;
                  
                  return (
                    <Card key={job.id} className="hover:shadow-md transition-shadow" data-testid={`card-job-${job.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg" data-testid={`text-job-title-${job.id}`}>{job.title}</CardTitle>
                            <CardDescription data-testid={`text-job-details-${job.id}`}>
                              <Badge variant="secondary" className="mr-2">{job.category}</Badge>
                              <span className="flex items-center gap-1 text-sm mt-1">
                                <MapPin size={14} />
                                {job.location}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm text-muted-foreground" data-testid={`text-job-date-${job.id}`}>
                              <Clock size={14} className="inline mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4" data-testid={`text-job-description-${job.id}`}>
                          {job.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <span data-testid={`text-unlocks-${job.id}`}>
                              {job.unlockCount} of {job.maxUnlocks} providers found
                            </span>
                            {!canUnlock && (
                              <Badge variant="outline" className="ml-2">Full</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!hasBalance && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setLocation("/provider/wallet")}
                                data-testid={`button-recharge-${job.id}`}
                              >
                                <Wallet size={14} className="mr-1" />
                                Recharge
                              </Button>
                            )}
                            <Button
                              onClick={() => handleUnlockJob(job.id)}
                              disabled={!canUnlock || !hasBalance || unlockJobMutation.isPending}
                              data-testid={`button-unlock-${job.id}`}
                            >
                              <Eye size={14} className="mr-1" />
                              Unlock (₹{unlockPrice})
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
