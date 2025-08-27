import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";
import CustomerDashboard from "@/pages/customer/dashboard";
import CustomerDashboardProfile from "@/pages/customer/profile";
import PostJob from "@/pages/customer/post-job";
import ProviderDashboard from "@/pages/provider/dashboard";
import ProviderDashboardProfile from "@/pages/provider/profile";
import ProviderWallet from "@/pages/provider/wallet";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

// Profile Completion Pages
import CustomerProfileCompletion from "@/pages/profile-completion/customer-profile";
import ProviderProfileCompletion from "@/pages/profile-completion/provider-profile";

// Phase 1 Public Pages - Lazy loaded for better SEO
const BrowseJobs = lazy(() => import("@/pages/browse-jobs"));
const JobDetails = lazy(() => import("@/pages/job-details"));
const HowItWorksPage = lazy(() => import("@/pages/how-it-works-page"));
const JoinAsProvider = lazy(() => import("@/pages/join-as-provider"));
const ProviderProfilePage = lazy(() => import("@/pages/provider-profile-page"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const FAQ = lazy(() => import("@/pages/faq"));
const Blog = lazy(() => import("@/pages/blog"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Auth Routes */}
        <Route path="/auth/register" component={Register} />
        <Route path="/auth/login" component={Login} />
        
        {/* Profile Completion Routes */}
        <Route path="/profile/customer" component={CustomerProfileCompletion} />
        <Route path="/profile/provider" component={ProviderProfileCompletion} />
        
        {/* Public Pages */}
        <Route path="/browse-jobs" component={BrowseJobs} />
        <Route path="/jobs/:city/:category" component={BrowseJobs} />
        <Route path="/job/:jobId" component={JobDetails} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/post-job" component={PostJob} />
        <Route path="/join-as-provider" component={JoinAsProvider} />
        <Route path="/provider/:providerId" component={ProviderProfilePage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/blog" component={Blog} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" component={CustomerDashboard} />
        <Route path="/customer/profile" component={CustomerDashboardProfile} />
        
        {/* Provider Routes */}
        <Route path="/provider/dashboard" component={ProviderDashboard} />
        <Route path="/provider/profile" component={ProviderDashboardProfile} />
        <Route path="/provider/wallet" component={ProviderWallet} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" component={AdminDashboard} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="serviceconnect-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
