"use client";

import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import Container from "@/components/ui/Container";
import {
  formatCartPrice,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart.service";

export default function CartPage() {
  const { cart, isLoading } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState(null);

  return (
    <main className="min-h-screen bg-background">
      <Container className="py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg font-medium text-gray-600">Loading cart...</p>
          </div>
        ) : !cart.items?.length ? (
          <div className="flex flex-col items-center justify-center h-96">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start shopping to add products to your cart
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_0.9fr]">
            <section className="space-y-6">
              {cart.items.map((item) => {
                const itemId =
                  item.productId || item.id || item._id || item.slug;
                const isUpdating = updatingItemId === itemId;

                return (
                  <div
                    key={itemId || item.name}
                    className="rounded-3xl border border-border bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-6">
                      <div className="h-28 w-28 overflow-hidden rounded-3xl bg-muted">
                        <img
                          src={item.image || "/categories/Demo-Image.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-[#8b5e3c]">
                              {item.category || "Product"}
                            </p>
                            <h2 className="text-xl font-semibold text-foreground mt-2">
                              {item.name}
                            </h2>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              setUpdatingItemId(itemId);
                              try {
                                await removeCartItem(itemId);
                              } catch (error) {
                                console.error("Remove cart item failed", error);
                              } finally {
                                setUpdatingItemId(null);
                              }
                            }}
                            disabled={isUpdating}
                            className="rounded-full border border-border p-3 text-muted-foreground hover:border-destructive hover:text-destructive transition-colors disabled:opacity-60"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                if (item.quantity <= 1) return;
                                setUpdatingItemId(itemId);
                                try {
                                  await updateCartItemQuantity(
                                    itemId,
                                    item.quantity - 1,
                                  );
                                } catch (error) {
                                  console.error(
                                    "Update cart quantity failed",
                                    error,
                                  );
                                } finally {
                                  setUpdatingItemId(null);
                                }
                              }}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="h-10 w-10 rounded-full border border-border bg-white text-xl font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              -
                            </button>
                            <span className="text-base font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                setUpdatingItemId(itemId);
                                try {
                                  await updateCartItemQuantity(
                                    itemId,
                                    item.quantity + 1,
                                  );
                                } catch (error) {
                                  console.error(
                                    "Update cart quantity failed",
                                    error,
                                  );
                                } finally {
                                  setUpdatingItemId(null);
                                }
                              }}
                              disabled={isUpdating}
                              className="h-10 w-10 rounded-full border border-border bg-white text-xl font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                            <span>Unit price</span>
                            <span>{formatCartPrice(item.price)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
                            <span>Total</span>
                            <span>
                              {formatCartPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <aside className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Order summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items</span>
                  <span>{cart.items.length}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total quantity</span>
                  <span>
                    {cart.items.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Subtotal</span>
                  <span>{formatCartPrice(cart.totalPrice)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 block rounded-2xl bg-primary px-6 py-4 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
