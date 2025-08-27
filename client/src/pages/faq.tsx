import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MessageCircle, Users, Shield, CreditCard } from "lucide-react";

export default function FAQ() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);

  const customerFaqs = [
    {
      question: "How do I post a job on ServiceConnect?",
      answer: "Click 'Post a Job', fill in your requirements including title, description, location, and budget. Your job will be visible to verified providers in your area who can then submit bids."
    },
    {
      question: "Is it free to post jobs?",
      answer: "Yes, posting jobs on ServiceConnect is completely free for customers. You only pay the provider directly for their services once you hire them."
    },
    {
      question: "How do I choose the right service provider?",
      answer: "Review provider profiles, ratings, past work examples, and bids. You can also contact providers directly to discuss your requirements before making a decision."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "We have a dispute resolution process. Contact our support team with your concerns, and we'll help mediate between you and the provider to find a fair solution."
    },
    {
      question: "How do I pay the service provider?",
      answer: "Payment is made directly to the service provider. We recommend discussing payment terms upfront and paying after satisfactory completion of work."
    },
    {
      question: "Can I cancel a job after posting?",
      answer: "Yes, you can cancel a job before hiring a provider. However, once you've hired someone and work has begun, cancellation should be discussed directly with the provider."
    },
    {
      question: "How do I rate and review a provider?",
      answer: "After job completion, you'll receive a notification to rate and review the provider. Your feedback helps maintain platform quality and assists other customers."
    },
    {
      question: "What types of services are available?",
      answer: "We offer a wide range of services including home cleaning, plumbing, electrical work, carpentry, beauty services, tutoring, pet care, and much more."
    }
  ];

  const providerFaqs = [
    {
      question: "How do I register as a service provider?",
      answer: "Click 'Join as Provider', create your profile with business details, upload verification documents, and wait for approval from our team. The process typically takes 1-2 business days."
    },
    {
      question: "What documents do I need for verification?",
      answer: "You'll need a valid ID proof (Aadhar/PAN), business registration documents (if applicable), and any relevant certifications or licenses for your services."
    },
    {
      question: "How much does it cost to unlock job details?",
      answer: "Each job unlock costs ₹100. This gives you access to the customer's contact details so you can discuss the job requirements and negotiate terms directly."
    },
    {
      question: "How do I add money to my wallet?",
      answer: "Go to your wallet section and choose from various recharge options. You can add money using UPI, debit/credit cards, or net banking."
    },
    {
      question: "What happens if I unlock a job but don't get hired?",
      answer: "The ₹100 unlock fee is non-refundable as it provides access to customer contact details. However, you can use this opportunity to build relationships for future jobs."
    },
    {
      question: "How do I increase my chances of getting hired?",
      answer: "Maintain a complete profile, showcase your work through photos, respond quickly to jobs, provide competitive pricing, and maintain high ratings through quality work."
    },
    {
      question: "Can I offer services in multiple cities?",
      answer: "Yes, you can set your service radius and operate in multiple locations. Update your profile to reflect all areas where you provide services."
    },
    {
      question: "How do I handle difficult customers?",
      answer: "Always maintain professionalism. If issues arise, try to resolve them directly first. If needed, contact our support team for mediation and guidance."
    }
  ];

  const generalFaqs = [
    {
      question: "How does ServiceConnect ensure safety and trust?",
      answer: "We verify all providers through document checks, maintain a rating system, offer customer support, and have dispute resolution processes in place."
    },
    {
      question: "Is ServiceConnect available in my city?",
      answer: "We're currently active in major Indian cities and expanding rapidly. Check our website or app to see if services are available in your location."
    },
    {
      question: "How do I report a problem or file a complaint?",
      answer: "Contact our customer support through the app, website, or call our helpline. We take all complaints seriously and work to resolve them promptly."
    },
    {
      question: "Can I use ServiceConnect without creating an account?",
      answer: "You can browse jobs and provider profiles, but you need to create an account to post jobs (as customer) or apply for jobs (as provider)."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, ServiceConnect is available on both Android and iOS. Download from Google Play Store or Apple App Store for a better mobile experience."
    },
    {
      question: "How do you handle data privacy and security?",
      answer: "We follow strict data protection guidelines, encrypt sensitive information, and never share your personal details without consent. Read our Privacy Policy for details."
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="faq-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="page-description">
            Find answers to common questions about using ServiceConnect
          </p>
        </div>

        {/* FAQ Categories */}
        <Tabs defaultValue="customers" className="max-w-4xl mx-auto" data-testid="faq-tabs">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-list">
            <TabsTrigger value="customers" data-testid="tab-customers">
              <Users size={16} className="mr-2" />
              For Customers
            </TabsTrigger>
            <TabsTrigger value="providers" data-testid="tab-providers">
              <Shield size={16} className="mr-2" />
              For Providers
            </TabsTrigger>
            <TabsTrigger value="general" data-testid="tab-general">
              <MessageCircle size={16} className="mr-2" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Customer FAQs */}
          <TabsContent value="customers" data-testid="tab-content-customers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Customer Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" data-testid="customer-accordion">
                  {customerFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`customer-${index}`} data-testid={`customer-faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Provider FAQs */}
          <TabsContent value="providers" data-testid="tab-content-providers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} />
                  Provider Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" data-testid="provider-accordion">
                  {providerFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`provider-${index}`} data-testid={`provider-faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General FAQs */}
          <TabsContent value="general" data-testid="tab-content-general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  General Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" data-testid="general-accordion">
                  {generalFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`general-${index}`} data-testid={`general-faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Still Have Questions */}
        <section className="mt-16">
          <Card className="text-center" data-testid="contact-section">
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setLocation("/contact")} data-testid="contact-us">
                  Contact Support
                </Button>
                <Button variant="outline" data-testid="help-chat">
                  <MessageCircle size={16} className="mr-2" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Popular Help Topics */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="help-topics-title">
            Popular Help Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <CreditCard size={20} />, title: "Payment Issues", link: "#" },
              { icon: <Shield size={20} />, title: "Account Verification", link: "#" },
              { icon: <Users size={20} />, title: "Profile Management", link: "#" },
              { icon: <MessageCircle size={20} />, title: "Communication", link: "#" }
            ].map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                data-testid={`help-topic-${index}`}
              >
                <div className="text-primary">{topic.icon}</div>
                <span className="text-sm">{topic.title}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}