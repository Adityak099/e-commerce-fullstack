"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, isAuthenticated } from "@/services/auth.service";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
      return;
    }

    const flashMessage = sessionStorage.getItem("authSuccessMessage");
    const nextMessage = flashMessage || "";

    if (nextMessage) {
      setSuccessMessage(nextMessage);
      sessionStorage.removeItem("authSuccessMessage");
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      if (response?.token) {
        router.push("/");
        return;
      }

      setError("Login completed, but the server response was unexpected.");
    } catch (err) {
      setError(err.message || err.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">Login</p>
      <h2 className="mt-4 font-serif text-4xl font-semibold text-[#1f2937]">Welcome back</h2>
      <p className="mt-3 text-sm leading-7 text-[#52606d]">
        Sign in to continue straight to the SwiftCart home page.
      </p>

      {successMessage && (
        <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1f2937]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full rounded-[20px] border border-[#e8dcc7] bg-white px-4 py-3.5 text-[#1f2937] outline-none focus:border-[#1f3c88]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1f2937]">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full rounded-[20px] border border-[#e8dcc7] bg-white px-4 py-3.5 text-[#1f2937] outline-none focus:border-[#1f3c88]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#1f3c88] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#162e69] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#52606d]">
        New here?{" "}
        <Link href="/register" className="font-semibold text-[#1f3c88] hover:text-[#162e69]">
          Create your account
        </Link>
      </p>
    </div>
  );
}
