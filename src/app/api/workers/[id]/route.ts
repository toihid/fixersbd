import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Review from "@/models/Review";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const worker = await User.findOne({
      _id: params.id,
      role: "worker",
      isActive: true,
    })
      .select("-password -nidNumber -nidPhoto -favorites")
      .populate("categoryId", "name nameBn icon")
      .lean();

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const reviews = await Review.find({ workerId: params.id, isReported: false })
      .populate("customerId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get similar workers
    const similar = await User.find({
      role: "worker",
      isActive: true,
      categoryId: (worker as any).categoryId?._id || (worker as any).categoryId,
      _id: { $ne: params.id },
    })
      .select("name avatar occupation rating totalReviews hourlyRate location availability isVerified verificationLevel")
      .sort({ rating: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({
      worker: { ...worker, _id: (worker as any)._id.toString() },
      reviews: reviews.map((r: any) => ({
        ...r,
        _id: r._id.toString(),
        customerName: r.customerId?.name,
        customerAvatar: r.customerId?.avatar,
      })),
      similarWorkers: similar.map((w: any) => ({ ...w, _id: w._id.toString() })),
    });
  } catch (error) {
    console.error("Worker detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
