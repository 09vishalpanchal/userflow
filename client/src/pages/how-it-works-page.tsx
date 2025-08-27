import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle, Search, MessageCircle, User, FileText, Shield, CreditCard } from "lucide-react";

export default function HowItWorksPage() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null); // Would come from auth context

  const customerSteps = [
    {
      icon: <FileText className="text-primary" size={24} />,
      title: "Post Your Job",
      description: "Describe what you need, set your budget, and specify your location. It's free to post!"
    },
    {
      icon: <Search className="text-primary" size={24} />,
      title: "Get Bids from Providers",
      description: "Qualified service providers will review your job and submit competitive bids."
    },
    {
      icon: <User className="text-primary" size={24} />,
      title: "Choose Your Provider",
      description: "Review provider profiles, ratings, and bids to select the best fit for your needs."
    },
    {
      icon: <MessageCircle className="text-primary" size={24} />,
      title: "Connect & Complete",
      description: "Contact your chosen provider directly and get your job done professionally."
    }
  ];

  const providerSteps = [
    {
      icon: <User className="text-primary" size={24} />,
      title: "Register & Create Profile",
      description: "Sign up, add your business details, and showcase your skills and experience."
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Get Verified",
      description: "Upload required documents and get verified by our team to build customer trust."
    },
    {
      icon: <Search className="text-primary" size={24} />,
      title: "Browse & Apply to Jobs",
      description: "Find jobs in your area that match your skills. Submit competitive bids."
    },
    {
      icon: <CreditCard className="text-primary" size={24} />,
      title: "Unlock Contact Details",
      description: "Pay ₹100 to unlock customer contact details and start working on jobs."
    }
  ];

  const benefits = {
    customers: [
      "Free job posting",
      "Multiple competitive bids",
      "Verified service providers",
      "Direct communication",
      "No hidden fees",
      "Quality guarantee"
    ],
    providers: [
      "Access to local jobs",
      "Grow your business",
      "Verified customer base",
      "Flexible working",
      "Competitive marketplace",
      "Regular income opportunity"
    ]
  };

  return (
    <div className="min-h-screen bg-background" data-testid="how-it-works-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            How ServiceConnect Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="page-description">
            Connect with trusted service providers or find new customers in just a few simple steps
          </p>
        </div>

        {/* Customer Flow */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" data-testid="customer-section-title">
              For Customers
            </h2>
            <p className="text-lg text-muted-foreground">
              Get your jobs done by trusted professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {customerSteps.map((step, index) => (
              <Card key={index} className="text-center" data-testid={`customer-step-${index + 1}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/post-job")}
              data-testid="post-job-cta"
            >
              Post Your First Job
            </Button>
          </div>
        </section>

        {/* Provider Flow */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" data-testid="provider-section-title">
              For Service Providers
            </h2>
            <p className="text-lg text-muted-foreground">
              Grow your business with new customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {providerSteps.map((step, index) => (
              <Card key={index} className="text-center" data-testid={`provider-step-${index + 1}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/join-as-provider")}
              data-testid="join-provider-cta"
            >
              Join as Service Provider
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" data-testid="benefits-title">
              Why Choose ServiceConnect?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card data-testid="customer-benefits">
              <CardHeader>
                <CardTitle className="text-xl text-center">Customer Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.customers.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="provider-benefits">
              <CardHeader>
                <CardTitle className="text-xl text-center">Provider Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.providers.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="final-cta-title">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of satisfied customers and service providers on ServiceConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/post-job")}
              data-testid="final-customer-cta"
            >
              Post a Job
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation("/join-as-provider")}
              data-testid="final-provider-cta"
            >
              Become a Provider
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}