import Link from "next/link";
import AddToCartButton from "@/components/product/AddToCartButton";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-white/70 bg-[rgba(255,253,248,0.88)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/4.3] overflow-hidden bg-[#f3ead8]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#8b5e3c]">{product.category}</p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-2 text-xl font-semibold text-[#1f2937]">{product.name}</h3>
            </Link>
          </div>
          <span className="rounded-full bg-[#f3ead8] px-3 py-1 text-xs font-semibold text-[#8b5e3c]">
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-[#52606d]">{product.description}</p>

        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-semibold text-[#1f3c88]">{formatPrice(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-[#1f3c88] hover:text-[#162e69]"
          >
            View details
          </Link>
        </div>

        <AddToCartButton
          product={product}
          className="w-full rounded-full bg-[#1f3c88] px-5 py-3 text-sm font-semibold text-white hover:bg-[#162e69] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </article>
  );
}
