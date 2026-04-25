import ProductCard from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/services/productService";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) {
    return (
      <div className="rounded-[30px] border border-dashed border-[#d9c8aa] bg-[rgba(255,253,248,0.75)] p-10 text-center text-[#52606d]">
        No products are available yet. Add products in the database and they will appear here.
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
