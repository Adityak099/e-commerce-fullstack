"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import Container from "@/components/ui/Container";

// Matches the categories in the sidebar of image_0112d8.jpg
const SIDEBAR_CATEGORIES = [
  { name: "Fresh Vegetables", slug: "vegetables", icon: "🥦" },
  { name: "Fresh Fruits", slug: "fruits", icon: "🍎" },
  { name: "Dairy & Bread", slug: "dairy", icon: "🥛" },
  { name: "Beverages", slug: "beverages", icon: "🥤" },
  { name: "Snacks", slug: "snacks", icon: "🍿" },
  { name: "Exotics", slug: "exotics", icon: "🍍" }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("vegetables");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/products?category=${selectedCategory}`);
        setProducts(res.data.data || []);
      } catch (error) {
        setError("Products are temporarily unavailable right now.");
        console.error("Filter failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory]);

  return (
    <main className="flex h-screen overflow-hidden bg-white">
      <div className="w-24 md:w-32 flex-none border-r overflow-y-auto no-scrollbar py-4">
        {SIDEBAR_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`w-full flex flex-col items-center py-4 px-1 mb-2 transition-all border-r-4 ${
              selectedCategory === cat.slug 
              ? "bg-green-50 border-green-600 text-green-700" 
              : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="text-2xl mb-1 bg-gray-100 p-2 rounded-full">{cat.icon}</div>
            <span className="text-[10px] md:text-xs font-semibold text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      <section className="flex-1 overflow-y-auto bg-gray-50 py-4">
        <Container>
          <header className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Buy {selectedCategory} Online</h2>
          </header>

          {error ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-20 text-center font-semibold text-green-600">
              Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
