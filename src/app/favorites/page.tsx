"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth-store";

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => setFavorites(d.favorites || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      {favorites.length === 0 ? (
        <Card className="p-8 text-center">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No saved workers yet</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((w: any) => (
            <WorkerCard key={w._id} worker={w} />
          ))}
        </div>
      )}
    </div>
  );
}
