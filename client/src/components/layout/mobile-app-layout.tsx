import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Search, 
  Briefcase, 
  User, 
  Plus,
  MessageCircle,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MobileAppLayoutProps {
  children: React.ReactNode;
  user?: any;
  onAuthRequired?: () => void;
}

export function MobileAppLayout({ children, user, onAuthRequired }: MobileAppLayoutProps) {
  const [location] = useLocation();
  
  const bottomNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse-jobs", label: "Search", icon: Search },
    { href: "/post-job", label: "Post", icon: Plus, authRequired: true },
    { href: "/messages", label: "Messages", icon: MessageCircle, authRequired: true, badge: 0 },
    { href: user ? (user.userType === 'customer' ? '/customer/dashboard' : user.userType === 'provider' ? '/provider/dashboard' : '/admin/dashboard') : '/profile', label: "Profile", icon: User },
  ];

  const handleNavClick = (item: any) => {
    if (item.authRequired && !user) {
      onAuthRequired?.();
      return;
    }
    // Navigation will be handled by Link component
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Header - Mobile Sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JC</span>
            </div>
            <span className="font-bold text-lg text-primary">JC Bid</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 border-white">
                    3
                  </Badge>
                </Button>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
              </>
            ) : (
              <Button size="sm" onClick={onAuthRequired}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={index}
                href={item.href}
                className="flex"
                onClick={() => handleNavClick(item)}
              >
                <button
                  className={`flex-1 flex flex-col items-center justify-center space-y-1 transition-colors ${
                    active 
                      ? 'text-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  data-testid={`bottom-nav-${item.label.toLowerCase()}`}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-4 h-4 text-xs bg-red-500 border-white p-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}