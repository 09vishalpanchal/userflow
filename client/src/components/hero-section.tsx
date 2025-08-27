import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Users } from "lucide-react";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";

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
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-gray-600 mb-6">What are you looking for?</p>
            <SearchAutocomplete />
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
