import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MapPin, Clock, User, ArrowLeft, LogIn } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  budget?: string;
  createdAt: string;
  status: "open" | "closed";
  customer: {
    name: string;
    rating: number;
    totalJobs: number;
  };
}

export default function JobDetails() {
  const { jobId } = useParams();
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null); // Would come from auth context

  const { data: jobData, isLoading } = useQuery({
    queryKey: ["/api/job", jobId],
    enabled: !!jobId,
  });

  const job: Job = jobData?.job || {
    id: "1",
    title: "House Deep Cleaning Service Required",
    category: "Home Cleaning", 
    description: "Need comprehensive cleaning of 3BHK apartment including kitchen, bathrooms, and all rooms. The house has been vacant for 2 months so it needs deep cleaning including ceiling fans, light fixtures, and all surfaces. Looking for experienced cleaners with their own supplies.",
    location: "Koramangala, Bangalore",
    budget: "₹2,000 - ₹3,000",
    createdAt: "2 hours ago",
    status: "open",
    customer: {
      name: "Priya Sharma",
      rating: 4.8,
      totalJobs: 15
    }
  };

  // Related jobs for SEO
  const relatedJobs = [
    {
      id: "2",
      title: "Office Cleaning Service",
      category: "Home Cleaning",
      location: "HSR Layout, Bangalore",
      createdAt: "4 hours ago"
    },
    {
      id: "3", 
      title: "Apartment Deep Cleaning",
      category: "Home Cleaning",
      location: "Whitefield, Bangalore", 
      createdAt: "1 day ago"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="loading-state">
        <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="job-details-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/browse-jobs")}
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Jobs
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card data-testid="job-header">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-3" data-testid="job-title">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span data-testid="job-location">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{job.createdAt}</span>
                      </div>
                      {job.budget && (
                        <div className="text-primary font-semibold" data-testid="job-budget">
                          {job.budget}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={job.status === "open" ? "default" : "secondary"}
                      data-testid="job-status"
                    >
                      {job.status === "open" ? "Open" : "Closed"}
                    </Badge>
                    <Badge variant="outline" data-testid="job-category">
                      {job.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card data-testid="job-description">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card data-testid="customer-info">
              <CardHeader>
                <CardTitle>Posted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold" data-testid="customer-name">{job.customer.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      <span data-testid="customer-rating">⭐ {job.customer.rating}</span>
                      <span className="mx-2">•</span>
                      <span data-testid="customer-jobs">{job.customer.totalJobs} jobs posted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card data-testid="action-card">
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Login or register to apply for this job and contact the customer.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => setLocation("/auth/login")}
                        data-testid="login-button"
                      >
                        <LogIn size={16} className="mr-2" />
                        Login to Apply
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation("/auth/register")}
                        data-testid="register-button"
                      >
                        Register as Provider
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" data-testid="submit-bid">
                      Submit Your Bid
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="unlock-contact">
                      Unlock Contact Details (₹100)
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Only verified providers can unlock contact details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Jobs */}
            <Card data-testid="related-jobs">
              <CardHeader>
                <CardTitle>Related Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedJobs.map(relatedJob => (
                    <div 
                      key={relatedJob.id}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setLocation(`/job/${relatedJob.id}`)}
                      data-testid={`related-job-${relatedJob.id}`}
                    >
                      <h4 className="font-medium text-sm line-clamp-2">{relatedJob.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{relatedJob.location}</span>
                        <span>•</span>
                        <span>{relatedJob.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="link" 
                  className="w-full mt-4 p-0"
                  onClick={() => setLocation("/browse-jobs")}
                  data-testid="view-all-jobs"
                >
                  View All Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}