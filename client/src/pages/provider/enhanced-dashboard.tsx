import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Star, 
  Bell, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Eye, 
  Award, 
  Target,
  Clock,
  Wallet,
  Settings,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  unlockCount: number;
  maxUnlocks: number;
  createdAt: string;
  isAiDetected?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface ProviderProfile {
  status: "pending" | "approved" | "rejected";
  serviceRadius: number;
  maxServiceRadius: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  isVerified: boolean;
  subscriptionPlan?: 'basic' | 'premium' | 'pro';
}

interface ProviderStats {
  totalEarnings: number;
  monthlyEarnings: number;
  jobsCompleted: number;
  averageRating: number;
  responseRate: number;
  subscriptionStatus: string;
}

export default function EnhancedProviderDashboard() {
  const [, setLocation] = useLocation();
  const [user] = useState({ id: "provider-1", name: "John Service Provider" });
  const [radius, setRadius] = useState(5);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced provider data
  const { data: profileData } = useQuery({
    queryKey: ["/api/profiles/provider", user.id],
    enabled: !!user.id,
  });

  const { data: statsData } = useQuery({
    queryKey: ["/api/provider/stats", user.id],
    enabled: !!user.id,
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ["/api/subscriptions", user.id],
    enabled: !!user.id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["/api/reviews/provider", user.id],
    enabled: !!user.id,
  });

  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet", user.id],
    enabled: !!user.id,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/near", { latitude: "40.7128", longitude: "-74.0060", radius }],
  });

  const profile: ProviderProfile = profileData?.profile || { 
    status: "approved", 
    serviceRadius: 5, 
    maxServiceRadius: 20,
    rating: 4.5,
    reviewCount: 23,
    completedJobs: 45,
    responseTime: "< 2 hours",
    isVerified: true,
    subscriptionPlan: 'premium'
  };

  const stats: ProviderStats = statsData?.stats || {
    totalEarnings: 25000,
    monthlyEarnings: 8500,
    jobsCompleted: 45,
    averageRating: 4.5,
    responseRate: 95,
    subscriptionStatus: 'active'
  };

  const jobs: Job[] = jobsData?.jobs || [];
  const wallet = walletData?.wallet;
  const balance = wallet ? parseFloat(wallet.balance) : 1250;
  const subscription = subscriptionData?.subscription;
  const reviews = reviewsData?.reviews || [];

  // Enhanced job unlock with AI insights
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
      
      // Log WhatsApp interaction if available
      if (data.whatsappLink) {
        apiRequest("POST", "/api/whatsapp/log", {
          providerId: user.id,
          jobId,
          action: "contact_unlocked",
          customerPhone: data.customerContact.phoneNumber
        });
      }
      
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
    const unlockPrice = subscription?.plan === 'pro' ? 75 : subscription?.plan === 'premium' ? 85 : 100;
    
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

  // Subscription plan benefits
  const getPlanBenefits = () => {
    switch (profile.subscriptionPlan) {
      case 'pro':
        return { unlockDiscount: 25, priority: 'high', aiInsights: true, color: 'text-purple-600' };
      case 'premium':
        return { unlockDiscount: 15, priority: 'medium', aiInsights: true, color: 'text-blue-600' };
      default:
        return { unlockDiscount: 0, priority: 'low', aiInsights: false, color: 'text-gray-600' };
    }
  };

  const planBenefits = getPlanBenefits();
  const unlockPrice = 100 - (100 * planBenefits.unlockDiscount / 100);

  return (
    <div className="min-h-screen bg-background" data-testid="enhanced-provider-dashboard">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Profile */}
        <div className="flex items-center justify-between mb-8" data-testid="dashboard-header">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" data-testid="text-welcome">{user.name}</h1>
                {profile.isVerified && <Award className="text-blue-600" size={20} />}
                {profile.subscriptionPlan !== 'basic' && <Crown className={planBenefits.color} size={20} />}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span>{profile.rating.toFixed(1)} ({profile.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span>{profile.completedJobs} jobs completed</span>
                <span>•</span>
                <span>Responds in {profile.responseTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'} className={planBenefits.color}>
              {profile.subscriptionPlan?.toUpperCase() || 'BASIC'}
            </Badge>
            <Button variant="outline" onClick={() => setLocation("/provider/wallet")} data-testid="button-wallet">
              <Wallet size={16} className="mr-2" />
              ₹{balance.toFixed(2)}
            </Button>
            <Button variant="outline" data-testid="button-settings">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-6 gap-4 mb-8" data-testid="enhanced-stats">
          <Card data-testid="card-monthly-earnings">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp size={16} />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{stats.monthlyEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="card-response-rate">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Zap size={16} />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.responseRate}%</div>
              <Progress value={stats.responseRate} className="h-2 mt-1" />
            </CardContent>
          </Card>

          <Card data-testid="card-available-jobs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Target size={16} />
                Available Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">In {radius}km radius</p>
            </CardContent>
          </Card>

          <Card data-testid="card-wallet-balance">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Wallet size={16} />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹{balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready to unlock</p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-earnings">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign size={16} />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">₹{stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card data-testid="card-rating">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Star size={16} />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{profile.rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">{profile.reviewCount} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6" data-testid="enhanced-tabs">
          <TabsList data-testid="enhanced-tabs-list">
            <TabsTrigger value="jobs" data-testid="tab-jobs">
              Available Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="subscription" data-testid="tab-subscription">
              Subscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" data-testid="tab-content-jobs">
            <div className="space-y-4">
              {/* Radius Control */}
              <Card data-testid="radius-control">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin size={20} />
                    Service Radius: {radius} km
                    {planBenefits.aiInsights && <Badge variant="secondary">AI Optimized</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max={profile.maxServiceRadius}
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Max: {profile.maxServiceRadius} km</span>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Job Cards */}
              {jobs.length === 0 ? (
                <Card data-testid="empty-jobs">
                  <CardContent className="text-center py-12">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">No jobs available</h3>
                    <p className="text-muted-foreground">Try expanding your radius or check back later</p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => {
                  const canUnlock = job.unlockCount < job.maxUnlocks;
                  const hasBalance = balance >= unlockPrice;
                  
                  return (
                    <Card key={job.id} className="hover:shadow-lg transition-all duration-200" data-testid={`enhanced-job-${job.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              {job.isAiDetected && <Badge variant="secondary" className="text-xs">AI Match</Badge>}
                              {job.priority === 'high' && <Badge variant="destructive" className="text-xs">Hot</Badge>}
                            </div>
                            <CardDescription>
                              <div className="flex items-center gap-4 text-sm">
                                <Badge variant="secondary">{job.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{job.unlockCount} of {job.maxUnlocks} providers</span>
                            {!canUnlock && <Badge variant="outline">Full</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            {planBenefits.unlockDiscount > 0 && (
                              <Badge variant="secondary" className="text-green-600">
                                {planBenefits.unlockDiscount}% OFF
                              </Badge>
                            )}
                            <Button
                              onClick={() => handleUnlockJob(job.id)}
                              disabled={!canUnlock || !hasBalance || unlockJobMutation.isPending}
                              variant={job.priority === 'high' ? 'default' : 'outline'}
                            >
                              <Eye size={14} className="mr-1" />
                              Unlock (₹{unlockPrice.toFixed(0)})
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

          <TabsContent value="reviews" data-testid="tab-content-reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Star size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">No reviews yet</h3>
                    <p className="text-muted-foreground">Complete jobs to start receiving reviews</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.customerName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" data-testid="tab-content-analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Response Rate</span>
                      <span>{stats.responseRate}%</span>
                    </div>
                    <Progress value={stats.responseRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Job Completion</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>{((profile.rating / 5) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(profile.rating / 5) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign size={20} />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-semibold">₹{stats.monthlyEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Lifetime</span>
                      <span className="font-semibold">₹{stats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average per Job</span>
                      <span className="font-semibold">₹{Math.round(stats.totalEarnings / profile.completedJobs).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription" data-testid="tab-content-subscription">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className={profile.subscriptionPlan === 'basic' ? 'border-2 border-primary' : ''}>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>₹0/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Standard job visibility</li>
                    <li>• ₹100 unlock fee</li>
                    <li>• Basic support</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4" disabled={profile.subscriptionPlan === 'basic'}>
                    {profile.subscriptionPlan === 'basic' ? 'Current Plan' : 'Downgrade'}
                  </Button>
                </CardContent>
              </Card>

              <Card className={profile.subscriptionPlan === 'premium' ? 'border-2 border-primary' : ''}>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>₹499/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Priority job visibility</li>
                    <li>• ₹85 unlock fee (15% off)</li>
                    <li>• AI job matching</li>
                    <li>• Priority support</li>
                  </ul>
                  <Button className="w-full mt-4" disabled={profile.subscriptionPlan === 'premium'}>
                    {profile.subscriptionPlan === 'premium' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>

              <Card className={profile.subscriptionPlan === 'pro' ? 'border-2 border-primary' : ''}>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>₹999/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Exclusive job access</li>
                    <li>• ₹75 unlock fee (25% off)</li>
                    <li>• Advanced AI insights</li>
                    <li>• Dedicated support</li>
                    <li>• Analytics dashboard</li>
                  </ul>
                  <Button className="w-full mt-4" disabled={profile.subscriptionPlan === 'pro'}>
                    {profile.subscriptionPlan === 'pro' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}