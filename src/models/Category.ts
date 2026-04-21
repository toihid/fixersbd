import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  description?: string;
  isActive: boolean;
  workerCount: number;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    nameBn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    workerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
  next();
});

export default mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
