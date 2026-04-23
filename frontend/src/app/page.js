import Link from "next/link";

const highlights = [
  {
    title: "Curated daily essentials",
    text: "Fresh produce, pantry staples, and household picks arranged around how people actually shop.",
  },
  {
    title: "Fast local delivery",
    text: "Same-day windows, live order status, and cleaner handoff notes for every address.",
  },
  {
    title: "Built for returning shoppers",
    text: "A simple account flow means customers can sign in, land on home, and keep moving.",
  },
];

const categories = [
  "Fresh harvest",
  "Bakery morning picks",
  "Cold storage",
  "Kitchen care",
];

export default function HomePage() {
  return (
    <main className="pb-16">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-14">
        <div className="rounded-[36px] bg-[#1f3c88] p-8 text-white shadow-[0_30px_80px_rgba(31,60,136,0.24)] sm:p-12">
          <p className="text-sm uppercase tracking-[0.32em] text-[#d8e3ff]">
            Reimagined grocery storefront
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] font-semibold sm:text-6xl">
            The home page your shoppers should reach right after login.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#dce6ff] sm:text-lg">
            SwiftCart now leads with a warmer, more premium storefront that keeps auth simple:
            register, see a success message, move to login, and land directly back here.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-full bg-[#f6c453] px-6 py-3 text-center text-sm font-bold text-[#1f2937] hover:bg-[#f2b834]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/35 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Login and continue
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#dbe5ff]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[34px] bg-[#fffaf2] p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">
                  This week
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1f2937]">
                  Pantry reset
                </h2>
              </div>
              <div className="rounded-full bg-[#f3ead8] px-4 py-2 text-sm font-semibold text-[#8b5e3c]">
                24 min avg
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-[24px] border border-[#efe3cf] bg-white px-5 py-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#9ca3af]">
                      0{index + 1}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1f2937]">{category}</p>
                  </div>
                  <div className="h-3 w-20 rounded-full bg-[#f3ead8]">
                    <div
                      className="h-3 rounded-full bg-[#d96f32]"
                      style={{ width: `${70 - index * 12}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="delivery"
            className="rounded-[34px] bg-[#d96f32] p-7 text-white shadow-[0_20px_60px_rgba(217,111,50,0.2)]"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-[#ffe7da]">Delivery promise</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Make the customer feel done in three steps.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#fff0e8]">
              Register with the frontend form, confirm success, log in, and continue browsing from
              the home screen with profile access in the navbar.
            </p>
          </div>
        </div>
      </section>

      <section
        id="collections"
        className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        {[
          ["Seasonal baskets", "Bright produce selections and kitchen-ready mixes."],
          ["Express staples", "Milk, eggs, breads, grains, and repeat favorites."],
          ["Home care", "Cleaning supplies and practical restock bundles."],
        ].map(([title, text]) => (
          <article
            key={title}
            className="rounded-[30px] border border-white/70 bg-[rgba(255,253,248,0.8)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
          >
            <h3 className="font-serif text-2xl font-semibold text-[#1f2937]">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#52606d]">{text}</p>
          </article>
        ))}
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-white/70 bg-[rgba(255,255,255,0.65)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">About the redesign</p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[#3d4451]">
            This frontend now centers the auth journey you requested. Registration shows a success
            state before sending shoppers to login, login returns them straight to the homepage,
            and the navbar exposes a profile section with logout for signed-in users.
          </p>
        </div>
      </section>
    </main>
  );
}
