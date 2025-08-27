import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    console.log("Contact form data:", data);
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    form.reset();
  };

  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={20} />,
      title: "Email Us",
      details: ["support@serviceconnect.com", "business@serviceconnect.com"],
      description: "Get in touch via email for general inquiries"
    },
    {
      icon: <Phone className="text-primary" size={20} />,
      title: "Call Us", 
      details: ["+91 80 1234 5678", "+91 80 8765 4321"],
      description: "Speak with our support team directly"
    },
    {
      icon: <MapPin className="text-primary" size={20} />,
      title: "Visit Us",
      details: ["Koramangala", "Bangalore, Karnataka 560095"],
      description: "Our office is open for meetings by appointment"
    },
    {
      icon: <Clock className="text-primary" size={20} />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "We're here to help during business hours"
    }
  ];

  const faqs = [
    {
      question: "How do I post a job?",
      answer: "Simply click 'Post a Job', fill in the details, and our verified providers will start bidding on your project."
    },
    {
      question: "How do I become a service provider?",
      answer: "Register as a provider, complete your profile with business details, and get verified by our team."
    },
    {
      question: "What is the cost to unlock job details?",
      answer: "Providers pay ₹100 to unlock customer contact details for each job they're interested in."
    },
    {
      question: "How do you ensure provider quality?",
      answer: "We verify all providers through document checks, background verification, and maintain a rating system."
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="contact-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="page-description">
            Have questions about our platform? Need help with your account? We're here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card data-testid="contact-form">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-contact">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} data-testid="input-subject" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help you..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" data-testid="button-send">
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} data-testid={`contact-info-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {info.icon}
                      {info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {info.details.map((detail, i) => (
                        <p key={i} className="font-semibold">{detail}</p>
                      ))}
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick FAQ */}
            <Card data-testid="quick-faq">
              <CardHeader>
                <CardTitle>Quick Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} data-testid={`faq-${index}`}>
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="link" 
                  className="w-full mt-4 p-0"
                  onClick={() => setLocation("/faq")}
                  data-testid="view-all-faq"
                >
                  View All FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <Card data-testid="map-section">
            <CardHeader>
              <CardTitle className="text-center">Find Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map would be embedded here<br />
                    Koramangala, Bangalore, Karnataka 560095
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}