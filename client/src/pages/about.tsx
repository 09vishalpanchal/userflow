import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Users, Target, Heart, Shield, Award, TrendingUp } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);

  const stats = [
    { icon: <Users size={24} />, value: "10,000+", label: "Active Users" },
    { icon: <Award size={24} />, value: "50,000+", label: "Jobs Completed" },
    { icon: <Shield size={24} />, value: "5,000+", label: "Verified Providers" },
    { icon: <TrendingUp size={24} />, value: "95%", label: "Success Rate" }
  ];

  const values = [
    {
      icon: <Target className="text-primary" size={32} />,
      title: "Our Mission",
      description: "To connect skilled service providers with customers who need their expertise, creating opportunities and solving problems in local communities."
    },
    {
      icon: <Heart className="text-primary" size={32} />,
      title: "Our Vision",
      description: "To become India's most trusted platform for local services, empowering millions of service providers while making life easier for customers."
    },
    {
      icon: <Shield className="text-primary" size={32} />,
      title: "Our Values",
      description: "Trust, transparency, and quality in every interaction. We believe in fair pricing, verified providers, and exceptional customer service."
    }
  ];

  const team = [
    {
      name: "Arjun Patel",
      role: "Founder & CEO",
      description: "Tech entrepreneur with 10+ years experience in marketplace platforms."
    },
    {
      name: "Priya Singh", 
      role: "Head of Operations",
      description: "Operations expert focused on provider onboarding and quality assurance."
    },
    {
      name: "Rajesh Kumar",
      role: "CTO", 
      description: "Technology leader building scalable platforms for millions of users."
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="about-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            About ServiceConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="page-description">
            We're on a mission to revolutionize how people find and hire local service providers across India. 
            Our platform connects skilled professionals with customers who need quality services.
          </p>
        </div>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center" data-testid={`stat-${index}`}>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center" data-testid={`value-${index}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mb-16">
          <Card data-testid="story-section">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                ServiceConnect was founded in 2023 with a simple observation: finding reliable local service providers 
                was unnecessarily difficult, while skilled professionals struggled to find consistent work. We decided 
                to bridge this gap with technology.
              </p>
              <br />
              <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                Starting in Bangalore, we've grown to connect thousands of service providers with customers across 
                multiple cities. Our platform ensures quality through verification processes, transparent pricing, 
                and a robust review system.
              </p>
              <br />
              <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                Today, ServiceConnect is helping people get their daily tasks done while empowering service providers 
                to build sustainable businesses. We're just getting started.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-testid="team-title">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center" data-testid={`team-member-${index}`}>
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-primary font-semibold">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="cta-title">
            Join Our Growing Community
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Whether you need services or provide them, ServiceConnect is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/post-job")}
              data-testid="customer-cta"
            >
              Post a Job
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation("/join-as-provider")}
              data-testid="provider-cta"
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