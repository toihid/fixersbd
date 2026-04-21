export type UserRole = "customer" | "worker" | "admin";
export type JobStatus = "pending" | "deal_final" | "in_progress" | "completed" | "cancelled";
export type Availability = "available" | "busy" | "offline";
export type VerificationLevel = "none" | "basic" | "full" | "trusted_pro";
export type ComplaintType = "fraud" | "harassment" | "fake_profile" | "poor_service" | "other";

export interface Location {
  address: string;
  area?: string;
  city: string;
  coordinates?: { lat: number; lng: number };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location?: Location;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
}

export interface IWorker extends IUser {
  occupation: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  bio?: string;
  availability: Availability;
  categoryId: string;
  nidNumber?: string;
  nidPhoto?: string;
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  featured: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  nameBn: string;
  icon: string;
  description?: string;
  isActive: boolean;
  workerCount: number;
}

export interface IJob {
  _id: string;
  customerId: string;
  workerId: string;
  categoryId: string;
  description?: string;
  agreedPrice?: number;
  status: JobStatus;
  customerName?: string;
  workerName?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface IReview {
  _id: string;
  customerId: string;
  workerId: string;
  jobId: string;
  rating: number;
  comment: string;
  customerName?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface IComplaint {
  _id: string;
  fromUserId: string;
  againstUserId: string;
  jobId?: string;
  reason: string;
  type: ComplaintType;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "job" | "review" | "system" | "verification";
  isRead: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  lat?: number;
  lng?: number;
  distance?: number;
  verified?: boolean;
  available?: boolean;
  sortBy?: "rating" | "distance" | "price" | "experience";
  page?: number;
  limit?: number;
}

export interface SmartSearchMapping {
  keywords: string[];
  category: string;
}
