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

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null); // In a real app, this would come from auth context

  const handleSignIn = () => {
    setLocation("/auth/login");
  };

  const handleGetStarted = () => {
    setLocation("/auth/register");
  };

  const handleCustomerSignup = () => {
    setLocation("/auth/register?type=customer");
  };

  const handleProviderSignup = () => {
    setLocation("/auth/register?type=provider");
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
    </div>
  );
}
