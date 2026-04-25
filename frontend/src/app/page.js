"use client";

import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Truck,
  Shield,
  Clock,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import AddToCartButton from "@/components/product/AddToCartButton";

const categories = [
  {
    name: "Fruits & Vegetables",
    image: "/categories/Demo-Image.svg",
    slug: "fruits",
  },
  {
    name: "Dairy, Bread & Eggs",
    image: "/categories/Demo-Image.svg",
    slug: "dairy",
  },
  {
    name: "Cold Drinks & Juices",
    image: "/categories/Demo-Image.svg",
    slug: "beverages",
  },
  {
    name: "Snacks & Munchies",
    image: "/categories/Demo-Image.svg",
    slug: "snacks",
  },
  {
    name: "Bakery & Biscuits",
    image: "/categories/Demo-Image.svg",
    slug: "bakery",
  },
  {
    name: "Atta, Rice & Dal",
    image: "/categories/Demo-Image.svg",
    slug: "grains",
  },
  {
    name: "Masala, Oil & More",
    image: "/categories/Demo-Image.svg",
    slug: "spices",
  },
  {
    name: "Cleaning Essentials",
    image: "/categories/Demo-Image.svg",
    slug: "cleaning",
  },
  {
    name: "Personal Care",
    image: "/categories/Demo-Image.svg",
    slug: "personal-care",
  },
  { name: "Baby Care", image: "/categories/Demo-Image.svg", slug: "baby-care" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const normalizeProduct = (product) => ({
  id: product._id || product.id || product.slug,
  slug: product.slug,
  name: product.name,
  category: product.category || "General",
  description: product.description || "Fresh grocery item",
  price: Number(product.price || 0),
  stock: Number(product.inventory?.stock ?? product.stock ?? 0),
  image: "/categories/Demo-Image.svg",
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        const rawProducts = Array.isArray(data) ? data : data?.data || [];
        setProducts(rawProducts.slice(0, 8).map(normalizeProduct));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Modern Gradient */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Free delivery on orders above Rs 99
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                Get your groceries delivered in
                <span className="text-primary"> 10 minutes</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Fresh fruits, vegetables, dairy, and more. Quality products at
                the best prices, delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-card border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    4.9/5 Rating
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">50K+</span> Happy
                  Customers
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">10K+</span>{" "}
                  Products
                </div>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl rotate-6" />
                <div className="relative bg-card rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-category-bg rounded-2xl p-4 flex items-center justify-center aspect-square">
                      <Image
                        src="/categories/Demo-Image.svg"
                        alt="Fresh Produce"
                        width={120}
                        height={120}
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="bg-category-bg rounded-2xl p-4 flex items-center justify-center aspect-square">
                      <Image
                        src="/categories/Demo-Image.svg"
                        alt="Dairy"
                        width={120}
                        height={120}
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="bg-category-bg rounded-2xl p-4 flex items-center justify-center aspect-square">
                      <Image
                        src="/categories/Demo-Image.svg"
                        alt="Bakery"
                        width={120}
                        height={120}
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="bg-category-bg rounded-2xl p-4 flex items-center justify-center aspect-square">
                      <Image
                        src="/categories/Demo-Image.svg"
                        alt="Beverages"
                        width={120}
                        height={120}
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category - Grid like reference image */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our wide range of categories and find everything you need
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center"
              >
                <div className="w-full aspect-square bg-category-bg rounded-2xl p-3 md:p-4 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-1 group-hover:bg-secondary overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={140}
                    height={140}
                    className="object-cover rounded-xl w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-sm md:text-base font-medium text-foreground text-center group-hover:text-primary transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                10 Min Delivery
              </h3>
              <p className="text-sm text-muted-foreground">
                Get your order delivered in just 10 minutes
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Fresh Products
              </h3>
              <p className="text-sm text-muted-foreground">
                Farm fresh produce sourced daily
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Free Delivery
              </h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders above Rs 99
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Best Prices
              </h3>
              <p className="text-sm text-muted-foreground">
                Competitive prices on all products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Best Sellers
                </h2>
                <p className="text-muted-foreground">
                  Most popular products this week
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
              >
                View All
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-background border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all group"
                >
                  <div className="h-40 md:h-48 bg-category-bg flex items-center justify-center p-4 relative overflow-hidden">
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-lg">
                        {product.discount}% OFF
                      </span>
                    )}
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">
                        {getCategoryEmoji(product.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price}
                      </span>
                      <div className="min-w-30">
                        <AddToCartButton
                          product={product}
                          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* App Download CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-primary to-primary/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Download our app
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-6 max-w-md">
                Get exclusive offers, track your orders in real-time, and enjoy
                a seamless shopping experience.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-all">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-all">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-64 h-64 bg-primary-foreground/10 rounded-3xl flex items-center justify-center">
                <div className="text-primary-foreground text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-semibold">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-xl mb-4">FreshMart</h4>
              <p className="text-sm opacity-75 mb-4">
                Your trusted source for fresh groceries delivered in minutes.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link
                    href="/products"
                    className="hover:opacity-100 transition-opacity"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=fruits"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Fruits & Vegetables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=dairy"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Dairy & Eggs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=snacks"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Snacks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2024 FreshMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function getCategoryEmoji(category) {
  const emojis = {
    Fruits: "🍎",
    Vegetables: "🥬",
    Dairy: "🥛",
    Grains: "🌾",
    Spices: "🌶️",
    Beverages: "🧃",
    Snacks: "🍪",
    Bakery: "🥖",
  };
  return emojis[category] || "🛒";
}
