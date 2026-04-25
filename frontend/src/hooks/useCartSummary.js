"use client";

import { useMemo } from "react";
import { useCart } from "@/hooks/useCart";

export function useCartSummary() {
  const { cart, isLoading } = useCart();

  const itemCount = useMemo(
    () =>
      (cart.items || []).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      ),
    [cart],
  );

  return { itemCount, isLoading, cart };
}
