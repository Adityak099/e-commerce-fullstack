"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/services/auth.service";
import { addToCart, removeCartItem, updateCartItemQuantity } from "@/services/cart.service";
import { useCart } from "@/hooks/useCart";

export default function AddToCartButton({ product, className = "" }) {
  const router = useRouter();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const cartItem = useMemo(
    () => (cart.items || []).find((item) => item.productId === product.id),
    [cart, product.id],
  );

  const quantity = Number(cartItem?.quantity || 0);

  const setFeedbackMessage = (message) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 1800);
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!requireAuth()) {
      return;
    }

    try {
      setLoading(true);
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      setFeedbackMessage("Added to cart");
    } catch (error) {
      setFeedbackMessage(error.response?.data?.error || error.message || "Could not add item");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (!requireAuth()) {
      return;
    }

    try {
      setLoading(true);

      if (!cartItem) {
        await handleAdd();
        return;
      }

      await updateCartItemQuantity(product.id, quantity + 1);
    } catch (error) {
      setFeedbackMessage(error.response?.data?.error || error.message || "Could not update item");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (!requireAuth() || !cartItem) {
      return;
    }

    try {
      setLoading(true);

      if (quantity <= 1) {
        await removeCartItem(product.id);
        return;
      }

      await updateCartItemQuantity(product.id, quantity - 1);
    } catch (error) {
      setFeedbackMessage(error.response?.data?.error || error.message || "Could not update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {quantity > 0 ? (
        <div className={`flex items-center justify-between rounded-full bg-[#1f3c88] px-3 py-2 text-white ${className}`}>
          <button
            type="button"
            onClick={handleDecrease}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-xl disabled:opacity-60"
          >
            -
          </button>
          <span className="text-base font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={loading || quantity >= product.stock}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-xl disabled:opacity-60"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || product.stock < 1}
          className={className}
        >
          {loading ? "Adding..." : product.stock < 1 ? "Out of stock" : "Add to cart"}
        </button>
      )}
      {feedback ? <p className="text-sm text-[#1f3c88]">{feedback}</p> : null}
    </div>
  );
}
