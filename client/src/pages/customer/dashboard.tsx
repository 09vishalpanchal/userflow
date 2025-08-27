import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

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
}

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [user] = useState({ id: "user-1", name: "John Doe" }); // This would come from auth context

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs/customer", user.id],
    enabled: !!user.id,
  });

  const jobs: Job[] = jobsData?.jobs || [];
  const activeJobs = jobs.filter(job => job.status === "open");
  const completedJobs = jobs.filter(job => job.status === "closed");

  const getStatusIcon = (job: Job) => {
    if (job.status === "closed") return <CheckCircle className="text-green-500" size={16} />;
    if (job.unlockCount >= job.maxUnlocks) return <AlertCircle className="text-yellow-500" size={16} />;
    return <Clock className="text-blue-500" size={16} />;
  };

  const getStatusText = (job: Job) => {
    if (job.status === "closed") return "Completed";
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

        {/* Jobs Tabs */}
        <Tabs defaultValue="active" className="space-y-6" data-testid="jobs-tabs">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="active" data-testid="tab-active">Active Jobs ({activeJobs.length})</TabsTrigger>
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground" data-testid={`text-providers-count-${job.id}`}>
                          {job.unlockCount} of {job.maxUnlocks} providers found
                        </span>
                        <span className="text-sm text-muted-foreground" data-testid={`text-job-date-${job.id}`}>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
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
                      <p className="text-muted-foreground" data-testid={`text-completed-description-${job.id}`}>{job.description}</p>
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
