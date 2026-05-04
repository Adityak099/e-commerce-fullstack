// src/app/page.js
"use client";

import Hero from "@/components/layout/Hero";
import Categories from "@/components/layout/Categories";
import Features from "@/components/layout/Features";
import BestSellers from "@/components/layout/BestSellers";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <Features />
      <BestSellers />
    </main>
  );
}