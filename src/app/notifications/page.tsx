"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth-store";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <Bell size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No notifications</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <Card key={n._id} className={`p-4 ${!n.isRead ? "border-l-4 border-l-brand-500" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
                <Badge variant={n.type === "job" ? "info" : n.type === "review" ? "success" : "default"}>{n.type}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
