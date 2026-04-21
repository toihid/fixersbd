import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import Review from "@/models/Review";
import Job from "@/models/Job";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { rating, comment, jobId, workerId } = parsed.data;

    // Verify job is completed and belongs to this customer
    const job = await Job.findOne({
      _id: jobId,
      customerId: auth.userId,
      workerId,
      status: "completed",
    });

    if (!job) {
      return NextResponse.json(
        { error: "Can only review completed jobs" },
        { status: 400 }
      );
    }

    // Check if already reviewed
    const existing = await Review.findOne({ jobId });
    if (existing) {
      return NextResponse.json(
        { error: "Already reviewed this job" },
        { status: 409 }
      );
    }

    const review = await Review.create({
      customerId: auth.userId,
      workerId,
      jobId,
      rating,
      comment,
    });

    // Update worker rating
    const allReviews = await Review.find({ workerId, isReported: false });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(workerId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    // Notify worker
    await Notification.create({
      userId: workerId,
      title: "New Review",
      message: `You received a ${rating}-star review.`,
      type: "review",
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
