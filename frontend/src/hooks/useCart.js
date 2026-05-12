"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { getCart, subscribeToCartChanges } from "@/services/cart.service";

const EMPTY_CART = { items: [], totalPrice: 0 };

export function useCart() {
  const [cart, setCart] = useState(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      if (!isAuthenticated()) {
        if (active) {
          setCart(EMPTY_CART);
          setIsLoading(false);
        }
        return;
      }

      try {
        const nextCart = await getCart();
        if (active) {
          setCart(nextCart);
        }
      } catch {
        if (active) {
          setCart(EMPTY_CART);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadCart();

    const unsubscribe = subscribeToCartChanges((nextCart) => {
      if (active) {
        setCart(nextCart || EMPTY_CART);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { cart, isLoading };
}
