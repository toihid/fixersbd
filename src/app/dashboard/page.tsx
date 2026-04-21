"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, Clock, CheckCircle, XCircle, Loader2, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAuthStore } from "@/store/auth-store";
import { formatDate } from "@/lib/utils";
import type { IJob } from "@/types";

const statusColors: Record<string, "default" | "warning" | "info" | "success" | "danger"> = {
  pending: "warning",
  deal_final: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "danger",
};

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, [user]);

  async function updateStatus(jobId: string, status: string) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Job marked as ${status.replace("_", " ")}`);
        setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, status } : j)));
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch { toast.error("Failed to update"); }
  }

  async function submitReview(jobId: string, workerId: string) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, workerId, rating: reviewRating, comment: reviewComment }),
      });
      if (res.ok) {
        toast.success("Review submitted!");
        setReviewModal(null);
        setReviewComment("");
        setReviewRating(5);
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {user?.role === "worker" ? "Job Requests" : "My Jobs"}
      </h1>

      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {user?.role === "worker" ? "No job requests yet" : "No jobs yet"}
          </p>
          {user?.role === "customer" && (
            <Button variant="primary" className="mt-4" onClick={() => router.push("/search")}>Find Workers</Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <Card key={job._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {user?.role === "customer"
                        ? job.workerId?.name || "Worker"
                        : job.customerId?.name || "Customer"}
                    </p>
                    <Badge variant={statusColors[job.status]}>{job.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{job.workerId?.occupation}</p>
                  {job.description && <p className="text-sm text-gray-400 mt-1">{job.description}</p>}
                  {job.agreedPrice && <p className="text-sm font-medium mt-1">৳{job.agreedPrice}</p>}
                  <p className="text-xs text-gray-400 mt-1">{formatDate(job.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {/* WORKER actions */}
                  {job.status === "pending" && user?.role === "worker" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(job._id, "deal_final")}>
                        <CheckCircle size={14} /> Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(job._id, "cancelled")}>
                        <XCircle size={14} /> Reject
                      </Button>
                    </>
                  )}
                  {job.status === "deal_final" && user?.role === "worker" && (
                    <Button size="sm" onClick={() => updateStatus(job._id, "in_progress")}>
                      Start Job
                    </Button>
                  )}
                  {job.status === "in_progress" && user?.role === "worker" && (
                    <Badge variant="info"><Clock size={12} /> In Progress</Badge>
                  )}

                  {/* CUSTOMER actions */}
                  {job.status === "pending" && user?.role === "customer" && (
                    <Badge variant="warning"><Clock size={12} /> Waiting for worker</Badge>
                  )}
                  {job.status === "deal_final" && user?.role === "customer" && (
                    <Badge variant="info"><CheckCircle size={12} /> Worker accepted</Badge>
                  )}
                  {job.status === "in_progress" && user?.role === "customer" && (
                    <Button size="sm" onClick={() => updateStatus(job._id, "completed")}>
                      <CheckCircle size={14} /> Mark Complete
                    </Button>
                  )}
                  {job.status === "completed" && user?.role === "customer" && (
                    <Button size="sm" variant="secondary" onClick={() => setReviewModal(job._id)}>
                      <Star size={14} /> Review
                    </Button>
                  )}
                  {job.status === "completed" && user?.role === "worker" && (
                    <Badge variant="success"><CheckCircle size={12} /> Completed</Badge>
                  )}

                  {/* Cancel for both — only on pending/deal_final */}
                  {["pending", "deal_final"].includes(job.status) && user?.role === "customer" && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(job._id, "cancelled")}>
                      <XCircle size={14} /> Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Review modal inline */}
              {reviewModal === job._id && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-slide-up">
                  <h4 className="font-medium mb-2">Leave a Review</h4>
                  <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={24} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full mt-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" loading={submitting} onClick={() => submitReview(job._id, job.workerId?._id)}>Submit</Button>
                    <Button size="sm" variant="ghost" onClick={() => setReviewModal(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
