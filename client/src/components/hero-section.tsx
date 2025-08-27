import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Users } from "lucide-react";

interface HeroSectionProps {
  onCustomerSignup: () => void;
  onProviderSignup: () => void;
}

export function HeroSection({ onCustomerSignup, onProviderSignup }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Bangalore");

  return (
    <section className="bg-white py-12 md:py-16" data-testid="hero-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="text-hero-title">
            Home services at your doorstep
          </h1>
          
          {/* Search Section */}
          <div className="max-w-lg mx-auto mb-8">
            <p className="text-lg text-gray-600 mb-6">What are you looking for?</p>
            
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 rounded-lg border-2 border-gray-200 focus:border-primary"
                  data-testid="input-search"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 py-3 w-32 rounded-lg border-2 border-gray-200 focus:border-primary"
                  data-testid="input-location"
                />
              </div>
              <Button 
                className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg"
                data-testid="button-search"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2" data-testid="rating-stat">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Service Rating*</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2" data-testid="customers-stat">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Customers Globally*</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
