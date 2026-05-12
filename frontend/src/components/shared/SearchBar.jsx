// components/shared/SearchBar.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';
import { searchProductsLive } from "@/services/product.Service";

export default function SearchBar() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimerRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search with Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSearching(true);
    setShowSearchResults(false);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchProductsLive(searchQuery);
        setSearchResults(results.slice(0, 6));
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowSearchResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  const handleResultClick = (product) => {
    router.push(`/products/${product.slug}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex flex-1 max-w-xl mx-6 relative"
      ref={searchContainerRef}
    >
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />

        <input
          type="text"
          placeholder="Search fresh vegetables, fruits, groceries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
          className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-2xl 
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                     transition-all duration-200 text-sm"
        />

        {isSearching && (
          <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        )}

        {/* Live Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="max-h-96 overflow-y-auto py-1">
              {searchResults.map((product) => (
                <button
                  key={product.id || product._id}
                  type="button"
                  onClick={() => handleResultClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left border-b border-border last:border-b-0 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Search className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                  </div>

                  <p className="text-sm font-semibold text-primary shrink-0">₹{product.price}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full px-4 py-3.5 text-sm font-medium text-primary bg-secondary hover:bg-secondary/80 border-t border-border transition-colors"
            >
              View All Results for &quot;{searchQuery}&quot;
            </button>
          </div>
        )}

        {/* No Results */}
        {showSearchResults && !isSearching && searchResults.length === 0 && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 p-8 text-center">
            <p className="text-muted-foreground">
              No products found for <span className="font-medium">&quot;{searchQuery}&quot;</span>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}