import { Button } from "@/components/ui/button";
import { Search, Briefcase } from "lucide-react";

interface HeroSectionProps {
  onCustomerSignup: () => void;
  onProviderSignup: () => void;
}

export function HeroSection({ onCustomerSignup, onProviderSignup }: HeroSectionProps) {
  return (
    <section className="hero-gradient text-white py-20" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Connect with Local 
            <span className="block">Service Providers</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto" data-testid="text-hero-description">
            Find trusted professionals for your home and business needs, or grow your service business by connecting with local customers.
          </p>
          
          {/* Dual CTA Section */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12" data-testid="cta-section">
            {/* Customer CTA */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20" data-testid="card-customer-cta">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-customer-title">Looking for Services?</h3>
                <p className="text-white/80 mb-6" data-testid="text-customer-description">Find verified professionals for cleaning, repairs, beauty, and more.</p>
                <Button 
                  className="w-full bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors" 
                  onClick={onCustomerSignup}
                  data-testid="button-find-services"
                >
                  Find Services
                </Button>
              </div>
            </div>
            
            {/* Provider CTA */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20" data-testid="card-provider-cta">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-provider-title">Offer Services?</h3>
                <p className="text-white/80 mb-6" data-testid="text-provider-description">Join our platform and connect with customers in your area.</p>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
                  onClick={onProviderSignup}
                  data-testid="button-start-earning"
                >
                  Start Earning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
