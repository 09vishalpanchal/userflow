import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServiceCategories } from "@/components/service-categories";
import { NewNoteworthy } from "@/components/new-noteworthy";
import { FeaturedServices } from "@/components/featured-services";
import { CategorySpecificSections } from "@/components/category-specific-sections";
import { HowItWorks } from "@/components/how-it-works";
import { BrowseJobsPreview } from "@/components/browse-jobs-preview";
import { FeaturedProviders } from "@/components/featured-providers";
import { Testimonials } from "@/components/testimonials";
import { MobileAppSection } from "@/components/mobile-app-section";
import { Footer } from "@/components/footer";
import { MobileAppLayout } from "@/components/layout/mobile-app-layout";
import UnifiedAuthModal from "@/components/auth/unified-auth-modal";
import { authUtils, type User } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  // Check for existing authentication on component mount
  useEffect(() => {
    const existingUser = authUtils.getUser();
    if (existingUser) {
      setUser(existingUser);
    }
  }, []);

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleCustomerSignup = () => {
    setShowAuthModal(true);
  };

  const handleProviderSignup = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    authUtils.removeUser();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div data-testid="home-page">
      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background">
        <Navbar 
          user={user}
          onSignIn={handleSignIn}
          onGetStarted={handleGetStarted}
          onSignOut={handleSignOut}
        />
        
        <main>
          <HeroSection 
            onCustomerSignup={handleCustomerSignup}
            onProviderSignup={handleProviderSignup}
          />
          <ServiceCategories />
          <NewNoteworthy />
          <FeaturedServices />
          <CategorySpecificSections />
          <BrowseJobsPreview />
          <FeaturedProviders />
          <Testimonials />
          <MobileAppSection />
        </main>
        
        <Footer />
      </div>

      {/* Mobile/Tablet App Layout */}
      <div className="lg:hidden">
        <MobileAppLayout user={user} onAuthRequired={handleSignIn}>
          <main>
            <HeroSection 
              onCustomerSignup={handleCustomerSignup}
              onProviderSignup={handleProviderSignup}
            />
            <ServiceCategories />
            <NewNoteworthy />
            <FeaturedServices />
            <CategorySpecificSections />
            <BrowseJobsPreview />
            <FeaturedProviders />
            <Testimonials />
            <MobileAppSection />
          </main>
        </MobileAppLayout>
      </div>

      {/* Auth Modal */}
      <UnifiedAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
