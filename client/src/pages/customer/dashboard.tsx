import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, MapPin, Clock, CheckCircle, AlertCircle, Star, MessageSquare, RotateCcw, Eye, XCircle } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  status: "open" | "closed";
  unlockCount: number;
  maxUnlocks: number;
  createdAt: string;
  budget?: string;
  rating?: number;
  review?: string;
  hasReview?: boolean;
  isExpired?: boolean;
}

interface UnlockedJob {
  id: string;
  jobId: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerRating: number;
  unlockedAt: string;
  whatsappLink?: string;
}

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [user] = useState({ id: "user-1", name: "John Doe" }); // This would come from auth context
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs/customer", user.id],
    enabled: !!user.id,
  });

  const { data: unlockedData } = useQuery({
    queryKey: ["/api/jobs/unlocked", user.id],
    enabled: !!user.id,
  });

  const jobs: Job[] = jobsData?.jobs || [];
  const unlockedJobs: UnlockedJob[] = unlockedData?.unlockedJobs || [];
  const activeJobs = jobs.filter(job => job.status === "open");
  const completedJobs = jobs.filter(job => job.status === "closed");

  // Job Management Mutations
  const closeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("POST", `/api/jobs/${jobId}/close`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/customer", user.id] });
      toast({ title: "Job closed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to close job", variant: "destructive" });
    },
  });

  const reopenJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("POST", `/api/jobs/${jobId}/reopen`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/customer", user.id] });
      toast({ title: "Job reopened successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reopen job", variant: "destructive" });
    },
  });

  const hireAgainMutation = useMutation({
    mutationFn: async (job: Job) => {
      const response = await apiRequest("POST", "/api/jobs/hire-again", {
        originalJobId: job.id,
        title: job.title,
        category: job.category,
        description: job.description,
        location: job.location,
        budget: job.budget,
        customerId: user.id
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/customer", user.id] });
      toast({ title: "Job reposted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to repost job", variant: "destructive" });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ jobId, providerId, rating, comment }: {
      jobId: string;
      providerId: string;
      rating: number;
      comment: string;
    }) => {
      const response = await apiRequest("POST", `/api/reviews`, {
        jobId,
        customerId: user.id,
        providerId,
        rating,
        comment
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs/customer", user.id] });
      setReviewJobId(null);
      setRating(5);
      setReviewComment("");
      toast({ title: "Review submitted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to submit review", variant: "destructive" });
    },
  });

  const getStatusIcon = (job: Job) => {
    if (job.status === "closed") return <CheckCircle className="text-green-500" size={16} />;
    if (job.isExpired) return <XCircle className="text-red-500" size={16} />;
    if (job.unlockCount >= job.maxUnlocks) return <AlertCircle className="text-yellow-500" size={16} />;
    return <Clock className="text-blue-500" size={16} />;
  };

  const getStatusText = (job: Job) => {
    if (job.status === "closed") return "Completed";
    if (job.isExpired) return "Expired";
    if (job.unlockCount >= job.maxUnlocks) return "Providers found";
    return "Waiting for providers";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="customer-dashboard">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-testid="dashboard-header">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-welcome">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground" data-testid="text-subtitle">Manage your service requests and find trusted providers</p>
          </div>
          <Button onClick={() => setLocation("/customer/post-job")} data-testid="button-post-job">
            <Plus size={16} className="mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8" data-testid="stats-cards">
          <Card data-testid="card-total-jobs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-jobs">{jobs.length}</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-active-jobs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-active-jobs">{activeJobs.length}</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-completed-jobs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-completed-jobs">{completedJobs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Jobs Tabs */}
        <Tabs defaultValue="active" className="space-y-6" data-testid="jobs-tabs">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="active" data-testid="tab-active">Active Jobs ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="unlocked" data-testid="tab-unlocked">Unlocked ({unlockedJobs.length})</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">Completed ({completedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" data-testid="tab-content-active">
            <div className="space-y-4">
              {activeJobs.length === 0 ? (
                <Card data-testid="empty-state-active">
                  <CardContent className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      <Plus size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold">No active jobs</h3>
                      <p>Post your first job to get started</p>
                    </div>
                    <Button onClick={() => setLocation("/customer/post-job")} data-testid="button-post-first-job">
                      Post a Job
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow" data-testid={`card-job-${job.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-job-title-${job.id}`}>{job.title}</CardTitle>
                          <CardDescription data-testid={`text-job-category-${job.id}`}>
                            <Badge variant="secondary" className="mr-2">{job.category}</Badge>
                            <span className="flex items-center gap-1 text-sm">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2" data-testid={`status-${job.id}`}>
                          {getStatusIcon(job)}
                          <span className="text-sm text-muted-foreground">{getStatusText(job)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4" data-testid={`text-job-description-${job.id}`}>{job.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground" data-testid={`text-providers-count-${job.id}`}>
                          {job.unlockCount} of {job.maxUnlocks} providers found
                        </span>
                        <span className="text-sm text-muted-foreground" data-testid={`text-job-date-${job.id}`}>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2" data-testid={`actions-${job.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => closeJobMutation.mutate(job.id)}
                          disabled={closeJobMutation.isPending}
                          data-testid={`button-close-${job.id}`}
                        >
                          <XCircle size={14} className="mr-1" />
                          Close Job
                        </Button>
                        {job.unlockCount > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/jobs/${job.id}/unlocked`)}
                            data-testid={`button-view-providers-${job.id}`}
                          >
                            <Eye size={14} className="mr-1" />
                            View Providers
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" data-testid="tab-content-completed">
            <div className="space-y-4">
              {completedJobs.length === 0 ? (
                <Card data-testid="empty-state-completed">
                  <CardContent className="text-center py-12">
                    <div className="text-muted-foreground">
                      <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold">No completed jobs yet</h3>
                      <p>Completed jobs will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                completedJobs.map((job) => (
                  <Card key={job.id} className="opacity-75" data-testid={`card-completed-job-${job.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-completed-title-${job.id}`}>{job.title}</CardTitle>
                          <CardDescription data-testid={`text-completed-category-${job.id}`}>
                            <Badge variant="secondary" className="mr-2">{job.category}</Badge>
                            <span className="flex items-center gap-1 text-sm">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-green-600" data-testid={`badge-completed-${job.id}`}>
                          <CheckCircle size={14} className="mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4" data-testid={`text-completed-description-${job.id}`}>{job.description}</p>
                      {job.hasReview ? (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < (job.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">Review submitted</span>
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mb-4" data-testid={`button-review-${job.id}`}>
                              <Star size={14} className="mr-1" />
                              Rate & Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rate & Review</DialogTitle>
                              <DialogDescription>
                                How was your experience with the service provider?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Rating</Label>
                                <div className="flex items-center gap-1 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className="text-2xl hover:scale-110 transition-transform"
                                    >
                                      <Star
                                        size={24}
                                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="review-comment">Comment (Optional)</Label>
                                <Textarea
                                  id="review-comment"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  placeholder="Share your experience..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => reviewMutation.mutate({
                                  jobId: job.id,
                                  providerId: "provider-1", // This would come from job data
                                  rating,
                                  comment: reviewComment
                                })}
                                disabled={reviewMutation.isPending}
                              >
                                Submit Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => reopenJobMutation.mutate(job.id)}
                          disabled={reopenJobMutation.isPending}
                          data-testid={`button-reopen-${job.id}`}
                        >
                          <RotateCcw size={14} className="mr-1" />
                          Reopen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => hireAgainMutation.mutate(job)}
                          disabled={hireAgainMutation.isPending}
                          data-testid={`button-hire-again-${job.id}`}
                        >
                          <Plus size={14} className="mr-1" />
                          Hire Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* New Unlocked Jobs Tab */}
          <TabsContent value="unlocked" data-testid="tab-content-unlocked">
            <div className="space-y-4">
              {unlockedJobs.length === 0 ? (
                <Card data-testid="empty-state-unlocked">
                  <CardContent className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Eye size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold">No unlocked providers yet</h3>
                      <p>Provider details will appear here when they show interest in your jobs</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                unlockedJobs.map((unlock) => (
                  <Card key={unlock.id} className="hover:shadow-md transition-shadow" data-testid={`card-unlocked-${unlock.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-provider-name-${unlock.id}`}>
                            {unlock.providerName}
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < unlock.providerRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                                <span className="text-sm ml-1">({unlock.providerRating}.0)</span>
                              </div>
                            </div>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          Available
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground" data-testid={`text-unlocked-date-${unlock.id}`}>
                            Unlocked on {new Date(unlock.unlockedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium" data-testid={`text-provider-phone-${unlock.id}`}>
                            📞 {unlock.providerPhone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {unlock.whatsappLink && (
                            <Button size="sm" asChild data-testid={`button-whatsapp-${unlock.id}`}>
                              <a href={unlock.whatsappLink} target="_blank" rel="noopener noreferrer">
                                <MessageSquare size={14} className="mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-call-${unlock.id}`}>
                            📞 Call Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
