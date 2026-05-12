//src/app/category/[slug]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getProducts } from "@/services/product.Service";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatSlug = (str) => {
    if (!str) return "";
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const normalizeCategory = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const allProducts = await getProducts();
        const filtered = allProducts.filter(
          (product) =>
            normalizeCategory(product.category) === slug.toLowerCase(),
        );

        setProducts(filtered);
      } catch (error) {
        setError("Products are temporarily unavailable right now.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAndFilterProducts();
  }, [slug]);

  if (loading)
    return (
      <main className="py-20">
        <Container className="text-center animate-pulse text-green-600 font-semibold">
          Loading FreshMart {formatSlug(slug)}...
        </Container>
      </main>
    );

  return (
    <main className="py-8">
      <Container>
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          className="mb-6 gap-2 text-gray-500 hover:text-green-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {formatSlug(slug)}
            </h1>
            <p className="text-gray-500 mt-1">Found {products.length} items</p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
            <p className="text-gray-500">
              No products found in the &quot;{formatSlug(slug)}&quot; category.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
