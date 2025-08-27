import { useState } from "react";
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
import UnifiedAuthModal from "@/components/auth/unified-auth-modal";

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null); // In a real app, this would come from auth context
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    setUser(null);
    // Clear auth state
  };

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
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

      {/* Auth Modal */}
      <UnifiedAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
