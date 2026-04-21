"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">All Categories</h1>
      <p className="text-gray-500 mb-6">Browse all service categories</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/search?category=${encodeURIComponent(cat.name)}`}>
            <Card hover className="p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-gray-400">{cat.nameBn}</p>
                </div>
              </div>
              {cat.description && <p className="text-sm text-gray-500 mt-2">{cat.description}</p>}
              <Badge className="mt-3">{cat.workerCount} workers</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
