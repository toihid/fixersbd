import { create } from "zustand";
import type { SearchFilters } from "@/types";

interface SearchState {
  query: string;
  filters: SearchFilters;
  userLocation: { lat: number; lng: number } | null;
  locationLoading: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setLocationLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  page: 1,
  limit: 12,
  sortBy: "rating",
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  filters: defaultFilters,
  userLocation: null,
  locationLoading: false,
  setQuery: (query) => set({ query }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setUserLocation: (userLocation) => set({ userLocation }),
  setLocationLoading: (locationLoading) => set({ locationLoading }),
  resetFilters: () => set({ filters: defaultFilters, query: "" }),
}));
