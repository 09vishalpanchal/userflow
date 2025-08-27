import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchAutocompleteProps {
  placeholder?: string;
  onSearch?: (query: string, location: string) => void;
  className?: string;
}

export function SearchAutocomplete({ 
  placeholder = "Search for services...", 
  onSearch,
  className = ""
}: SearchAutocompleteProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Bangalore");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const serviceCategories = [
    "Home Cleaning",
    "Plumbing", 
    "Electrical Work",
    "Carpentry",
    "Painting",
    "HVAC",
    "Appliance Repair",
    "Gardening",
    "Beauty & Spa",
    "Auto Services",
    "Tech Support",
    "Tutoring",
    "Pet Care",
    "Moving Services",
    "Photography",
    "Catering"
  ];

  const trendingSearches = [
    "Home Cleaning Service",
    "AC Repair",
    "Plumber Near Me",
    "House Painting",
    "Laptop Repair",
    "Pet Grooming",
  ];

  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", 
    "Kolkata", "Jaipur", "Ahmedabad", "Surat"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const matchedServices = serviceCategories
        .filter(service => service.toLowerCase().includes(query))
        .slice(0, 5);
      
      const matchedRecent = recentSearches
        .filter(search => search.toLowerCase().includes(query))
        .slice(0, 3);

      const combined = [
        ...matchedRecent.map(search => ({ text: search, type: 'recent' })),
        ...matchedServices.map(service => ({ text: service, type: 'service' })),
      ].slice(0, 8);

      setSuggestions(combined);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, recentSearches]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    
    if (searchTerm.trim()) {
      // Add to recent searches
      const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      
      // Perform search
      if (onSearch) {
        onSearch(searchTerm, locationQuery);
      } else {
        // Default navigation to browse jobs with search
        setLocation(`/browse-jobs?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(locationQuery)}`);
      }
      
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-10 py-3 rounded-lg border-2 border-gray-200 focus:border-primary"
            data-testid="search-input"
          />
        </div>
        
        <div className="hidden sm:block relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="pl-10 py-3 w-36 rounded-lg border-2 border-gray-200 focus:border-primary"
            data-testid="location-input"
          />
        </div>
        
        <Button 
          onClick={() => handleSearch()}
          className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg"
          data-testid="search-button"
        >
          <Search size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {isSearchOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Searching...
              </div>
            ) : (
              <>
                {/* Current Search Results */}
                {suggestions.length > 0 && (
                  <div className="border-b">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Suggestions
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                        data-testid={`suggestion-${index}`}
                      >
                        {suggestion.type === 'recent' ? (
                          <Clock size={16} className="text-gray-400" />
                        ) : (
                          <Search size={16} className="text-gray-400" />
                        )}
                        <span className="flex-1">{suggestion.text}</span>
                        {suggestion.type === 'recent' && (
                          <Badge variant="outline" className="text-xs">Recent</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && searchQuery.length === 0 && (
                  <div className="border-b">
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase">
                        Recent Searches
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs h-auto p-1"
                      >
                        Clear
                      </Button>
                    </div>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                      >
                        <Clock size={16} className="text-gray-400" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                {searchQuery.length === 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <TrendingUp size={12} />
                      Trending
                    </div>
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                      >
                        <TrendingUp size={16} className="text-orange-400" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {suggestions.length === 0 && searchQuery.length > 0 && !isLoading && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No suggestions found for "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}