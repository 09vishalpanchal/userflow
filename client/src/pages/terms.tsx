import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FileText, Users, Shield, CreditCard, AlertTriangle, Scale } from "lucide-react";

export default function Terms() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);

  const sections = [
    {
      icon: <FileText className="text-primary" size={24} />,
      title: "Platform Overview",
      content: [
        "ServiceConnect is a digital platform that connects customers with local service providers.",
        "We facilitate introductions and provide tools for communication, but we are not a party to any service agreements between users.",
        "All services are provided directly between customers and service providers.",
        "By using our platform, you agree to these terms and our Privacy Policy."
      ]
    },
    {
      icon: <Users className="text-primary" size={24} />,
      title: "User Accounts and Registration",
      content: [
        "You must be at least 18 years old to create an account and use our services.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "All information provided during registration must be accurate and up-to-date.",
        "Each user may only maintain one account on the platform.",
        "We reserve the right to suspend or terminate accounts that violate these terms."
      ]
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "User Responsibilities and Conduct",
      content: [
        "Users must not post false, misleading, or fraudulent information.",
        "Harassment, discrimination, or abusive behavior towards other users is strictly prohibited.",
        "Users must respect intellectual property rights and not infringe on copyrights or trademarks.",
        "Commercial activities outside the platform's intended use are not permitted.",
        "Users must comply with all applicable local, state, and federal laws."
      ]
    },
    {
      icon: <CreditCard className="text-primary" size={24} />,
      title: "Payments and Fees",
      content: [
        "Service providers pay ₹100 to unlock customer contact details for each job.",
        "All payments for actual services are made directly between customers and service providers.",
        "Unlock fees are non-refundable once contact details are accessed.",
        "We use secure third-party payment processors to handle transactions.",
        "Users are responsible for any taxes applicable to their transactions."
      ]
    }
  ];

  const prohibitedActivities = [
    "Creating fake profiles or impersonating others",
    "Posting spam, unsolicited advertisements, or irrelevant content",
    "Attempting to circumvent platform fees or policies",
    "Using the platform for illegal activities or services",
    "Sharing personal contact information in public listings to avoid fees",
    "Manipulating ratings and reviews system",
    "Accessing or attempting to access other users' accounts",
    "Interfering with platform functionality or security measures"
  ];

  const limitations = [
    "ServiceConnect acts as an intermediary and is not responsible for the quality of services provided.",
    "We do not guarantee the availability, reliability, or performance of service providers.",
    "Users assume all risks associated with in-person meetings and service provision.",
    "We are not liable for disputes between customers and service providers.",
    "Our liability is limited to the amount of fees paid to us in the 12 months prior to any claim.",
    "We do not provide warranties of any kind, express or implied."
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="terms-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="page-description">
            These terms govern your use of ServiceConnect and describe the rights and responsibilities of all users.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 1, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8" data-testid="introduction">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to ServiceConnect. These Terms of Service ("Terms") constitute a legally binding agreement between 
              you and ServiceConnect regarding your use of our platform. By accessing or using our services, you agree 
              to be bound by these Terms. If you do not agree to these Terms, please do not use our platform.
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

        {/* Prohibited Activities */}
        <Card className="mb-8" data-testid="prohibited-activities">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The following activities are strictly prohibited on our platform:
            </p>
            <ul className="space-y-3">
              {prohibitedActivities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{activity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Service Provider Terms */}
        <Card className="mb-8" data-testid="provider-terms">
          <CardHeader>
            <CardTitle>Additional Terms for Service Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Providers must possess necessary licenses, insurance, and qualifications for their services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>All service delivery and quality is the sole responsibility of the service provider.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Providers must maintain professional conduct and deliver services as described.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>False advertising or misrepresentation of services may result in account termination.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Customer Terms */}
        <Card className="mb-8" data-testid="customer-terms">
          <CardHeader>
            <CardTitle>Additional Terms for Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Job postings must be accurate, legal, and comply with local regulations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Customers are responsible for their own safety when meeting service providers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payment disputes should be resolved directly between customers and providers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Honest and fair reviews help maintain platform quality for all users.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8" data-testid="intellectual-property">
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">
                ServiceConnect and its content, features, and functionality are owned by us and are protected by copyright, 
                trademark, and other intellectual property laws. Users retain ownership of content they post but grant us 
                a license to use, display, and distribute such content on our platform.
              </p>
              <ul className="space-y-2">
                <li><strong>Platform Content:</strong> All text, graphics, logos, and software are our property.</li>
                <li><strong>User Content:</strong> You retain ownership but grant us usage rights for platform operation.</li>
                <li><strong>Third-Party Content:</strong> Respect copyright and intellectual property of others.</li>
                <li><strong>Trademarks:</strong> Do not use our trademarks without prior written permission.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers and Limitations */}
        <Card className="mb-8" data-testid="limitations">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="text-primary" size={24} />
              Disclaimers and Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8" data-testid="termination">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate user accounts for violations of these Terms, illegal activities, 
              or behavior that harms the platform or other users. Upon termination:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Access to the platform will be immediately revoked</li>
              <li>• Outstanding obligations remain in effect</li>
              <li>• User data will be handled according to our Privacy Policy</li>
              <li>• Users may appeal termination decisions through our support channels</li>
            </ul>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8" data-testid="governing-law">
          <CardHeader>
            <CardTitle>Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of India. Any disputes arising from these Terms or use of our platform 
              will be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 2015. 
              The seat of arbitration shall be Bangalore, Karnataka.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8" data-testid="terms-changes">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. When we make significant changes, we will notify users through 
              email or platform notifications. Continued use of our services after changes become effective constitutes 
              acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card data-testid="contact-info">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> legal@serviceconnect.com</p>
              <p><strong>Phone:</strong> +91 80 1234 5678</p>
              <p><strong>Address:</strong><br />
                ServiceConnect Legal Department<br />
                Koramangala, Bangalore<br />
                Karnataka 560095, India
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}