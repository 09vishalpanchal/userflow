import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
  status: "open" | "closed";
}

export function BrowseJobsPreview() {
  const [, setLocation] = useLocation();
  
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs/recent"],
    enabled: true,
  });

  // Mock data for demonstration - latest jobs preview
  const recentJobs: Job[] = jobsData?.jobs || [
    {
      id: "1",
      title: "House Deep Cleaning Service Required",
      category: "Home Cleaning",
      description: "Need comprehensive cleaning of 3BHK apartment including kitchen, bathrooms, and all rooms.",
      location: "Koramangala, Bangalore",
      createdAt: "2 hours ago",
      status: "open"
    },
    {
      id: "2", 
      title: "Plumbing Fix for Kitchen Sink",
      category: "Plumbing",
      description: "Kitchen sink is leaking and needs urgent repair. Preferably someone available today.",
      location: "Bandra, Mumbai",
      createdAt: "5 hours ago", 
      status: "open"
    },
    {
      id: "3",
      title: "Electrical Wiring for New Office",
      category: "Electrical Work",
      description: "Complete electrical setup needed for 1500 sq ft office space.",
      location: "Gurgaon, Delhi NCR",
      createdAt: "1 day ago",
      status: "open"
    }
  ];

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`preview-job-${job.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2" data-testid={`preview-job-title-${job.id}`}>
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{job.createdAt}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" data-testid={`preview-job-category-${job.id}`}>
            {job.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {job.description}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLocation(`/job/${job.id}`)}
          data-testid={`preview-job-view-${job.id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-background" data-testid="browse-jobs-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="preview-section-title">
            Latest Job Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="preview-section-description">
            Discover the newest service requests from customers in your area
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading latest jobs...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="preview-jobs-grid">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => setLocation("/browse-jobs")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
            data-testid="view-all-jobs-cta"
          >
            View All Jobs
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}