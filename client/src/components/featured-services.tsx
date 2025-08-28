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
    <section className="py-20 bg-gradient-to-r from-purple-50 via-white to-pink-50" data-testid="featured-services-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🔥 Trending Now
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-featured-title">
            Most Booked Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of satisfied customers who chose these popular services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-services-grid">
          {featuredServices.map((service) => (
            <Card 
              key={service.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-3 hover:scale-[1.02] bg-white border-0 shadow-md"
              data-testid={`service-${service.id}`}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-500">
                {service.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    {service.discount}
                  </Badge>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:rotate-12 transition-transform duration-300"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
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