"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

import {
  isAuthenticated,
  getCurrentUser,
  logoutUser,
} from "@/services/auth.service";
import { useCartSummary } from "@/hooks/useCartSummary";
import SearchBar from "./SearchBar";   

const LOCATION_STORAGE_KEY = "freshmart-delivery-location";

const formatCoordinates = (latitude, longitude) =>
  `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

const getSavedLocation = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);

  if (!savedLocation) {
    return null;
  }

  try {
    return JSON.parse(savedLocation);
  } catch {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    return null;
  }
};

export default function Navbar() {
  const router = useRouter();
  const { itemCount } = useCartSummary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Auth Check
  useEffect(() => {
    const checkAuth = () => {
      setUser(isAuthenticated() ? getCurrentUser() : null);
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);

    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedLocation = getSavedLocation();

      if (savedLocation) {
        setLocation(savedLocation);
        setManualLocation(savedLocation.label || "");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  const saveLocation = (nextLocation) => {
    setLocation(nextLocation);
    setManualLocation(nextLocation.label);
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
  };

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location is not supported in this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        saveLocation({
          label: "Current location",
          latitude,
          longitude,
          coordinates: formatCoordinates(latitude, longitude),
          source: "browser",
        });
        setLocationLoading(false);
        setLocationMenuOpen(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Please allow location access to use your current location."
            : "Could not get your location. Please try again.";

        setLocationError(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  const handleManualLocationSubmit = (event) => {
    event.preventDefault();
    const nextLocation = manualLocation.trim();

    if (!nextLocation) {
      setLocationError("Enter a delivery location.");
      return;
    }

    saveLocation({
      label: nextLocation,
      source: "manual",
    });
    setLocationError("");
    setLocationMenuOpen(false);
  };

  const locationLabel = location?.label || "Choose location";
  const locationDetail = location?.coordinates || "Deliver to";
  const renderLocationPicker = (positionClassName) => (
    <div
      className={`absolute top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-4 shadow-xl ${positionClassName}`}
    >
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={locationLoading}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <MapPin className="h-4 w-4 text-primary" />
        {locationLoading ? "Getting location..." : "Use current location"}
      </button>

      <div className="my-3 h-px bg-border" />

      <form onSubmit={handleManualLocationSubmit} className="space-y-3">
        <input
          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Enter city or area"
          value={manualLocation}
          onChange={(event) => setManualLocation(event.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save Location
        </button>
      </form>

      {locationError ? (
        <p className="mt-3 text-sm text-destructive">{locationError}</p>
      ) : null}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center font-bold text-xl text-primary-foreground shadow-md">
              F
            </div>
            <span className="font-bold text-2xl text-foreground tracking-tight hidden sm:block">
              FreshMart
            </span>
          </Link>

          {/* Location */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setLocationMenuOpen((isOpen) => !isOpen)}
              className="flex max-w-52 items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-left transition-colors hover:bg-secondary/80"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 text-sm">
                <p className="truncate text-xs text-muted-foreground -mb-0.5">
                  {locationDetail}
                </p>
                <p className="flex items-center gap-1 font-medium">
                  <span className="truncate">{locationLabel}</span>
                  <ChevronDown className="h-3 w-3 shrink-0" />
                </p>
              </div>
            </button>

            {locationMenuOpen ? (
              renderLocationPicker("left-0")
            ) : null}
          </div>

          {/* Search Bar Component */}
          <SearchBar />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="font-medium hover:text-primary transition-colors">Shop</Link>
            <Link href="/offers" className="font-medium hover:text-primary transition-colors">Offers</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <div className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setLocationMenuOpen((isOpen) => !isOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary transition-colors hover:bg-secondary/80"
                aria-label="Choose delivery location"
              >
                <MapPin className="h-5 w-5 text-primary" />
              </button>

              {locationMenuOpen ? renderLocationPicker("right-0") : null}
            </div>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-sm">{user.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary text-sm">
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive text-sm text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium hover:bg-secondary rounded-2xl transition-colors"
              >
                <User className="w-5 h-5" /> Login
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl hover:bg-primary/90 transition-all shadow-md relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 hover:bg-secondary rounded-2xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (You can keep your existing mobile menu) */}
        {/* ... your mobile menu code ... */}

      </div>
    </nav>
  );
}
