import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Job from "@/models/Job";
import User from "@/models/User";
import Notification from "@/models/Notification";

const validTransitions: Record<string, string[]> = {
  pending: ["deal_final", "cancelled"],
  deal_final: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { status } = await req.json();

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify user is part of this job
    const isCustomer = job.customerId.toString() === auth.userId;
    const isWorker = job.workerId.toString() === auth.userId;
    if (!isCustomer && !isWorker && auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Validate transition
    const allowed = validTransitions[job.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${job.status} to ${status}` },
        { status: 400 }
      );
    }

    job.status = status;
    if (status === "completed") {
      job.completedAt = new Date();
      // Update worker stats
      await User.findByIdAndUpdate(job.workerId, {
        $inc: { completedJobs: 1 },
      });
    }
    await job.save();

    // Notify the other party
    const notifyUserId = isCustomer
      ? job.workerId.toString()
      : job.customerId.toString();
    await Notification.create({
      userId: notifyUserId,
      title: "Job Status Updated",
      message: `Job status changed to ${status.replace("_", " ")}`,
      type: "job",
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Update job status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
