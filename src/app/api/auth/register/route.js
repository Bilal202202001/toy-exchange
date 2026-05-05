import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import User from "@/models/User";
import { ensureUniqueUsername } from "@/lib/ensureUsername";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const location =
    typeof body.location === "string" ? body.location.trim().slice(0, 240) : "";
  const avatarUrl =
    typeof body.avatarUrl === "string"
      ? body.avatarUrl.trim().slice(0, 2048)
      : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const username = await ensureUniqueUsername(name || email, email);

    const user = await User.create({
      email,
      passwordHash,
      name: name || "",
      username,
      phone,
      location,
      avatarUrl: avatarUrl || "",
    });

    const token = signToken({ userId: user._id.toString() });

    return NextResponse.json(
      {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
