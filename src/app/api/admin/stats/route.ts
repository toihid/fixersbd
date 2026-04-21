import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";
import Job from "@/models/Job";
import Complaint from "@/models/Complaint";
import Category from "@/models/Category";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const [
      totalUsers,
      totalWorkers,
      totalCustomers,
      totalJobs,
      completedJobs,
      pendingComplaints,
      categories,
      topWorkers,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "worker", isActive: true }),
      User.countDocuments({ role: "customer", isActive: true }),
      Job.countDocuments(),
      Job.countDocuments({ status: "completed" }),
      Complaint.countDocuments({ status: "pending" }),
      Category.find({ isActive: true }).sort({ workerCount: -1 }).limit(10).lean(),
      User.find({ role: "worker", isActive: true })
        .sort({ rating: -1, completedJobs: -1 })
        .limit(10)
        .select("name avatar occupation rating completedJobs verificationLevel")
        .lean(),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("customerId", "name")
        .populate("workerId", "name")
        .lean(),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalWorkers,
        totalCustomers,
        totalJobs,
        completedJobs,
        pendingComplaints,
      },
      categories,
      topWorkers,
      recentJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
