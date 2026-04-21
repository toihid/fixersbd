import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { detectCategory } from "@/lib/smart-search";
import { calculateDistance } from "@/lib/utils";
import User from "@/models/User";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const verified = searchParams.get("verified") === "true";
    const available = searchParams.get("available") === "true";
    const sortBy = searchParams.get("sortBy") || "rating";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter
    const filter: any = { role: "worker", isActive: true, isBanned: false };

    // Smart category detection
    const detectedCategory = category || detectCategory(query);
    if (detectedCategory) {
      const cat = await Category.findOne({
        name: { $regex: new RegExp(detectedCategory, "i") },
      });
      if (cat) {
        filter.categoryId = cat._id;
      }
    }

    // Text search
    if (query && !detectedCategory) {
      filter.$text = { $search: query };
    }

    if (verified) {
      filter.isVerified = true;
    }

    if (available) {
      filter.availability = "available";
    }

    // Sort
    let sort: any = {};
    switch (sortBy) {
      case "rating":
        sort = { rating: -1, totalReviews: -1 };
        break;
      case "price":
        sort = { hourlyRate: 1 };
        break;
      case "experience":
        sort = { experience: -1 };
        break;
      default:
        sort = { rating: -1 };
    }

    const skip = (page - 1) * limit;
    const [workers, total] = await Promise.all([
      User.find(filter)
        .select("-password -nidNumber -nidPhoto -favorites")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Calculate distances if user location provided
    let results = workers.map((w: any) => {
      const worker = { ...w, _id: w._id.toString() };
      if (lat && lng && w.location?.coordinates?.lat && w.location?.coordinates?.lng) {
        (worker as any).distance = calculateDistance(
          lat,
          lng,
          w.location.coordinates.lat,
          w.location.coordinates.lng
        );
      }
      return worker;
    });

    // Sort by distance if location provided
    if (lat && lng && sortBy === "distance") {
      results.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));
    }

    return NextResponse.json({
      workers: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Workers search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
