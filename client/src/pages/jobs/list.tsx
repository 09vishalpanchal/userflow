import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, DollarSign, X, Search, SlidersHorizontal, Calendar, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MobileAppLayout } from "@/components/layout/mobile-app-layout";
import { Navbar } from "@/components/navbar";

interface FilterState {
  search: string;
  location: string;
  categories: string[];
  budgetRange: number[];
  urgency: string;
  sortBy: string;
  page: number;
}

export default function JobsList() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get URL parameters for SEO-friendly filtering
  const urlParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState<FilterState>({
    search: urlParams.get('search') || '',
    location: urlParams.get('location') || '',
    categories: urlParams.getAll('category'),
    budgetRange: urlParams.get('minBudget') && urlParams.get('maxBudget') 
      ? [parseInt(urlParams.get('minBudget')!), parseInt(urlParams.get('maxBudget')!)]
      : [0, 50000],
    urgency: urlParams.get('urgency') || 'all',
    sortBy: urlParams.get('sort') || 'newest',
    page: parseInt(urlParams.get('page') || '1'),
  });

  const serviceCategories = [
    "Home Cleaning", "Plumbing", "Electrical Work", "Carpentry", "Painting", 
    "HVAC", "Appliance Repair", "Gardening", "Beauty & Spa", "Auto Services",
    "Tech Support", "Tutoring", "Pet Care", "Moving Services", "Photography", "Catering"
  ];

  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", 
    "Kolkata", "Jaipur", "Ahmedabad", "Surat"
  ];

  // Update URL when filters change (SEO-friendly)
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.location) params.set('location', newFilters.location);
    newFilters.categories.forEach(cat => params.append('category', cat));
    if (newFilters.budgetRange[0] > 0) params.set('minBudget', newFilters.budgetRange[0].toString());
    if (newFilters.budgetRange[1] < 50000) params.set('maxBudget', newFilters.budgetRange[1].toString());
    if (newFilters.urgency !== 'all') params.set('urgency', newFilters.urgency);
    if (newFilters.sortBy !== 'newest') params.set('sort', newFilters.sortBy);
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());

    const newURL = `/jobs/list${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
  };

  // Fetch jobs with filters
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['/api/jobs/list', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.location) params.set('location', filters.location);
      filters.categories.forEach(cat => params.append('category', cat));
      if (filters.budgetRange[0] > 0) params.set('minBudget', filters.budgetRange[0].toString());
      if (filters.budgetRange[1] < 50000) params.set('maxBudget', filters.budgetRange[1].toString());
      if (filters.urgency !== 'all') params.set('urgency', filters.urgency);
      params.set('sort', filters.sortBy);
      params.set('page', filters.page.toString());
      params.set('limit', '12');

      const response = await apiRequest("GET", `/api/jobs/list?${params}`);
      return response.json();
    },
  });

  // Update filters and URL
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    setFilters(updated);
    updateURL(updated);
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      location: '',
      categories: [],
      budgetRange: [0, 50000],
      urgency: 'all',
      sortBy: 'newest',
      page: 1,
    };
    setFilters(cleared);
    updateURL(cleared);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'asap': return 'bg-orange-100 text-orange-800';
      case 'flexible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderFilters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search Jobs</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium mb-2">Service Categories</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {serviceCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label className="text-sm cursor-pointer" onClick={() => toggleCategory(category)}>
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Budget Range: ₹{filters.budgetRange[0]} - ₹{filters.budgetRange[1]}
        </label>
        <Slider
          value={filters.budgetRange}
          onValueChange={(value) => updateFilters({ budgetRange: value })}
          max={50000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium mb-2">Urgency</label>
        <Select value={filters.urgency} onValueChange={(value) => updateFilters({ urgency: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
            <SelectItem value="asap">ASAP (Within 3 days)</SelectItem>
            <SelectItem value="flexible">Flexible Timing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderJobCard = (job: any) => (
    <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge className={getUrgencyColor(job.urgency || 'flexible')}>
            {job.urgency || 'Flexible'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{job.category}</Badge>
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <DollarSign size={14} />
            <span>₹{job.budget || 'Negotiable'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <User size={14} />
            <span>By {job.customerName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={14} />
            <span>{job.proposals || 0} proposals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Desktop */}
        <div className={`lg:w-80 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              {renderFilters()}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Available Jobs</h1>
              <p className="text-gray-600">
                {jobsData?.total || 0} jobs found
                {filters.location && ` in ${filters.location}`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <SlidersHorizontal size={16} className="mr-1" />
                Filters
              </Button>
              
              {/* Sort */}
              <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="budget_high">Highest Budget</SelectItem>
                  <SelectItem value="budget_low">Lowest Budget</SelectItem>
                  <SelectItem value="urgent">Most Urgent</SelectItem>
                  <SelectItem value="proposals">Most Proposals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.categories.length > 0 || filters.search || filters.location || filters.budgetRange[0] > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <X size={14} className="cursor-pointer" onClick={() => updateFilters({ search: '' })} />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.location}
                  <X size={14} className="cursor-pointer" onClick={() => updateFilters({ location: '' })} />
                </Badge>
              )}
              {filters.categories.map(cat => (
                <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                  {cat}
                  <X size={14} className="cursor-pointer" onClick={() => toggleCategory(cat)} />
                </Badge>
              ))}
              {filters.budgetRange[0] > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ₹{filters.budgetRange[0]}+ budget
                  <X size={14} className="cursor-pointer" onClick={() => updateFilters({ budgetRange: [0, 50000] })} />
                </Badge>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Jobs Grid */}
          {!isLoading && jobsData?.jobs && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {jobsData.jobs.map(renderJobCard)}
              </div>

              {/* Pagination */}
              {jobsData.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: jobsData.totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={filters.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilters({ page })}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!isLoading && (!jobsData?.jobs || jobsData.jobs.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Navbar 
          user={user}
          onSignIn={() => setShowAuthModal(true)}
          onGetStarted={() => setShowAuthModal(true)}
          onSignOut={() => setUser(null)}
        />
        {renderContent()}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileAppLayout user={user} onAuthRequired={() => setShowAuthModal(true)}>
          {renderContent()}
        </MobileAppLayout>
      </div>
    </div>
  );
}