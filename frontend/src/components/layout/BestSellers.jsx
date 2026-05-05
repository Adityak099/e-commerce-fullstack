// src/components/layout/BestSellers.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AddToCartButton from "../product/AddToCartButton";
import { getFeaturedProducts } from "@/services/product.Service";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts(8);
        setProducts(featuredProducts);
      } catch (err) {
        setError("Products are temporarily unavailable. Please check your backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Best Sellers</h2>
            <p className="text-muted-foreground mt-1">Most popular products this week</p>
          </div>
          <Link
            href="/products"
            className="mt-4 sm:mt-0 flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center mb-10">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-background rounded-3xl h-[380px] animate-pulse" />
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="bg-background border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="h-52 bg-muted flex items-center justify-center p-6">
                    <Image
                      src={product.image || "/categories/Demo-Image.svg"}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="object-contain"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-primary font-medium">
                      {product.category}
                    </p>
                    <h3 className="font-semibold mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center mt-5">
                      <span className="text-2xl font-bold">₹{product.price}</span>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
