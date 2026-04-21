import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
