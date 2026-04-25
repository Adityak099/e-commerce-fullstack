import { notFound } from "next/navigation";
import ProductView from "@/components/product/ProductView";
import { getProductById } from "@/services/productService";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProductView product={product} />
    </main>
  );
}
