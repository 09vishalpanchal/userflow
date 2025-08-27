import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";
import CustomerDashboard from "@/pages/customer/dashboard";
import CustomerProfile from "@/pages/customer/profile";
import PostJob from "@/pages/customer/post-job";
import ProviderDashboard from "@/pages/provider/dashboard";
import ProviderProfile from "@/pages/provider/profile";
import ProviderWallet from "@/pages/provider/wallet";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Auth Routes */}
      <Route path="/auth/register" component={Register} />
      <Route path="/auth/login" component={Login} />
      
      {/* Customer Routes */}
      <Route path="/customer/dashboard" component={CustomerDashboard} />
      <Route path="/customer/profile" component={CustomerProfile} />
      <Route path="/customer/post-job" component={PostJob} />
      
      {/* Provider Routes */}
      <Route path="/provider/dashboard" component={ProviderDashboard} />
      <Route path="/provider/profile" component={ProviderProfile} />
      <Route path="/provider/wallet" component={ProviderWallet} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
