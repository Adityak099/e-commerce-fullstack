// src/components/layout/Features.jsx
import { Clock, Leaf, Truck, Shield } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "10 Min Delivery",
    desc: "Lightning fast delivery to your doorstep",
  },
  {
    icon: Leaf,
    title: "Farm Fresh",
    desc: "Sourced daily from local farms",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On all orders above ₹99",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    desc: "100% safe payment & packaging",
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border p-8 rounded-3xl text-center hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}