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
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, Filter, X, Search, SlidersHorizontal } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MobileAppLayout } from "@/components/layout/mobile-app-layout";
import { Navbar } from "@/components/navbar";

interface FilterState {
  search: string;
  location: string;
  categories: string[];
  rating: number[];
  priceRange: number[];
  availability: string;
  sortBy: string;
  page: number;
}

export default function ProvidersList() {
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
    rating: urlParams.get('rating') ? [parseInt(urlParams.get('rating')!)] : [0],
    priceRange: urlParams.get('minPrice') && urlParams.get('maxPrice') 
      ? [parseInt(urlParams.get('minPrice')!), parseInt(urlParams.get('maxPrice')!)]
      : [0, 5000],
    availability: urlParams.get('availability') || 'all',
    sortBy: urlParams.get('sort') || 'rating',
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
    if (newFilters.rating[0] > 0) params.set('rating', newFilters.rating[0].toString());
    if (newFilters.priceRange[0] > 0) params.set('minPrice', newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < 5000) params.set('maxPrice', newFilters.priceRange[1].toString());
    if (newFilters.availability !== 'all') params.set('availability', newFilters.availability);
    if (newFilters.sortBy !== 'rating') params.set('sort', newFilters.sortBy);
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());

    const newURL = `/providers/list${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
  };

  // Fetch providers with filters
  const { data: providersData, isLoading } = useQuery({
    queryKey: ['/api/providers/list', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.location) params.set('location', filters.location);
      filters.categories.forEach(cat => params.append('category', cat));
      if (filters.rating[0] > 0) params.set('minRating', filters.rating[0].toString());
      if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 5000) params.set('maxPrice', filters.priceRange[1].toString());
      if (filters.availability !== 'all') params.set('availability', filters.availability);
      params.set('sort', filters.sortBy);
      params.set('page', filters.page.toString());
      params.set('limit', '12');

      const response = await apiRequest("GET", `/api/providers/list?${params}`);
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
      rating: [0],
      priceRange: [0, 5000],
      availability: 'all',
      sortBy: 'rating',
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
        <label className="block text-sm font-medium mb-2">Search Providers</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search by name or service..."
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

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Minimum Rating: {filters.rating[0]} stars
        </label>
        <Slider
          value={filters.rating}
          onValueChange={(value) => updateFilters({ rating: value })}
          max={5}
          min={0}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilters({ priceRange: value })}
          max={5000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium mb-2">Availability</label>
        <Select value={filters.availability} onValueChange={(value) => updateFilters({ availability: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="today">Available Today</SelectItem>
            <SelectItem value="week">Available This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderProviderCard = (provider: any) => (
    <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-semibold text-gray-600">
                {provider.businessName?.[0] || provider.name?.[0] || 'P'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{provider.businessName || provider.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{provider.location || 'Bangalore'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="font-medium">{provider.rating || '4.5'}</span>
            <span className="text-sm text-gray-500">({provider.reviewCount || '12'})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {provider.businessDetails || 'Professional service provider with years of experience.'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(provider.serviceCategories || ['Home Cleaning']).slice(0, 3).map((cat: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
          {(provider.serviceCategories?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(provider.serviceCategories?.length || 0) - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={14} />
            <span>Available {provider.availability || 'Today'}</span>
          </div>
          <div className="text-sm font-semibold">
            From ₹{provider.startingPrice || '500'}
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
              <h1 className="text-2xl font-bold">Service Providers</h1>
              <p className="text-gray-600">
                {providersData?.total || 0} providers found
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
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.categories.length > 0 || filters.search || filters.location || filters.rating[0] > 0) && (
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
              {filters.rating[0] > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.rating[0]}+ stars
                  <X size={14} className="cursor-pointer" onClick={() => updateFilters({ rating: [0] })} />
                </Badge>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

          {/* Providers Grid */}
          {!isLoading && providersData?.providers && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {providersData.providers.map(renderProviderCard)}
              </div>

              {/* Pagination */}
              {providersData.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: providersData.totalPages }, (_, i) => i + 1).map(page => (
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
          {!isLoading && (!providersData?.providers || providersData.providers.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No providers found</h3>
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