import { Button } from "@/components/ui/button";
import { Smartphone, Download, Star, Users } from "lucide-react";
import mobileAppImage from "@assets/generated_images/Mobile_app_interface_mockup_68f73536.png";

export function MobileAppSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50" data-testid="mobile-app-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4 mr-2" />
              Now Available on Mobile
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="text-mobile-app-title">
              Book Services <span className="text-blue-600">On The Go</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg" data-testid="text-mobile-app-description">
              Download our mobile app for instant booking, real-time tracking, and seamless payment experience. Available on iOS and Android.
            </p>

            {/* App Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Instant Service Booking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Real-time Service Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">24/7 Customer Support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4" data-testid="app-store-buttons">
              <Button 
                className="inline-flex items-center bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                data-testid="button-app-store"
              >
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-lg">App Store</div>
                </div>
              </Button>
              
              <Button 
                className="inline-flex items-center bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                data-testid="button-google-play"
              >
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="text-lg">Google Play</div>
                </div>
              </Button>
            </div>

            {/* App Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">App Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9⭐</div>
                <div className="text-sm text-gray-600">App Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Mobile App Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={mobileAppImage}
                alt="Mobile app interface"
                className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 opacity-10"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
