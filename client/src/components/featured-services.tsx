import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  duration: string;
  discount?: string;
  image?: string;
}

// Mock featured services data (in real app, this would come from API)
const featuredServices: Service[] = [
  {
    id: "1",
    title: "Deep house cleaning",
    category: "Home Cleaning",
    description: "Complete deep cleaning of your entire home including all rooms, kitchen, and bathrooms",
    price: "₹899",
    rating: 4.8,
    reviewCount: 2500,
    duration: "3-4 hours",
  },
  {
    id: "2", 
    title: "AC service & repair",
    category: "AC & Appliance Repair",
    description: "Professional AC cleaning, gas filling, and repair services by certified technicians",
    price: "₹449",
    rating: 4.7,
    reviewCount: 1800,
    duration: "1-2 hours",
    discount: "20% off",
  },
  {
    id: "3",
    title: "Women's salon at home",
    category: "Beauty & Spa", 
    description: "Professional salon services including facial, waxing, manicure, and pedicure at home",
    price: "₹699",
    rating: 4.9,
    reviewCount: 950,
    duration: "2-3 hours",
  },
  {
    id: "4",
    title: "Plumbing repair",
    category: "Plumbing",
    description: "Expert plumber for tap repair, leak fixing, pipe installation, and bathroom fittings",
    price: "₹199",
    rating: 4.6,
    reviewCount: 3200,
    duration: "1 hour",
  },
  {
    id: "5",
    title: "Electrical work",
    category: "Electrical Work",
    description: "Licensed electrician for wiring, switch repair, fan installation, and electrical troubleshooting", 
    price: "₹249",
    rating: 4.8,
    reviewCount: 1200,
    duration: "1-2 hours",
  },
  {
    id: "6",
    title: "Massage for men",
    category: "Beauty & Spa",
    description: "Relaxing full body massage therapy for stress relief and muscle relaxation at home",
    price: "₹1299",
    rating: 4.7,
    reviewCount: 800,
    duration: "60 minutes",
  }
];

export function FeaturedServices() {
  return (
    <section className="py-12 bg-gray-50" data-testid="featured-services-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-featured-title">
            Most booked services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-services-grid">
          {featuredServices.map((service) => (
            <Card 
              key={service.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              data-testid={`service-${service.id}`}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative">
                {service.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    {service.discount}
                  </Badge>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <div className="w-8 h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {service.rating}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      {service.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({service.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}