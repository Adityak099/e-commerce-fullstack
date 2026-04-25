import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/productService";

export default async function ProductPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] bg-[#1f3c88] px-8 py-10 text-white shadow-[0_24px_65px_rgba(31,60,136,0.22)] sm:px-10">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d8e3ff]">Product listing</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold">Fresh picks from your database</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#dbe5ff]">
          This page now fetches products dynamically from the backend instead of relying on placeholders.
        </p>
      </section>

      <section className="mt-10">
        {products.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[#d9c8aa] bg-[rgba(255,253,248,0.75)] p-12 text-center text-[#52606d]">
            No products found in the database yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
