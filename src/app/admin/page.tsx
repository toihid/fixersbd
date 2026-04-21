"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, AlertTriangle, TrendingUp, CheckCircle, Shield, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleUserAction(userId: string, action: Record<string, any>) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      if (res.ok) toast.success("Updated");
      else toast.error("Failed");
    } catch { toast.error("Error"); }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  if (!data) return null;

  const statCards = [
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Workers", value: data.stats.totalWorkers, icon: Shield, color: "text-green-500" },
    { label: "Jobs Completed", value: data.stats.completedJobs, icon: CheckCircle, color: "text-purple-500" },
    { label: "Pending Complaints", value: data.stats.pendingComplaints, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Workers */}
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Top Workers</h2>
          <div className="space-y-3">
            {data.topWorkers?.map((w: any, i: number) => (
              <div key={w._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="text-xs text-gray-400">{w.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">⭐ {w.rating?.toFixed(1)}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => handleUserAction(w._id, { isVerified: true, verificationLevel: "full" })}>
                    Verify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Categories */}
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Popular Categories</h2>
          <div className="space-y-3">
            {data.categories?.map((c: any) => (
              <div key={c._id} className="flex items-center justify-between">
                <span className="text-sm">{c.name} <span className="text-gray-400">({c.nameBn})</span></span>
                <Badge>{c.workerCount} workers</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Jobs */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">Recent Jobs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Worker</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentJobs?.map((job: any) => (
                  <tr key={job._id} className="border-b dark:border-gray-700 last:border-0">
                    <td className="py-2">{job.customerId?.name || "N/A"}</td>
                    <td className="py-2">{job.workerId?.name || "N/A"}</td>
                    <td className="py-2"><Badge variant={job.status === "completed" ? "success" : "warning"}>{job.status}</Badge></td>
                    <td className="py-2 text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
