import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Star, MapPin, Calendar, CheckCircle, Phone, Mail, ArrowLeft } from "lucide-react";

interface ProviderProfile {
  id: string;
  name: string;
  businessName: string;
  businessDetails: string;
  serviceCategories: string[];
  location: string;
  rating: number;
  totalJobs: number;
  yearsExperience: number;
  verified: boolean;
  profileImage?: string;
  gallery: string[];
  reviews: Review[];
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  jobTitle: string;
}

export default function ProviderProfilePage() {
  const { providerId } = useParams();
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null); // Would come from auth context

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/provider", providerId],
    enabled: !!providerId,
  });

  // Mock data for demonstration
  const profile: ProviderProfile = profileData?.profile || {
    id: "1",
    name: "Rajesh Kumar",
    businessName: "Kumar's Home Services",
    businessDetails: "Professional plumbing and electrical services with over 8 years of experience. Specializing in residential repairs, installations, and maintenance. Available for emergency calls.",
    serviceCategories: ["Plumbing", "Electrical Work", "Home Repair"],
    location: "Koramangala, Bangalore",
    rating: 4.8,
    totalJobs: 156,
    yearsExperience: 8,
    verified: true,
    gallery: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200", 
      "/api/placeholder/300/200"
    ],
    reviews: [
      {
        id: "1",
        customerName: "Priya S.",
        rating: 5,
        comment: "Excellent work on fixing our kitchen plumbing. Very professional and cleaned up after the job. Highly recommended!",
        date: "2 days ago",
        jobTitle: "Kitchen Plumbing Repair"
      },
      {
        id: "2", 
        customerName: "Amit R.",
        rating: 5,
        comment: "Quick response and fair pricing. Fixed our electrical issues efficiently. Will definitely call again.",
        date: "1 week ago",
        jobTitle: "Electrical Repair"
      },
      {
        id: "3",
        customerName: "Sunita M.",
        rating: 4,
        comment: "Good work overall. Arrived on time and completed the job as promised.",
        date: "2 weeks ago", 
        jobTitle: "Home Maintenance"
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="loading-state">
        <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading provider profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating = profile.reviews.reduce((acc, review) => acc + review.rating, 0) / profile.reviews.length;

  return (
    <div className="min-h-screen bg-background" data-testid="provider-profile-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/jobs/list")}
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Providers
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card data-testid="profile-header">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 mx-auto md:mx-0">
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold" data-testid="provider-name">
                        {profile.name}
                      </h1>
                      {profile.verified && (
                        <Badge className="bg-green-100 text-green-800 w-fit mx-auto md:mx-0" data-testid="verified-badge">
                          <CheckCircle size={14} className="mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg text-muted-foreground mb-2" data-testid="business-name">
                      {profile.businessName}
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 justify-center md:justify-start">
                        <MapPin size={14} />
                        <span data-testid="provider-location">{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center md:justify-start">
                        <Calendar size={14} />
                        <span>{profile.yearsExperience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center md:justify-start">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span data-testid="provider-rating">{profile.rating} ({profile.totalJobs} jobs)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Service Categories */}
            <Card data-testid="service-categories">
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.serviceCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" data-testid={`category-${index}`}>
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card data-testid="about-section">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.businessDetails}
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card data-testid="reviews-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Reviews ({profile.reviews.length})
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm">{averageRating.toFixed(1)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.reviews.map((review, index) => (
                    <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0" data-testid={`review-${index}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{review.customerName}</h4>
                          <p className="text-xs text-muted-foreground">{review.jobTitle}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-xs">{review.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card data-testid="contact-card">
              <CardHeader>
                <CardTitle>Contact Provider</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Login to contact this provider directly
                    </p>
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => setLocation("/auth/login")}
                        data-testid="login-to-contact"
                      >
                        Login to Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation("/auth/register")}
                        data-testid="register-to-contact"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" data-testid="contact-phone">
                      <Phone size={16} className="mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="contact-email">
                      <Mail size={16} className="mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="hire-provider">
                      Hire This Provider
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card data-testid="stats-card">
              <CardHeader>
                <CardTitle>Provider Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Jobs Completed</span>
                    <span className="font-semibold">{profile.totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Years Experience</span>
                    <span className="font-semibold">{profile.yearsExperience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Verification</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Providers */}
            <Card data-testid="similar-providers">
              <CardHeader>
                <CardTitle>Similar Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-2 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setLocation(`/provider/provider-${i + 1}`)}
                      data-testid={`similar-provider-${i}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>P{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Provider {i}</h4>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          <span className="text-xs">4.{i + 5}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}