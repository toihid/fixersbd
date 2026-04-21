"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin, Phone, MessageCircle, Star, CheckCircle, Shield,
  Clock, Briefcase, Heart, Flag, Loader2, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { useAuthStore } from "@/store/auth-store";
import { getInitials, formatDate } from "@/lib/utils";
import type { IWorker, IReview } from "@/types";

export default function WorkerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [worker, setWorker] = useState<IWorker | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [similarWorkers, setSimilarWorkers] = useState<IWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/workers/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setWorker(data.worker);
        setReviews(data.reviews || []);
        setSimilarWorkers(data.similarWorkers || []);
      } catch {
        toast.error("Worker not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleHire() {
    if (!user) {
      toast.error("Please login as a customer to hire a worker");
      router.push("/login");
      return;
    }
    if (user.role === "worker") {
      toast.error("Only customers can hire workers. Please login as a customer.");
      return;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot hire workers directly.");
      return;
    }
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: id }),
      });
      if (res.ok) {
        toast.success("Job request sent!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch { toast.error("Failed to create job"); }
  }

  async function toggleFavorite() {
    if (!user) {
      toast.error("Please login to save favorites");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: id }),
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
      toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch { toast.error("Failed"); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">Worker not found</p>
      </div>
    );
  }

  const verificationLabels = {
    none: null,
    basic: "Basic Verified",
    full: "Fully Verified",
    trusted_pro: "Trusted Pro",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                {worker.avatar ? (
                  <img src={worker.avatar} alt={worker.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                    <span className="text-brand-600 font-bold text-2xl">{getInitials(worker.name)}</span>
                  </div>
                )}
                {worker.availability === "available" && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{worker.name}</h1>
                  {worker.isVerified && <CheckCircle size={18} className="text-brand-500" />}
                </div>
                <p className="text-gray-500">{worker.occupation}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({worker.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Briefcase size={14} /> {worker.completedJobs} jobs done
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {verificationLabels[worker.verificationLevel] && (
                    <Badge variant="verified"><Shield size={12} /> {verificationLabels[worker.verificationLevel]}</Badge>
                  )}
                  {worker.availability === "available" && <Badge variant="success"><Clock size={12} /> Available Now</Badge>}
                  {worker.location && <Badge><MapPin size={12} /> {worker.location.area || worker.location.city}</Badge>}
                </div>
              </div>
            </div>

            {worker.bio && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{worker.bio}</p>}

            {worker.skills && worker.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {worker.experience > 0 && (
              <p className="mt-3 text-sm text-gray-500">{worker.experience} years of experience</p>
            )}
          </Card>

          {/* Reviews */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.customerName || "Customer"}</span>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            {worker.hourlyRate > 0 && (
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-brand-600">৳{worker.hourlyRate}</p>
                <p className="text-sm text-gray-400">per hour</p>
              </div>
            )}
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handleHire}>
                {!user ? "Login to Hire" : "Hire Now"}
              </Button>
              <a href={`tel:${worker.phone}`} className="w-full">
                <Button variant="outline" className="w-full" size="lg"><Phone size={16} /> Call</Button>
              </a>
              <a href={`https://wa.me/${worker.phone?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="secondary" className="w-full" size="lg"><MessageCircle size={16} /> WhatsApp</Button>
              </a>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" className="flex-1" onClick={toggleFavorite}>
                <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Flag size={16} /> Report
              </Button>
            </div>
          </Card>

          {/* Similar workers */}
          {similarWorkers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Similar Workers</h3>
              <div className="space-y-3">
                {similarWorkers.map((w) => (
                  <WorkerCard key={w._id} worker={w} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
