'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/25">
              F
            </div>
            <span className="hidden sm:inline font-bold text-xl text-foreground">
              FreshMart
            </span>
          </Link>

          {/* Location Selector - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <div className="text-sm">
              <p className="text-muted-foreground text-xs">Deliver to</p>
              <p className="font-medium text-foreground flex items-center gap-1">
                New York <ChevronDown className="w-3 h-3" />
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for fruits, vegetables, groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Products
            </Link>
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Offers
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Login Button - Desktop */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary font-medium text-sm transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Cart</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-accent-foreground text-xs flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl text-foreground font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl text-foreground font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl text-foreground font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Offers
            </Link>
            <div className="border-t border-border my-2" />
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl text-foreground font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium mx-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
