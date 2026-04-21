import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "worker" | "admin";
  avatar?: string;
  location?: {
    address: string;
    area?: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  isActive: boolean;
  isBanned: boolean;
  // Worker-specific fields
  occupation?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  availability?: "available" | "busy" | "offline";
  categoryId?: mongoose.Types.ObjectId;
  nidNumber?: string;
  nidPhoto?: string;
  verificationLevel: "none" | "basic" | "full" | "trusted_pro";
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  featured: boolean;
  favorites?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
    avatar: String,
    location: {
      address: String,
      area: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    // Worker fields
    occupation: String,
    skills: [String],
    experience: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    bio: String,
    availability: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    nidNumber: String,
    nidPhoto: String,
    verificationLevel: {
      type: String,
      enum: ["none", "basic", "full", "trusted_pro"],
      default: "none",
    },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    favorites: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ "location.coordinates.lat": 1, "location.coordinates.lng": 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ categoryId: 1, availability: 1 });
UserSchema.index({ name: "text", occupation: "text", skills: "text", bio: "text" });

export default mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
