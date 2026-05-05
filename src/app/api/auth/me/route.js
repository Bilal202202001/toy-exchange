import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUser } from "@/lib/auth/session";
import User from "@/models/User";

export async function GET(request) {
  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  await connectDB();
  const fresh = await User.findById(auth.user._id)
    .select("-passwordHash")
    .lean();

  if (!fresh) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const rel =
    typeof fresh.reliabilityAvg === "number" && Number.isFinite(fresh.reliabilityAvg)
      ? fresh.reliabilityAvg
      : 8;

  return NextResponse.json({
    id: fresh._id.toString(),
    email: fresh.email,
    name: fresh.name,
    username: fresh.username,
    bio: fresh.bio,
    phone: fresh.phone,
    location: fresh.location,
    avatarUrl: fresh.avatarUrl ?? "",
    following: fresh.following ?? 0,
    followers: fresh.followers ?? 0,
    likes: fresh.likes ?? 0,
    reliability: rel,
    reliabilityAvg: fresh.reliabilityAvg,
    reliabilityCount: fresh.reliabilityCount ?? 0,
    exchangesCompleted: fresh.exchangesCompleted ?? 0,
    createdAt: fresh.createdAt,
    updatedAt: fresh.updatedAt,
  });
}
