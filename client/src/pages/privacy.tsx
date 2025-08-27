import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Shield, Eye, Lock, Users, Mail, Phone } from "lucide-react";

export default function Privacy() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);

  const sections = [
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, and profile details you provide during registration.",
        "Service Information: Details about services you offer or request, location data, and transaction history.",
        "Usage Data: How you interact with our platform, including pages visited, features used, and time spent.",
        "Device Information: Device type, browser information, IP address, and operating system.",
        "Communication Data: Messages, reviews, and other communications between users on the platform."
      ]
    },
    {
      icon: <Eye className="text-primary" size={24} />,
      title: "How We Use Your Information",
      content: [
        "Platform Services: Facilitate connections between customers and service providers.",
        "Account Management: Create and maintain user accounts, verify identities, and process transactions.",
        "Communication: Send notifications, updates, and respond to inquiries.",
        "Safety & Security: Prevent fraud, ensure platform safety, and comply with legal requirements.",
        "Improvement: Analyze usage patterns to improve our services and user experience.",
        "Marketing: Send promotional content and updates about our services (with consent)."
      ]
    },
    {
      icon: <Users className="text-primary" size={24} />,
      title: "Information Sharing",
      content: [
        "Between Users: We share relevant profile information between customers and service providers to facilitate transactions.",
        "Service Providers: Third-party services that help us operate our platform (payment processors, cloud storage).",
        "Legal Requirements: When required by law, court order, or government regulations.",
        "Business Transfers: In case of merger, acquisition, or sale of our business assets.",
        "Consent: Any other sharing will be done only with your explicit consent."
      ]
    },
    {
      icon: <Lock className="text-primary" size={24} />,
      title: "Data Security",
      content: [
        "Encryption: All sensitive data is encrypted both in transit and at rest.",
        "Access Controls: Strict access controls ensure only authorized personnel can access user data.",
        "Regular Audits: We conduct regular security audits and assessments.",
        "Secure Infrastructure: Our platform is hosted on secure, industry-standard infrastructure.",
        "Incident Response: We have procedures in place to respond to any security incidents promptly."
      ]
    }
  ];

  const rights = [
    "Access your personal data and understand how it's being used",
    "Correct or update inaccurate or incomplete information",
    "Delete your account and associated data (subject to legal requirements)",
    "Object to or restrict certain processing of your data",
    "Data portability - receive your data in a structured format",
    "Withdraw consent for marketing communications at any time"
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="privacy-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="page-description">
            At ServiceConnect, we're committed to protecting your privacy and being transparent about how we handle your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 1, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8" data-testid="introduction">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy explains how ServiceConnect ("we," "our," or "us") collects, uses, shares, and protects 
              your personal information when you use our platform to connect customers with service providers. By using our 
              services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} data-testid={`section-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Your Rights */}
        <Card className="mb-8" data-testid="user-rights">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="text-primary" size={24} />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="space-y-3">
              {rights.map((right, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{right}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8" data-testid="data-retention">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>Active Accounts:</strong> Data is retained while your account is active and for up to 2 years after deactivation.</li>
                <li><strong>Transaction Records:</strong> Financial and transaction data is retained for 7 years for tax and legal compliance.</li>
                <li><strong>Communication Data:</strong> Messages and communications are retained for 3 years for dispute resolution.</li>
                <li><strong>Usage Analytics:</strong> Anonymized usage data may be retained longer for service improvement.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8" data-testid="cookies">
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality and security.</li>
                <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform.</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent).</li>
              </ul>
              <p className="mt-4">
                You can control cookie preferences through your browser settings, but disabling certain cookies may affect platform functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-8" data-testid="children-privacy">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ServiceConnect is not intended for use by children under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If we become aware that we have collected personal information 
              from a child under 18, we will take steps to delete such information promptly.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-8" data-testid="policy-changes">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
              review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card data-testid="contact-info">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={16} />
                <span className="text-muted-foreground">privacy@serviceconnect.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={16} />
                <span className="text-muted-foreground">+91 80 1234 5678</span>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-primary" size={16} />
                <span className="text-muted-foreground">
                  Data Protection Officer<br />
                  ServiceConnect<br />
                  Koramangala, Bangalore, Karnataka 560095
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}