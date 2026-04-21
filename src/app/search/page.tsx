"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IWorker } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const q = searchParams.get("q");
      const category = searchParams.get("category");
      const lat = searchParams.get("lat");
      const lng = searchParams.get("lng");
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (lat) params.set("lat", lat);
      if (lng) params.set("lng", lng);
      params.set("sortBy", sortBy);
      params.set("page", page.toString());
      if (verifiedOnly) params.set("verified", "true");
      if (availableOnly) params.set("available", "true");
      const res = await fetch(`/api/workers?${params.toString()}`);
      const data = await res.json();
      setWorkers(data.workers || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch { setWorkers([]); } finally { setLoading(false); }
  }, [searchParams, sortBy, page, verifiedOnly, availableOnly]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6"><SearchBar /></div>

      {(searchParams.get("q") || searchParams.get("category")) && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {searchParams.get("q") && (<>Results for &quot;<span className="font-medium text-gray-700 dark:text-gray-200">{searchParams.get("q")}</span>&quot;</>)}
            {searchParams.get("category") && (<> in <span className="font-medium text-brand-500">{searchParams.get("category")}</span></>)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={14} /> Filters
        </Button>
        <div className="flex gap-2 flex-wrap">
          {["rating", "price", "experience", "distance"].map((s) => (
            <button key={s} onClick={() => { setSortBy(s); setPage(1); }}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                sortBy === s ? "bg-brand-50 dark:bg-brand-900/20 border-brand-300 text-brand-600" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300")}>
              {s === "rating" ? "Top Rated" : s === "price" ? "Lowest Price" : s === "experience" ? "Most Experienced" : "Nearest"}
            </button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 animate-slide-up">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            Verified Only
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={availableOnly} onChange={(e) => { setAvailableOnly(e.target.checked); setPage(1); }} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            Available Now
          </label>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-500" /></div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-gray-500">No workers found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => (<WorkerCard key={worker._id} worker={worker} distance={(worker as any).distance} />))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
