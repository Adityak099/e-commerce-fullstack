"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Container from "@/components/ui/Container";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.data || []);
      } catch (error) {
        setError("Order history is temporarily unavailable right now.");
        console.error("Order history failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        {error ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-20 text-center font-semibold text-green-600">
            Loading orders...
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{order.totalAmount}</p>
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    className="text-green-600 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            {!orders.length ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-gray-500">
                No orders found.
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </main>
  );
}
