"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

const HIDDEN_ROUTES = new Set(["/login", "/register"]);

export default function Navbar() {
  const { user, isMounted } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (HIDDEN_ROUTES.has(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const firstName = user?.name?.split(" ")[0] || "Guest";

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(247,240,228,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f3c88] text-lg font-black text-white shadow-[0_14px_35px_rgba(31,60,136,0.28)]">
            SC
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold tracking-tight text-[#1f2937]">
              SwiftCart
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">
              Everyday market
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#3d4451] md:flex">
          <Link href="/" className="transition hover:text-[#1f3c88]">
            Home
          </Link>
          <a href="#collections" className="transition hover:text-[#1f3c88]">
            Collections
          </a>
          <a href="#delivery" className="transition hover:text-[#1f3c88]">
            Delivery
          </a>
          <a href="#about" className="transition hover:text-[#1f3c88]">
            About
          </a>
        </nav>

        {!isMounted ? (
          <div className="h-11 w-32 animate-pulse rounded-full bg-white/70" />
        ) : user ? (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-3 rounded-full border border-white/70 bg-white/85 px-3 py-2 text-left shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d96f32] text-sm font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#1f2937]">{firstName}</p>
                <p className="text-xs text-[#6b7280]">Profile</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-72 rounded-[28px] border border-white/75 bg-[#fffdf8] p-4 shadow-[0_22px_50px_rgba(15,23,42,0.14)]">
                <div className="rounded-[22px] bg-[#f3ead8] p-4">
                  <p className="text-sm text-[#8b5e3c]">Signed in as</p>
                  <p className="mt-1 text-lg font-semibold text-[#1f2937]">{user.name}</p>
                  <p className="text-sm text-[#52606d]">{user.email}</p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-full bg-[#1f3c88] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#162e69]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-[#d9c8aa] px-5 py-2.5 text-sm font-semibold text-[#1f2937] transition hover:bg-white/80"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#1f3c88] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#162e69]"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
