import { Button } from "@/components/ui/button";
import { Home, Wrench, Scissors, Car, Laptop, Paintbrush } from "lucide-react";

const categories = [
  { icon: Home, name: "Home Cleaning", id: "home-cleaning" },
  { icon: Wrench, name: "Repairs", id: "repairs" },
  { icon: Scissors, name: "Beauty & Spa", id: "beauty-spa" },
  { icon: Car, name: "Auto Services", id: "auto-services" },
  { icon: Laptop, name: "Tech Support", id: "tech-support" },
  { icon: Paintbrush, name: "Painting", id: "painting" },
];

export function ServiceCategories() {
  return (
    <section id="services" className="py-20 bg-muted/30" data-testid="service-categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-categories-title">Popular Service Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-categories-description">
            Discover thousands of trusted professionals ready to help with your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" data-testid="categories-grid">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id}
                className="service-category bg-card hover:bg-primary group rounded-xl p-6 text-center cursor-pointer transition-all duration-300 card-hover"
                data-testid={`category-${category.id}`}
              >
                <div className="w-12 h-12 mx-auto mb-4 text-primary group-hover:text-white text-2xl flex items-center justify-center">
                  <IconComponent size={24} />
                </div>
                <h3 className="font-semibold text-card-foreground group-hover:text-white" data-testid={`text-${category.id}`}>
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors" data-testid="button-view-all-categories">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}
