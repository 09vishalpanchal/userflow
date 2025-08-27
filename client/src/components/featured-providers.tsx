import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

const featuredProviders = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    service: "Professional Cleaning",
    rating: 4.9,
    description: "5+ years experience in residential and commercial cleaning. Eco-friendly products used.",
    location: "Downtown Area",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    service: "Licensed Electrician",
    rating: 4.8,
    description: "Licensed electrician with 10+ years experience. Emergency repairs and installations.",
    location: "North Side",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    service: "Hair Stylist",
    rating: 5.0,
    description: "Expert in modern cuts, color, and styling. Mobile service available for special events.",
    location: "Westside",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
  }
];

export function FeaturedProviders() {
  return (
    <section id="providers" className="py-20 bg-muted/30" data-testid="featured-providers-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-providers-title">Featured Service Providers</h2>
          <p className="text-lg text-muted-foreground" data-testid="text-providers-description">Meet some of our top-rated professionals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8" data-testid="providers-grid">
          {featuredProviders.map((provider) => (
            <div key={provider.id} className="bg-card rounded-xl overflow-hidden shadow-sm card-hover" data-testid={`card-provider-${provider.id}`}>
              <img 
                src={provider.image} 
                alt={`${provider.name} - ${provider.service}`} 
                className="w-full h-48 object-cover"
                data-testid={`img-provider-${provider.id}`}
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid={`text-name-${provider.id}`}>{provider.name}</h3>
                    <p className="text-muted-foreground" data-testid={`text-service-${provider.id}`}>{provider.service}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 font-semibold" data-testid={`text-rating-${provider.id}`}>{provider.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4" data-testid={`text-description-${provider.id}`}>
                  {provider.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    <MapPin className="inline mr-1" size={14} />
                    <span data-testid={`text-location-${provider.id}`}>{provider.location}</span>
                  </span>
                  <Button size="sm" data-testid={`button-view-profile-${provider.id}`}>
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors" data-testid="button-view-all-providers">
            View All Providers
          </Button>
        </div>
      </div>
    </section>
  );
}
