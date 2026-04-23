"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, isAuthenticated } from "@/services/auth.service";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
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
    setSuccessMessage("");

    try {
      const response = await registerUser(formData);

      if (response?.user) {
        const message = "Registration successful. Please log in to continue.";
        setSuccessMessage(message);
        sessionStorage.setItem("authSuccessMessage", message);

        setTimeout(() => {
          router.push("/login");
        }, 1400);
        return;
      }

      setError("Registration completed, but the server response was unexpected.");
    } catch (err) {
      setError(err.message || err.error || "Unable to register right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-sm uppercase tracking-[0.28em] text-[#8b5e3c]">Register</p>
      <h2 className="mt-4 font-serif text-4xl font-semibold text-[#1f2937]">Create your account</h2>
      <p className="mt-3 text-sm leading-7 text-[#52606d]">
        Complete the form below. After successful registration, a confirmation message appears and
        you are redirected to login.
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
          <label className="mb-2 block text-sm font-semibold text-[#1f2937]">Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="w-full rounded-[20px] border border-[#e8dcc7] bg-white px-4 py-3.5 text-[#1f2937] outline-none focus:border-[#1f3c88]"
          />
        </div>

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
            placeholder="Create a password"
            className="w-full rounded-[20px] border border-[#e8dcc7] bg-white px-4 py-3.5 text-[#1f2937] outline-none focus:border-[#1f3c88]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#d96f32] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#c35f26] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#52606d]">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#1f3c88] hover:text-[#162e69]">
          Go to login
        </Link>
      </p>
    </div>
  );
}
