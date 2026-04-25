"use client";

import { useState } from "react";
import AddToCartButton from "@/components/product/AddToCartButton";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductView({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
      <section className="space-y-4">
        <div className="overflow-hidden rounded-[34px] bg-[rgba(255,253,248,0.9)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <img
            src={selectedImage}
            alt={product.name}
            className="aspect-square h-full w-full object-cover"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-[22px] border ${
                selectedImage === image ? "border-[#1f3c88]" : "border-transparent"
              } bg-[rgba(255,253,248,0.86)]`}
            >
              <img src={image} alt={product.name} className="aspect-square h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-white/70 bg-[rgba(255,253,248,0.85)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">{product.category}</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-[#1f2937]">{product.name}</h1>
        <p className="mt-4 text-3xl font-semibold text-[#1f3c88]">{formatPrice(product.price)}</p>

        <p className="mt-6 text-base leading-8 text-[#52606d]">{product.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f3ead8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b5e3c]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <AddToCartButton
            product={product}
            className="w-full rounded-full bg-[#d96f32] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#c35f26] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="mt-10 grid gap-4 border-t border-[#eadfcd] pt-6 text-sm text-[#52606d]">
          <p>Availability: {product.stock > 0 ? `${product.stock} items ready to ship` : "Currently unavailable"}</p>
          <p>Delivery: Same-day dispatch in supported local zones.</p>
          <p>Returns: Easy replacement support for damaged deliveries.</p>
        </div>
      </section>
    </div>
  );
}
