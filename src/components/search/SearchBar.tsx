"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";
import { getAutoSuggestions, detectCategory } from "@/lib/smart-search";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSearchStore } from "@/store/search-store";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  large?: boolean;
  className?: string;
}

export function SearchBar({ large = false, className }: SearchBarProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { lat, lng, loading: geoLoading, requestLocation } = useGeolocation();
  const { setQuery, setFilters, setUserLocation } = useSearchStore();

  useEffect(() => {
    if (lat && lng) {
      setUserLocation({ lat, lng });
    }
  }, [lat, lng, setUserLocation]);

  useEffect(() => {
    if (input.length >= 2) {
      const results = getAutoSuggestions(input);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(searchTerm?: string) {
    const term = searchTerm || input;
    if (!term.trim()) return;

    const detectedCategory = detectCategory(term);
    setQuery(term);
    if (detectedCategory) {
      setFilters({ category: detectedCategory });
    }

    const params = new URLSearchParams({ q: term });
    if (detectedCategory) params.set("category", detectedCategory);
    if (lat && lng) {
      params.set("lat", lat.toString());
      params.set("lng", lng.toString());
    }

    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all focus-within:shadow-md focus-within:border-brand-300",
          large && "rounded-2xl shadow-lg"
        )}
      >
        <Search
          size={large ? 22 : 18}
          className="ml-4 text-gray-400 flex-shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="What service do you need? e.g. fan repair, plumber..."
          className={cn(
            "flex-1 bg-transparent border-none outline-none px-3 text-gray-900 dark:text-white placeholder:text-gray-400",
            large ? "py-4 text-lg" : "py-3 text-sm"
          )}
          aria-label="Search for services"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
        />
        <button
          onClick={requestLocation}
          className="p-2 mr-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Use my location"
          aria-label="Detect my location"
        >
          {geoLoading ? (
            <Loader2 size={18} className="animate-spin text-brand-500" />
          ) : (
            <MapPin
              size={18}
              className={cn(
                lat ? "text-brand-500" : "text-gray-400"
              )}
            />
          )}
        </button>
        <button
          onClick={() => handleSearch()}
          className={cn(
            "bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium mr-1.5",
            large ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
          )}
        >
          Search
        </button>
      </div>

      {/* Auto-suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden animate-slide-up">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className={cn(
                "w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                index === selectedIndex && "bg-gray-50 dark:bg-gray-700"
              )}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <span>{suggestion}</span>
              {detectCategory(input) === suggestion && (
                <span className="ml-auto text-xs text-brand-500 font-medium">
                  Best match
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
