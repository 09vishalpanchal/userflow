import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Search, UserCheck, MessageSquare, CheckCircle, Plus, Star, CreditCard } from "lucide-react";
import { useState } from "react";

export default function HowItWorks() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"customer" | "provider">("customer");

  return (
    <div className="min-h-screen bg-background" data-testid="how-it-works-page">
      <Navbar 
        user={user} 
        onSignIn={() => setLocation("/auth/login")} 
        onGetStarted={() => setLocation("/auth/register")} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="page-title">
            How ServiceConnect Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple, secure, and efficient. Connect with local service providers or grow your 
            business by offering your services to the community.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "customer" ? "default" : "ghost"}
              onClick={() => setActiveTab("customer")}
              data-testid="tab-customer"
            >
              For Customers
            </Button>
            <Button
              variant={activeTab === "provider" ? "default" : "ghost"}
              onClick={() => setActiveTab("provider")}
              data-testid="tab-provider"
            >
              For Service Providers
            </Button>
          </div>
        </div>

        {/* Customer Flow */}
        {activeTab === "customer" && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center" data-testid="customer-step-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>1. Search Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse our wide range of services or post your specific requirements. 
                    Filter by location, category, and budget to find the perfect match.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="customer-step-2">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>2. Choose Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Review verified profiles, ratings, and previous work samples. 
                    Select the service provider that best fits your needs and budget.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="customer-step-3">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>3. Connect & Discuss</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chat directly with providers to discuss details, timeline, and pricing. 
                    Our platform keeps all communications secure and organized.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="customer-step-4">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>4. Get Service Done</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Work with your chosen provider to complete the job. Rate and review 
                    the service to help others in the community make informed decisions.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Benefits */}
            <Card data-testid="customer-benefits">
              <CardHeader>
                <CardTitle>Why Customers Choose ServiceConnect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">✓ Verified Professionals</h4>
                    <p className="text-muted-foreground text-sm">All service providers undergo background verification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ Transparent Pricing</h4>
                    <p className="text-muted-foreground text-sm">Compare quotes and choose what works for your budget</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ Quality Guarantee</h4>
                    <p className="text-muted-foreground text-sm">Our rating system ensures consistent quality service</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ 24/7 Support</h4>
                    <p className="text-muted-foreground text-sm">Get help whenever you need it throughout your service journey</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Provider Flow */}
        {activeTab === "provider" && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center" data-testid="provider-step-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>1. Create Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sign up and create your professional profile. Upload your credentials, 
                    portfolio, and set your service areas and pricing.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="provider-step-2">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>2. Get Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete our verification process to build trust with customers. 
                    Verified providers get priority visibility in search results.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="provider-step-3">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>3. Find Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse posted jobs that match your skills or wait for customers 
                    to discover your services. Respond to inquiries quickly to win jobs.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center" data-testid="provider-step-4">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>4. Grow Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete jobs, collect payments securely, and build your reputation 
                    through customer reviews. Grow your business with our marketing tools.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Provider Benefits */}
            <Card data-testid="provider-benefits">
              <CardHeader>
                <CardTitle>Why Service Providers Choose ServiceConnect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">✓ Steady Work Flow</h4>
                    <p className="text-muted-foreground text-sm">Access to a large pool of customers seeking your services</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ Secure Payments</h4>
                    <p className="text-muted-foreground text-sm">Get paid quickly and securely through our payment system</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ Marketing Support</h4>
                    <p className="text-muted-foreground text-sm">We help promote your services to the right customers</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✓ Business Tools</h4>
                    <p className="text-muted-foreground text-sm">Manage jobs, track earnings, and grow your business efficiently</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <Card className="mt-16" data-testid="faq-section">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Is ServiceConnect free to use?</h4>
                <p className="text-muted-foreground text-sm">
                  ServiceConnect is free for customers to browse and post jobs. Service providers 
                  pay a small commission only when they successfully complete a job through our platform.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How are service providers verified?</h4>
                <p className="text-muted-foreground text-sm">
                  We verify identity documents, professional licenses, insurance certificates, 
                  and conduct background checks to ensure all providers meet our quality standards.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What if I'm not satisfied with the service?</h4>
                <p className="text-muted-foreground text-sm">
                  We have a comprehensive dispute resolution process and quality guarantee. 
                  If you're not satisfied, we'll work with both parties to find a fair solution.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How quickly can I find a service provider?</h4>
                <p className="text-muted-foreground text-sm">
                  Most customers receive responses within 24 hours of posting a job. For urgent 
                  services, many providers respond within a few hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of customers and service providers who trust ServiceConnect 
            for reliable, quality services. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/auth/register")} 
              size="lg"
              data-testid="button-get-started"
            >
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/about-us")} 
              size="lg"
              data-testid="button-about-us"
            >
              Learn About Us
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}