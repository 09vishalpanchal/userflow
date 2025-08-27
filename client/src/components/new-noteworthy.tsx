import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Wrench, Scissors, Laptop, Paintbrush, Zap } from "lucide-react";

const newServices = [
  {
    id: "1",
    title: "Smart Home Installation",
    category: "Tech Support",
    icon: Laptop,
    isNew: true,
  },
  {
    id: "2", 
    title: "Bathroom & kitchen cleaning",
    category: "Home Cleaning",
    icon: Home,
    isNew: false,
  },
  {
    id: "3",
    title: "Painting & Waterproofing", 
    category: "Painting",
    icon: Paintbrush,
    isNew: false,
  },
  {
    id: "4",
    title: "Laptop repair & service",
    category: "Tech Support", 
    icon: Laptop,
    isNew: false,
  },
  {
    id: "5",
    title: "Hair Studio for Women",
    category: "Beauty & Spa",
    icon: Scissors,
    isNew: false,
  },
  {
    id: "6", 
    title: "Electrical work & repair",
    category: "Electrical Work",
    icon: Zap,
    isNew: false,
  }
];

export function NewNoteworthy() {
  return (
    <section className="py-12 bg-white" data-testid="new-noteworthy-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-new-noteworthy-title">
            New and noteworthy
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="new-noteworthy-grid">
          {newServices.map((service) => {
            const IconComponent = service.icon;
            
            return (
              <Card 
                key={service.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                data-testid={`new-service-${service.id}`}
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center">
                    {service.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-xs">
                        NEW
                      </Badge>
                    )}
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}