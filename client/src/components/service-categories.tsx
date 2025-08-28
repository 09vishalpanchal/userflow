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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50" data-testid="service-categories-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Professional services for all your home and personal needs</p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-testid="categories-grid">
          {categories.slice(0, 8).map((category: string) => {
            const IconComponent = iconMap[category] || Settings;
            const categoryId = category.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <div 
                key={categoryId}
                className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-105 border border-gray-100"
                data-testid={`category-${categoryId}`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4 group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 group-hover:rotate-6">
                  <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors duration-300">
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
