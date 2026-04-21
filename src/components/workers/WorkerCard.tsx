"use client";
import Link from "next/link";
import { MapPin, Star, CheckCircle, Phone, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, getInitials } from "@/lib/utils";
import type { IWorker } from "@/types";

interface WorkerCardProps {
  worker: IWorker;
  distance?: number;
}

export function WorkerCard({ worker, distance }: WorkerCardProps) {
  const verificationBadge = {
    none: null,
    basic: { label: "Verified", variant: "info" as const },
    full: { label: "Fully Verified", variant: "verified" as const },
    trusted_pro: { label: "Trusted Pro", variant: "success" as const },
  };

  const badge = verificationBadge[worker.verificationLevel];

  return (
    <Link href={`/workers/${worker._id}`}>
      <Card hover className="p-4 h-full">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {worker.avatar ? (
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <span className="text-brand-600 font-semibold text-lg">
                  {getInitials(worker.name)}
                </span>
              </div>
            )}
            {worker.availability === "available" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {worker.name}
              </h3>
              {worker.isVerified && (
                <CheckCircle size={14} className="text-brand-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {worker.occupation}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">
                ({worker.totalReviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          {worker.hourlyRate > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-brand-600">
                ৳{worker.hourlyRate}
              </p>
              <p className="text-xs text-gray-400">/hour</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          {worker.availability === "available" && (
            <Badge variant="success">
              <Clock size={10} /> Available Now
            </Badge>
          )}
          {distance !== undefined && (
            <Badge>
              <MapPin size={10} /> {distance.toFixed(1)} km
            </Badge>
          )}
        </div>

        {/* Skills */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {worker.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="text-xs text-gray-400">
                +{worker.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Location */}
        {worker.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} />
            <span className="truncate">
              {worker.location.area || worker.location.city}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
