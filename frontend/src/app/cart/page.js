'use client';

import Navbar from '@/components/Navbar';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-primary hover:text-primary/80">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        <div className="flex flex-col items-center justify-center h-96">
          <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8">
            Start shopping to add products to your cart
          </p>
          <Link
            href="/products"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </main>
  );
}
