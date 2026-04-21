import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDoc extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "job" | "review" | "system" | "verification";
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["job", "review", "system", "verification"], required: true },
    isRead: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotificationDoc>("Notification", NotificationSchema);
