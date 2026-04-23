export default function AuthLayout({ children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(31,60,136,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(217,111,50,0.22),transparent_28%)]" />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[38px] border border-white/70 bg-[rgba(255,251,244,0.82)] shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-[#1f3c88] p-12 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.34em] text-[#d8e3ff]">SwiftCart access</p>
          <h1 className="mt-6 max-w-sm font-serif text-5xl leading-[1.06] font-semibold">
            Grocery shopping that starts with a calmer first screen.
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-[#dbe5ff]">
            Sign up, sign in, and move directly into the storefront. The experience is designed to
            feel quick, warm, and easy to trust.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Registration form connects to your backend auth API.",
              "Successful signup shows confirmation before redirecting to login.",
              "Login takes the user straight to the homepage.",
            ].map((line) => (
              <div key={line} className="rounded-[24px] border border-white/12 bg-white/10 p-4">
                <p className="text-sm leading-7 text-[#eef3ff]">{line}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">{children}</section>
      </div>
    </main>
  );
}
