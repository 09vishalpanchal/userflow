import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors, Home, Wrench, Settings, Users } from "lucide-react";

const salonServices = [
  {
    id: "waxing",
    title: "Waxing",
    icon: "🧴",
  },
  {
    id: "manicure", 
    title: "Manicure",
    icon: "💅",
  },
  {
    id: "cleanup",
    title: "Cleanup",
    icon: "✨",
  },
  {
    id: "hair-care",
    title: "Hair care", 
    icon: "💇‍♀️",
  }
];

const cleaningServices = [
  {
    id: "bathroom-kitchen",
    title: "Bathroom & kitchen cleaning",
    icon: Home,
  },
  {
    id: "sofa-carpet",
    title: "Sofa & Carpet Cleaning", 
    icon: Home,
  }
];

const applianceServices = [
  {
    id: "ac-repair",
    title: "AC Repair & Service",
    icon: Settings,
  },
  {
    id: "water-purifier",
    title: "Water Purifier",
    icon: Settings,
  },
  {
    id: "washing-machine", 
    title: "Washing Machine",
    icon: Settings,
  },
  {
    id: "refrigerator",
    title: "Refrigerator",
    icon: Settings,
  },
  {
    id: "microwave",
    title: "Microwave", 
    icon: Settings,
  },
  {
    id: "television",
    title: "Television",
    icon: Settings,
  }
];

const massageServices = [
  {
    id: "pain-relief",
    title: "Pain relief",
    icon: "💪",
  },
  {
    id: "post-workout",
    title: "Post workout", 
    icon: "🏃‍♂️",
  },
  {
    id: "stress-relief",
    title: "Stress relief",
    icon: "🧘‍♂️",
  }
];

export function CategorySpecificSections() {
  return (
    <div className="bg-gray-50" data-testid="category-sections">
      {/* Salon for Women */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-salon-title">
            Salon for Women
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="salon-services-grid">
            {salonServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm">{service.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cleaning & pest control */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-cleaning-title">
            Cleaning & pest control
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="cleaning-services-grid">
            {cleaningServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-[2/1] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{service.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Appliance repair & service */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-appliance-title">
              Appliance repair & service
            </h2>
            <span className="text-primary font-medium text-sm cursor-pointer hover:underline">
              See all
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="appliance-services-grid">
            {applianceServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{service.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Massage for Men */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-massage-title">
            Massage for Men
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="massage-services-grid">
            {massageServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-[3/2] bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                    <span className="text-5xl">{service.icon}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{service.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}