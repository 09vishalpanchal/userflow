import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Users, CheckCircle, Shield, Clock } from "lucide-react";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";
import heroImage from "@assets/generated_images/Service_marketplace_hero_image_d2b2ae8f.png";
import serviceProvidersImage from "@assets/generated_images/Professional_service_providers_illustration_42cf6597.png";

interface HeroSectionProps {
  onCustomerSignup: () => void;
  onProviderSignup: () => void;
}

export function HeroSection({ onCustomerSignup, onProviderSignup }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Bangalore");

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-28" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 10,000+ customers
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-hero-title">
              Professional <span className="text-blue-600">Home Services</span> at Your Doorstep
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Connect with verified service professionals for all your home needs. Fast, reliable, and affordable.
            </p>

            {/* Search Section */}
            <div className="mb-8">
              <SearchAutocomplete />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Same Day Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span>100% Secure</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex justify-center lg:justify-start items-center gap-8">
              <div className="text-center" data-testid="rating-stat">
                <div className="text-3xl font-bold text-gray-900">4.8⭐</div>
                <div className="text-sm text-gray-600">Service Rating</div>
              </div>
              
              <div className="text-center" data-testid="customers-stat">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Service Partners</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Professional home services"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
          </div>
        </div>

        {/* Service Providers Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Service Providers
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            All our service professionals are background-verified, trained, and committed to delivering exceptional service quality.
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <img
              src={serviceProvidersImage}
              alt="Professional service providers"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
