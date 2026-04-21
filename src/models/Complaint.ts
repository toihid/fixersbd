import mongoose, { Schema, Document } from "mongoose";

export interface IComplaintDoc extends Document {
  fromUserId: mongoose.Types.ObjectId;
  againstUserId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  reason: string;
  type: "fraud" | "harassment" | "fake_profile" | "poor_service" | "other";
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  adminNote?: string;
  createdAt: Date;
}

const ComplaintSchema = new Schema<IComplaintDoc>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    againstUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    reason: { type: String, required: true },
    type: {
      type: String,
      enum: ["fraud", "harassment", "fake_profile", "poor_service", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    adminNote: String,
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model<IComplaintDoc>("Complaint", ComplaintSchema);
