import { Star } from "lucide-react";

const testimonials = [
  {
    id: "jessica",
    content: "Found an amazing house cleaner through ServiceConnect. The booking process was so easy and the service was exceptional. Highly recommend!",
    name: "Jessica Thompson",
    location: "Phoenix, AZ",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "david",
    content: "As a service provider, this platform has helped me grow my plumbing business significantly. Great customer support!",
    name: "David Chen",
    location: "Licensed Plumber",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "robert",
    content: "Love how easy it is to find reliable contractors. The review system gives me confidence in who I'm hiring.",
    name: "Robert Martinez",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground" data-testid="text-testimonials-description">Real reviews from satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8" data-testid="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card rounded-xl p-8 shadow-sm card-hover" data-testid={`card-testimonial-${testimonial.id}`}>
              <div className="flex mb-4" data-testid={`stars-${testimonial.id}`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={16} />
                ))}
              </div>
              <p className="text-card-foreground mb-6" data-testid={`text-content-${testimonial.id}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                  data-testid={`img-avatar-${testimonial.id}`}
                />
                <div>
                  <h4 className="font-semibold" data-testid={`text-name-${testimonial.id}`}>{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm" data-testid={`text-location-${testimonial.id}`}>{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
