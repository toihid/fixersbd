import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+880|0)1[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "worker"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const workerProfileSchema = z.object({
  occupation: z.string().min(2, "Occupation is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.number().min(0, "Experience must be positive"),
  hourlyRate: z.number().min(0, "Rate must be positive"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  availability: z.enum(["available", "busy", "offline"]),
  categoryId: z.string().min(1, "Category is required"),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    area: z.string().optional(),
    city: z.string().min(1, "City is required"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters").max(500),
  jobId: z.string(),
  workerId: z.string(),
});

export const jobSchema = z.object({
  workerId: z.string(),
  description: z.string().optional(),
  agreedPrice: z.number().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  nameBn: z.string().min(2),
  icon: z.string(),
  description: z.string().optional(),
});

export const complaintSchema = z.object({
  againstUserId: z.string(),
  jobId: z.string().optional(),
  reason: z.string().min(10, "Please describe the issue in detail"),
  type: z.enum(["fraud", "harassment", "fake_profile", "poor_service", "other"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
