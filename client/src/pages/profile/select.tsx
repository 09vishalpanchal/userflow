import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, ArrowRight } from "lucide-react";

export default function ProfileSelect() {
  const [, setLocation] = useLocation();
  const userId = new URLSearchParams(window.location.search).get("userId");

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Invalid Access</h2>
            <p className="text-muted-foreground mb-4">User information not found.</p>
            <Button onClick={() => setLocation("/")} data-testid="button-home">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCustomerSelect = () => {
    setLocation(`/profile/customer?userId=${userId}`);
  };

  const handleProviderSelect = () => {
    setLocation(`/profile/provider?userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4" data-testid="profile-select-page">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-select-title">
            Choose Your Role
          </h1>
          <p className="text-muted-foreground" data-testid="text-profile-select-description">
            How would you like to use ServiceConnect?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Option */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={handleCustomerSelect}
            data-testid="card-customer"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">I'm a Customer</CardTitle>
              <CardDescription>
                I want to find and book services from local providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Browse and book services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Post job requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Rate and review providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Manage bookings and payments</span>
                </div>
              </div>
              <Button className="w-full" data-testid="button-select-customer">
                Continue as Customer
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Provider Option */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={handleProviderSelect}
            data-testid="card-provider"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">I'm a Service Provider</CardTitle>
              <CardDescription>
                I want to offer my services and grow my business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>List your services and skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Receive job requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Build your reputation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <span>Manage earnings and wallet</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" data-testid="button-select-provider">
                  Continue as Provider
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  ⚠️ Provider accounts require admin approval
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can always switch your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}