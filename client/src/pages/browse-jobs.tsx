import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MapPin, Clock, Filter, Eye, LogIn } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
  status: "open" | "closed";
}

// Categories will be fetched dynamically

const cities = [
  { value: "all", label: "All Cities" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" }, 
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Chennai", label: "Chennai" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Pune", label: "Pune" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Surat", label: "Surat" }
];

export default function BrowseJobs() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null); // Would come from auth context
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    category: "all",
    city: "all",
    radius: 10,
    search: ""
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    enabled: true,
  });

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs/browse", filters],
    enabled: true,
  });

  const serviceCategories = [{ value: "all", label: "All Categories" }, ...((categoriesData as any)?.categories?.map((cat: string) => ({ value: cat, label: cat })) || [])];
  const jobs: Job[] = (jobsData as any)?.jobs || [];

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`job-card-${job.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2" data-testid={`job-title-${job.id}`}>
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span data-testid={`job-location-${job.id}`}>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{job.createdAt}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" data-testid={`job-category-${job.id}`}>
            {job.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4" data-testid={`job-description-${job.id}`}>
          {job.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant={job.status === "open" ? "default" : "secondary"}>
            {job.status === "open" ? "Open" : "Closed"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedJob(job)}
            data-testid={`job-view-${job.id}`}
          >
            <Eye size={14} className="mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const JobDetailsPopup = () => (
    <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
      <DialogContent className="max-w-2xl" data-testid="job-details-popup">
        {selectedJob && (
          <>
            <DialogHeader>
              <DialogTitle data-testid="popup-job-title">{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary">{selectedJob.category}</Badge>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{selectedJob.createdAt}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Job Description</h4>
                <p className="text-muted-foreground">{selectedJob.description}</p>
              </div>
              {!user ? (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Want to apply for this job?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Login or register to contact the customer and submit your bid.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setLocation("/auth/login")} data-testid="popup-login">
                      <LogIn size={14} className="mr-1" />
                      Login
                    </Button>
                    <Button variant="outline" onClick={() => setLocation("/auth/register")} data-testid="popup-register">
                      Register
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button data-testid="popup-bid">Submit Bid</Button>
                  <Button variant="outline" data-testid="popup-unlock">
                    Unlock Contact (₹100)
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  const FilterSidebar = () => (
    <div className="space-y-6" data-testid="filter-sidebar">
      <div>
        <h3 className="font-semibold mb-3">Search Jobs</h3>
        <Input 
          placeholder="Search by title or description..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          data-testid="search-input"
        />
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
          <SelectTrigger data-testid="category-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">City</h3>
        <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
          <SelectTrigger data-testid="city-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Radius</h3>
        <Select 
          value={filters.radius.toString()} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, radius: parseInt(value) }))}
        >
          <SelectTrigger data-testid="radius-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 km</SelectItem>
            <SelectItem value="10">10 km</SelectItem>
            <SelectItem value="20">20 km</SelectItem>
            <SelectItem value="50">50 km</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" data-testid="browse-jobs-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Browse Jobs</h1>
          <p className="text-muted-foreground" data-testid="page-description">
            Find the perfect service opportunities near you
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter size={18} />
                  Filter Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg" data-testid="mobile-filter">
                  <Filter size={18} className="mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Jobs</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Jobs Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12" data-testid="loading-state">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <div className="text-muted-foreground mb-4">
                  <h3 className="text-lg font-semibold">No jobs found</h3>
                  <p>Try adjusting your filters to see more results</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6" data-testid="jobs-grid">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <JobDetailsPopup />
      <Footer />
    </div>
  );
}