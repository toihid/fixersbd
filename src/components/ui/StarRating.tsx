"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onChange?.(i + 1)}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110"
          )}
          disabled={!interactive}
          aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={cn(
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            )}
          />
        </button>
      ))}
    </div>
  );
}
