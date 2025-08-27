import { Link } from "wouter";

export function Footer() {
  const customerLinks = [
    { href: "/jobs/list", label: "Browse Services" },
    { href: "/customer/post-job", label: "Post a Job" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Customer Support" },
  ];

  const providerLinks = [
    { href: "/join-as-provider", label: "Join as Provider" },
    { href: "/provider/dashboard", label: "Provider Dashboard" },
    { href: "/blog", label: "Resources" },
    { href: "/faq", label: "Provider Support" },
  ];

  const companyLinks = [
    { href: "/about-us", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Support" },
  ];

  return (
    <footer className="bg-card border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div data-testid="footer-brand">
            <h3 className="text-2xl font-bold text-primary mb-4" data-testid="text-brand-name">ServiceConnect</h3>
            <p className="text-muted-foreground mb-4" data-testid="text-brand-description">
              Connecting customers with trusted local service providers.
            </p>
            <div className="flex space-x-4" data-testid="social-links">
              <a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-facebook">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-twitter">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div data-testid="footer-customers">
            <h4 className="font-semibold mb-4" data-testid="text-customers-title">For Customers</h4>
            <ul className="space-y-2 text-muted-foreground">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-primary" data-testid={`link-customer-${index}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div data-testid="footer-providers">
            <h4 className="font-semibold mb-4" data-testid="text-providers-title">For Providers</h4>
            <ul className="space-y-2 text-muted-foreground">
              {providerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-primary" data-testid={`link-provider-${index}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div data-testid="footer-company">
            <h4 className="font-semibold mb-4" data-testid="text-company-title">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-primary" data-testid={`link-company-${index}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8" data-testid="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm" data-testid="text-copyright">
              © 2024 ServiceConnect. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0" data-testid="legal-links">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href} className="hover:text-primary" data-testid={`link-legal-${index}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
