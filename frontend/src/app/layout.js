import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "FreshMart - Fresh Groceries Delivered Fast",
  description:
    "Quality organic groceries delivered to your door. Shop fresh vegetables, fruits, dairy, and more at FreshMart.",
  generator: "Next.js",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Navbar />

        <main className="min-h-[calc(100vh-140px)]">   {/* Footer ke liye space */}
          {children}
        </main>
        

        <Footer />
      </body>
    </html>
  );
}