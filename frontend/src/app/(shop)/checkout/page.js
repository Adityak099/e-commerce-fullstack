//src/app/(shop)/checkout/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getCart } from "@/services/cart.Service";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");
        const cartData = await getCart();
        setCart(cartData);
      } catch (error) {
        setError("Cart is temporarily unavailable right now.");
        console.error("Checkout cart failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleAddressChange = (field, value) => {
    setAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart?.items?.length) return;

    let paymentWindowOpened = false;

    try {
      setPlacingOrder(true);
      setError("");

      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        setError("Payment service could not be loaded. Please try again.");
        return;
      }

      const response = await api.post("/orders/checkout", {
        shippingAddress: {
          street: address.street,
          city: address.city,
          zipCode: address.zip,
        },
      });

      const checkout = response.data.data;

      const razorpay = new window.Razorpay({
        key: checkout.key,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "FreshMart",
        description: "Order Payment",
        order_id: checkout.rzpOrderId,
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          internalOrderId: checkout.internalOrderId,
        },
        theme: {
          color: "#16a34a",
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await api.post("/payment/verify", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              router.push(`/dashboard/orders/${verifyResponse.data.order.id}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            setError("Payment verification failed. Please contact support.");
            console.error("Payment verification failed", error);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
          },
        },
      });

      razorpay.on("payment.failed", (paymentResponse) => {
        setError(
          paymentResponse.error?.description ||
            "Payment failed. Please try again.",
        );
        setPlacingOrder(false);
      });

      razorpay.open();
      paymentWindowOpened = true;
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Payment could not be initialized. Please try again.",
      );
      console.error("Payment initialization failed", error);
    } finally {
      if (!paymentWindowOpened) {
        setPlacingOrder(false);
      }
    }
  };

  return (
    <main className="py-8">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

          {error ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-20 font-semibold text-green-600">
              Loading checkout...
            </div>
          ) : !cart?.items?.length ? (
            <div className="rounded-lg border border-dashed p-10 text-gray-500">
              Your cart is empty.
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <h2 className="text-xl font-bold">Shipping Address</h2>
              <input
                className="w-full border p-2"
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
              <div className="flex gap-2">
                <input
                  className="w-full border p-2"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  required
                />
                <input
                  className="w-full border p-2"
                  placeholder="ZIP"
                  value={address.zip}
                  onChange={(e) => handleAddressChange("zip", e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={placingOrder}>
                {placingOrder ? "Opening Payment..." : "Pay Now"}
              </Button>
            </form>
          )}
        </section>

        <aside className="bg-gray-50 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cart?.items?.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between py-2 border-b"
            >
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="text-xl font-bold mt-4">
            Total: ₹{cart?.totalPrice || 0}
          </div>
        </aside>
      </Container>
    </main>
  );
}
