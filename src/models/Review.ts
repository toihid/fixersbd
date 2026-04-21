import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDoc extends Document {
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVerified: boolean;
  isReported: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    isVerified: { type: Boolean, default: true },
    isReported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ workerId: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReviewDoc>("Review", ReviewSchema);
