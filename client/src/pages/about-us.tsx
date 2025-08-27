import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Users, Award, Target, Heart } from "lucide-react";
import { useState } from "react";

export default function AboutUs() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background" data-testid="about-us-page">
      <Navbar 
        user={user} 
        onSignIn={() => setLocation("/auth/login")} 
        onGetStarted={() => setLocation("/auth/register")} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="page-title">
            About ServiceConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting communities through trusted local services, making it easier than ever 
            to find skilled professionals and grow your service business.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card data-testid="mission-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To bridge the gap between service seekers and providers by creating a 
                reliable, user-friendly platform that fosters trust, quality, and 
                community growth. We believe everyone deserves access to quality services 
                and fair opportunities to build their business.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="values-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Trust:</strong> Building reliable connections through verified profiles</li>
                <li>• <strong>Quality:</strong> Maintaining high standards for all services</li>
                <li>• <strong>Community:</strong> Supporting local businesses and neighborhoods</li>
                <li>• <strong>Innovation:</strong> Continuously improving our platform</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center" data-testid="stats-users">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">10,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="stats-services">
            <CardContent className="pt-6">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-muted-foreground">Service Providers</p>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="stats-completed">
            <CardContent className="pt-6">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">25,000+</h3>
              <p className="text-muted-foreground">Jobs Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="mb-16" data-testid="story-card">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ServiceConnect was born from a simple idea: connecting people who need services 
              with skilled professionals in their local community. Founded in 2024, we recognized 
              the challenges both customers and service providers face in finding each other.
            </p>
            <p className="text-muted-foreground mb-4">
              Customers often struggle to find reliable, trustworthy service providers, while 
              talented professionals find it difficult to reach potential clients. Our platform 
              solves both problems by creating a secure, transparent marketplace that benefits everyone.
            </p>
            <p className="text-muted-foreground">
              Today, ServiceConnect serves thousands of users across multiple cities, facilitating 
              meaningful connections that strengthen local communities and support small businesses.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card data-testid="team-member-1">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">RK</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Raj Kumar</h3>
                <p className="text-muted-foreground text-sm">Founder & CEO</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Passionate about connecting communities through technology
                </p>
              </CardContent>
            </Card>

            <Card data-testid="team-member-2">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">PS</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Priya Sharma</h3>
                <p className="text-muted-foreground text-sm">Head of Operations</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Ensuring smooth operations and exceptional user experience
                </p>
              </CardContent>
            </Card>

            <Card data-testid="team-member-3">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AM</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Arjun Mehta</h3>
                <p className="text-muted-foreground text-sm">Lead Developer</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Building innovative solutions for the service marketplace
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and service providers who trust ServiceConnect 
            for their service needs. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/auth/register")} 
              size="lg"
              data-testid="button-get-started"
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/how-it-works")} 
              size="lg"
              data-testid="button-learn-more"
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}