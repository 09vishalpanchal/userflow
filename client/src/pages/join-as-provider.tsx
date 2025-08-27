import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle, Star, TrendingUp, Shield, Users, CreditCard, Zap } from "lucide-react";

export default function JoinAsProvider() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null); // Would come from auth context

  const benefits = [
    {
      icon: <Users className="text-primary" size={24} />,
      title: "Access to Customers",
      description: "Get connected with thousands of customers looking for your services"
    },
    {
      icon: <TrendingUp className="text-primary" size={24} />,
      title: "Grow Your Business",
      description: "Expand your client base and increase your income with regular job opportunities"
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Verified Platform", 
      description: "Work with verified customers in a trusted and secure environment"
    },
    {
      icon: <Zap className="text-primary" size={24} />,
      title: "Quick Payments",
      description: "Get paid directly by customers with transparent pricing"
    },
    {
      icon: <Star className="text-primary" size={24} />,
      title: "Build Reputation",
      description: "Earn ratings and reviews to establish your credibility and attract more jobs"
    },
    {
      icon: <CreditCard className="text-primary" size={24} />,
      title: "Low Cost",
      description: "Only ₹100 to unlock each job's contact details. No monthly fees!"
    }
  ];

  const categories = [
    "Home Cleaning",
    "Plumbing", 
    "Electrical Work",
    "Carpentry",
    "Painting",
    "HVAC",
    "Appliance Repair",
    "Gardening",
    "Beauty & Spa",
    "Auto Services",
    "Tech Support",
    "Tutoring",
    "Pet Care",
    "Moving Services",
    "Photography",
    "Catering",
    "Event Planning",
    "Interior Design"
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      service: "Plumbing Services",
      rating: 5,
      text: "I've been using ServiceConnect for 6 months and have completed over 50 jobs. Great platform to find regular work!",
      earnings: "₹45,000/month"
    },
    {
      name: "Priya Sharma", 
      service: "Home Cleaning",
      rating: 5,
      text: "The customers are genuine and payments are always on time. Highly recommend for service providers.",
      earnings: "₹30,000/month"
    },
    {
      name: "Mohammed Ali",
      service: "Electrical Work", 
      rating: 5,
      text: "Easy to use platform with good job availability. I've grown my business significantly through this.",
      earnings: "₹60,000/month"
    }
  ];

  const steps = [
    "Sign up with your phone number",
    "Complete your business profile",
    "Upload verification documents", 
    "Get approved by our team",
    "Start browsing and applying to jobs",
    "Unlock contact details for ₹100 per job",
    "Complete jobs and earn money"
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="join-provider-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="hero-title">
            Join as Service Provider
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6" data-testid="hero-description">
            Turn your skills into income. Connect with customers who need your services and grow your business.
          </p>
          <Button 
            size="lg" 
            onClick={() => setLocation("/auth/register?type=provider")}
            data-testid="hero-cta"
          >
            Start Earning Today
          </Button>
        </div>

        {/* Benefits Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="benefits-title">
            Why Service Providers Love Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center" data-testid={`benefit-${index}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="categories-title">
            Service Categories Available
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="justify-center p-3 text-center"
                data-testid={`category-${index}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="steps-title">
            How It Works
          </h2>
          <Card className="max-w-2xl mx-auto" data-testid="steps-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4" data-testid={`step-${index}`}>
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="testimonials-title">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} data-testid={`testimonial-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="text-sm">{testimonial.rating}</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{testimonial.earnings}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="pricing-title">
            Simple, Transparent Pricing
          </h2>
          <Card className="max-w-md mx-auto text-center" data-testid="pricing-card">
            <CardHeader>
              <CardTitle className="text-2xl">Pay Per Job</CardTitle>
              <div className="text-4xl font-bold text-primary">₹100</div>
              <p className="text-muted-foreground">per contact unlock</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">No monthly subscription fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">Only pay when you get a job</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">Free profile and job browsing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">Direct customer contact</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="final-cta-title">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of successful service providers already earning through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/auth/register?type=provider")}
              data-testid="register-provider-cta"
            >
              Register as Provider
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation("/browse-jobs")}
              data-testid="browse-jobs-cta"
            >
              Browse Available Jobs
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}