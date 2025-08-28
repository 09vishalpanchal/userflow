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
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50" data-testid="new-noteworthy-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            ⭐ Latest Additions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-new-noteworthy-title">
            New & Noteworthy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover our newest services and popular offerings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="new-noteworthy-grid">
          {newServices.map((service) => {
            const IconComponent = service.icon;
            
            return (
              <Card 
                key={service.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-4 hover:scale-105 bg-white border-0 shadow-lg hover:rotate-1"
                data-testid={`new-service-${service.id}`}
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 relative flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-500">
                    {service.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-xs">
                        NEW
                      </Badge>
                    )}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-green-600 group-hover:text-purple-600 transition-colors duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-t-lg"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-green-600 transition-colors duration-300">
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