"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatSlug = (str) => {
    if (!str) return "";
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");

        // Handle different response structures gracefully to ensure we always get an array of products to work with regardless of how the backend formats its response (especially if it wraps data in a 'data' field or uses a 'products' field).
        const allProducts = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
            ? response.data.data
            : response.data.products || [];

        // Filter products by category, ignoring case and handling potential formatting differences
        const filtered = allProducts.filter(
          (p) => p.category.toLowerCase() === slug.toLowerCase(),
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAndFilterProducts();
  }, [slug]);

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-green-600 font-semibold">
        Loading FreshMart {formatSlug(slug)}...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {formatSlug(slug)}
          </h1>
          <p className="text-gray-500 mt-1">Found {products.length} items</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">
            No products found in the &quot;{formatSlug(slug)}&quot; category.
          </p>
        </div>
      )}
    </div>
  );
}
