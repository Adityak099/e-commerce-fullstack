"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

import {
  isAuthenticated,
  getCurrentUser,
  logoutUser,
} from "@/services/auth.service";
import { useCartSummary } from "@/hooks/useCartSummary";

export default function Navbar() {
  const router = useRouter();
  const { itemCount } = useCartSummary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  // Initial Auth Check + Event Listener
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth changes (login/logout)
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []); // Empty dependency array is fine here

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center font-bold text-xl text-primary-foreground shadow-md">
              F
            </div>
            <span className="font-bold text-2xl text-foreground tracking-tight hidden sm:block">
              FreshMart
            </span>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-secondary rounded-2xl cursor-pointer hover:bg-secondary/80 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <div className="text-sm">
              <p className="text-muted-foreground text-xs -mb-0.5">
                Deliver to
              </p>
              <p className="font-medium flex items-center gap-1">
                Patna, Bihar <ChevronDown className="w-3 h-3" />
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search fresh vegetables, fruits, groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-2xl focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-medium hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/offers"
              className="font-medium hover:text-primary transition-colors"
            >
              Offers
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-sm">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary text-sm"
                  >
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive text-sm text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium hover:bg-secondary rounded-2xl transition-colors"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl hover:bg-primary/90 transition-all shadow-md relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 hover:bg-secondary rounded-2xl transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-2xl"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1 pb-6">
            <Link
              href="/"
              className="block px-4 py-3 hover:bg-secondary rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-3 hover:bg-secondary rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/offers"
              className="block px-4 py-3 hover:bg-secondary rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Offers
            </Link>

            <div className="my-3 border-t border-border" />

            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Signed in as {user.name}
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-secondary rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 hover:bg-secondary rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block mx-4 mt-2 bg-primary text-primary-foreground py-3 rounded-2xl text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
