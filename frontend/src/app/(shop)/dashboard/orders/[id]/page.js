"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Container from "@/components/ui/Container";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        setError("Order details are temporarily unavailable right now.");
        console.error("Order details failed", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  return (
    <main className="py-8">
      <Container className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>

        {error ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-20 text-center font-semibold text-green-600">
            Loading order details...
          </div>
        ) : order ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span className="text-green-600 uppercase">{order.status}</span>
            </p>
            <p className="mb-4">
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <hr className="my-4" />
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-gray-500">
            Order not found.
          </div>
        )}
      </Container>
    </main>
  );
}
