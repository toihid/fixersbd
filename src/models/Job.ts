import mongoose, { Schema, Document } from "mongoose";

export interface IJobDoc extends Document {
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  agreedPrice?: number;
  status: "pending" | "deal_final" | "in_progress" | "completed" | "cancelled";
  completedAt?: Date;
  createdAt: Date;
}

const JobSchema = new Schema<IJobDoc>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    description: String,
    agreedPrice: Number,
    status: {
      type: String,
      enum: ["pending", "deal_final", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    completedAt: Date,
  },
  { timestamps: true }
);

JobSchema.index({ customerId: 1, status: 1 });
JobSchema.index({ workerId: 1, status: 1 });

export default mongoose.models.Job || mongoose.model<IJobDoc>("Job", JobSchema);
