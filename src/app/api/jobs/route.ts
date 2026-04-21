import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jobSchema } from "@/lib/validations";
import Job from "@/models/Job";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Please login to hire a worker" }, { status: 401 });
    }
    if (auth.role !== "customer") {
      return NextResponse.json({ error: "Only customers can hire workers" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const worker = await User.findOne({
      _id: parsed.data.workerId,
      role: "worker",
      isActive: true,
    });

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const job = await Job.create({
      customerId: auth.userId,
      workerId: parsed.data.workerId,
      categoryId: worker.categoryId,
      description: parsed.data.description,
      agreedPrice: parsed.data.agreedPrice,
      status: "pending",
    });

    // Notify worker
    await Notification.create({
      userId: parsed.data.workerId,
      title: "New Job Request",
      message: "You have a new job request from a customer.",
      type: "job",
      link: `/dashboard/worker/jobs/${job._id}`,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: any =
      auth.role === "worker"
        ? { workerId: auth.userId }
        : { customerId: auth.userId };

    if (status) filter.status = status;

    const jobs = await Job.find(filter)
      .populate("customerId", "name phone avatar")
      .populate("workerId", "name phone avatar occupation")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
