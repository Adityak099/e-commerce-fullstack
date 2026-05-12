// src/components/layout/Categories.jsx
"use client";
import Link from "next/link";
import Image from "next/image";

const allCategories = [
  {
    name: "Fruits & Vegetables",
    slug: "fruits",
    image: "/categories/fruits-vegetables.jpg",
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
    image: "/categories/grains.jpg",
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
  { name: "Baby Care", slug: "baby-care", image: "/categories/baby-care.png" },
  { name: "Pet Care", slug: "pet-care", image: "/categories/pet-care.png" },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "/categories/home-kitchen.png",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "/categories/electronics.png",
  },
  { name: "Fashion", slug: "fashion", image: "/categories/fashion.png" },
  { name: "Toys & Games", slug: "toys", image: "/categories/toy.png" },
];

export default function Categories() {
  return (
    <section id="categories" className="py-8 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-2xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center bg-white rounded-xl p-3 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <p className="text-center text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors px-1">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
