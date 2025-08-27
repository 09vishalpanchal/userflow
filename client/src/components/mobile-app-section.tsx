import { Button } from "@/components/ui/button";

export function MobileAppSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="mobile-app-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-12 text-center text-white" data-testid="mobile-app-card">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-mobile-app-title">Get Our Mobile App</h2>
          <p className="text-xl mb-8 text-white/90" data-testid="text-mobile-app-description">
            Book services on the go and manage your account from anywhere
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-testid="app-store-buttons">
            <Button 
              variant="secondary" 
              className="inline-flex items-center bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              data-testid="button-app-store"
            >
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg">App Store</div>
              </div>
            </Button>
            
            <Button 
              variant="secondary" 
              className="inline-flex items-center bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              data-testid="button-google-play"
            >
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
