export function HowItWorks() {
  const customerSteps = [
    {
      number: 1,
      title: "Register with Phone",
      description: "Sign up using your phone number and verify with OTP for secure access."
    },
    {
      number: 2,
      title: "Complete Your Profile",
      description: "Add your name, email, and location for personalized service recommendations."
    },
    {
      number: 3,
      title: "Book Services",
      description: "Browse and book verified service providers in your area with transparent pricing."
    },
    {
      number: 4,
      title: "Track & Review",
      description: "Monitor your booking status and leave reviews to help other customers."
    }
  ];

  const providerSteps = [
    {
      number: 1,
      title: "Register & Verify",
      description: "Sign up with phone verification and submit business documents for approval."
    },
    {
      number: 2,
      title: "Create Your Profile",
      description: "Add business details, service areas, pricing, and showcase your expertise."
    },
    {
      number: 3,
      title: "Receive Bookings",
      description: "Get notified about new service requests and communicate with customers."
    },
    {
      number: 4,
      title: "Grow Your Business",
      description: "Build your reputation through reviews and expand your customer base."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-it-works-title">How It Works</h2>
          <p className="text-lg text-muted-foreground" data-testid="text-how-it-works-description">Simple steps to connect with the right professionals</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* For Customers */}
          <div data-testid="customer-steps">
            <h3 className="text-2xl font-bold mb-8 text-center" data-testid="text-customer-steps-title">For Customers</h3>
            <div className="space-y-8">
              {customerSteps.map((step) => (
                <div key={step.number} className="flex items-start" data-testid={`customer-step-${step.number}`}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold" data-testid={`step-number-${step.number}`}>
                      {step.number}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2" data-testid={`step-title-${step.number}`}>{step.title}</h4>
                    <p className="text-muted-foreground" data-testid={`step-description-${step.number}`}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Service Providers */}
          <div data-testid="provider-steps">
            <h3 className="text-2xl font-bold mb-8 text-center" data-testid="text-provider-steps-title">For Service Providers</h3>
            <div className="space-y-8">
              {providerSteps.map((step) => (
                <div key={step.number} className="flex items-start" data-testid={`provider-step-${step.number}`}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold" data-testid={`provider-step-number-${step.number}`}>
                      {step.number}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2" data-testid={`provider-step-title-${step.number}`}>{step.title}</h4>
                    <p className="text-muted-foreground" data-testid={`provider-step-description-${step.number}`}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
