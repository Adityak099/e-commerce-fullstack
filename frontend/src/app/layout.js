// src/app/layout.js
import Navbar from "@/components/shared/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f7f0e4] text-[#1f2937] transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />
          <div className="relative">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
