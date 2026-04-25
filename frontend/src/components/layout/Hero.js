import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-6 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-14">
      <div className="rounded-[36px] bg-[#1f3c88] p-8 text-white shadow-[0_30px_80px_rgba(31,60,136,0.24)] sm:p-12">
        <p className="text-sm uppercase tracking-[0.32em] text-[#d8e3ff]">
          FreshMart storefront
        </p>
        <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] font-semibold sm:text-6xl">
          Browse products live from your database and add them to cart.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#dce6ff] sm:text-lg">
          The home page now works as a real storefront entry point with dynamic
          products, cleaner navigation, and direct cart actions for logged-in
          users.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-[#f6c453] px-6 py-3 text-center text-sm font-bold text-[#1f2937] hover:bg-[#f2b834]"
          >
            Explore products
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/35 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-[34px] bg-[#fffaf2] p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">
            Frontend review
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1f2937]">
            Home now reflects live inventory instead of static placeholders.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#52606d]">
            The featured section is server-rendered from the backend product
            API, so your homepage stays current with what exists in the
            database.
          </p>
        </div>

        <div
          id="delivery"
          className="rounded-[34px] bg-[#d96f32] p-7 text-white shadow-[0_20px_60px_rgba(217,111,50,0.2)]"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffe7da]">
            Cart flow
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Listing cards and the detail page both support add to cart.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#fff0e8]">
            If the user is not logged in, the cart action sends them to login
            first. If they are logged in, the item is posted to your cart API.
          </p>
        </div>
      </div>
    </section>
  );
}
