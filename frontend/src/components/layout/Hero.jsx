// src/components/layout/Hero.jsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Free delivery on orders above ₹99
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Get fresh groceries delivered in{" "}
              <span className="text-primary">10 minutes</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Quality fruits, vegetables, dairy, and more at the best prices.
              Delivered fast to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-border hover:border-primary hover:text-primary font-semibold rounded-2xl transition-all"
              >
                Browse Categories
              </Link>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  4.9/5 Rating
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">50K+</span> Happy
                Customers
              </div>
            </div>
          </div>

          {/* Right Side Grid - Fixed Height */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl rotate-6" />

              <div className="relative bg-card rounded-3xl p-5 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src="/hero/vegetables.jpg"
                      alt="Fresh Vegetables"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src="/hero/fruits.jpg"
                      alt="Fresh Fruits"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src="/hero/dairy.jpg"
                      alt="Dairy Products"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src="/hero/spices.jpg"
                      alt="Indian Groceries & Spices"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
