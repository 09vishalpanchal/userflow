import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Wrench, 
  Scissors, 
  Car, 
  Laptop, 
  Paintbrush, 
  Sparkles,
  Zap,
  Settings,
  Users,
  Car as CarIcon,
  BookOpen,
  Heart,
  Camera,
  UtensilsCrossed,
  PawPrint
} from "lucide-react";

const iconMap: { [key: string]: any } = {
  "Home Cleaning": Home,
  "Plumbing": Wrench,
  "Electrical Work": Zap,
  "Carpentry": Settings,
  "Painting": Paintbrush,
  "HVAC": Settings,
  "Appliance Repair": Laptop,
  "Gardening": Sparkles,
  "Beauty & Spa": Scissors,
  "Auto Services": Car,
  "Tech Support": Laptop,
  "Tutoring": BookOpen,
  "Pet Care": PawPrint,
  "Moving Services": Users,
  "Photography": Camera,
  "Catering": UtensilsCrossed,
  "Other": Settings,
};

export function ServiceCategories() {
  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    enabled: true,
  });

  const categories = (categoriesData as any)?.categories || [];

  return (
    <section className="py-8 bg-white" data-testid="service-categories-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-testid="categories-grid">
          {categories.slice(0, 8).map((category: string) => {
            const IconComponent = iconMap[category] || Settings;
            const categoryId = category.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <div 
                key={categoryId}
                className="flex flex-col items-center p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                data-testid={`category-${categoryId}`}
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <IconComponent className="w-7 h-7 text-gray-600 group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
