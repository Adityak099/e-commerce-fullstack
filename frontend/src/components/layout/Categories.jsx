// src/components/layout/Categories.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const allCategories = [
  {
    name: "Fruits & Vegetables",
    slug: "fruits",
    image: "/categories/vegetables.jpg",
  },
  {
    name: "Dairy, Bread & Eggs",
    slug: "dairy",
    image: "/categories/dairy.jpg",
  },
  {
    name: "Cold Drinks & Juices",
    slug: "beverages",
    image: "/categories/drinks.jpg",
  },
  {
    name: "Snacks & Munchies",
    slug: "snacks",
    image: "/categories/snacks.jpg",
  },
  {
    name: "Bakery & Biscuits",
    slug: "bakery",
    image: "/categories/bakery.jpg",
  },
  {
    name: "Atta, Rice & Dal",
    slug: "grains",
    image: "/categories/atta-rice.jpg",
  },
  {
    name: "Masala, Oil & More",
    slug: "spices",
    image: "/categories/spices.jpg",
  },
  {
    name: "Cleaning Essentials",
    slug: "cleaning",
    image: "/categories/cleaning.jpg",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    image: "/categories/personal-care.jpg",
  },
  { name: "Baby Care", slug: "baby-care", image: "/categories/baby-care.jpg" },
  { name: "Pet Care", slug: "pet-care", image: "/categories/pet-care.jpg" },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "/categories/home-kitchen.jpg",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "/categories/electronics.jpg",
  },
  { name: "Fashion", slug: "fashion", image: "/categories/fashion.jpg" },
  { name: "Toys & Games", slug: "toys", image: "/categories/toys.jpg" },
];

export default function Categories() {
  const [showAll, setShowAll] = useState(false);

  // Show only first 10 categories initially
  const displayedCategories = showAll
    ? allCategories
    : allCategories.slice(0, 10);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 px-1">
          <h2 className="text-2xl font-bold text-foreground">
            Shop by Category
          </h2>
          {!showAll && allCategories.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all hover:scale-105"
            >
              See All →
            </button>
          )}
        </div>

        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 transition-all duration-500 ease-in-out ${
            showAll ? "xl:grid-cols-6" : ""
          }`}
        >
          {displayedCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <p className="text-center text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors px-1">
                {category.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Show "Show Less" button when expanded */}
        {showAll && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:scale-105"
            >
              Show Less ↑
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
