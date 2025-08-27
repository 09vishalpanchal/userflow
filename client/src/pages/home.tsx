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
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null); // In a real app, this would come from auth context
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [defaultUserType, setDefaultUserType] = useState<"customer" | "provider">("customer");

  const handleSignIn = () => {
    setShowLoginModal(true);
  };

  const handleGetStarted = () => {
    setDefaultUserType("customer");
    setShowRegisterModal(true);
  };

  const handleCustomerSignup = () => {
    setDefaultUserType("customer");
    setShowRegisterModal(true);
  };

  const handleProviderSignup = () => {
    setDefaultUserType("provider");
    setShowRegisterModal(true);
  };

  const handleSignOut = () => {
    setUser(null);
    // Clear auth state
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
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

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        defaultUserType={defaultUserType}
      />
    </div>
  );
}
