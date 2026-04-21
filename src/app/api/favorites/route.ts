import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(auth.userId)
      .populate(
        "favorites",
        "name avatar occupation rating totalReviews hourlyRate location availability isVerified verificationLevel skills"
      )
      .lean();

    return NextResponse.json({ favorites: (user as any)?.favorites || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { workerId } = await req.json();

    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const index = user.favorites?.indexOf(workerId) ?? -1;
    if (index > -1) {
      user.favorites!.splice(index, 1);
    } else {
      user.favorites = user.favorites || [];
      user.favorites.push(workerId);
    }
    await user.save();

    return NextResponse.json({
      isFavorite: index === -1,
      favorites: user.favorites,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
