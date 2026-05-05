import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth/session";
import { slugifyUsername } from "@/lib/profile";

export async function PATCH(request) {
  await connectDB();
  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });

  }


  const user = await User.findById(auth.user._id);

  if (!user)

    return NextResponse.json({ error: "User not found" }, { status: 404 });


  const u = user;

  if (typeof body.name === "string")

    u.name = body.name.trim().slice(0, 120);

  if (typeof body.bio === "string")

    u.bio = body.bio.trim().slice(0, 2000);

  if (typeof body.location === "string")

    u.location = body.location.trim().slice(0, 240);

  if (typeof body.phone === "string")

    u.phone = body.phone.trim().slice(0, 40);

  if (typeof body.avatarUrl === "string")

    u.avatarUrl = body.avatarUrl.trim().slice(0, 2048);

  if (typeof body.following === "number")

    u.following = Math.max(0, Math.round(body.following));

  if (typeof body.followers === "number")

    u.followers = Math.max(0, Math.round(body.followers));

  if (typeof body.likes === "number")

    u.likes = Math.max(0, Math.round(body.likes));

  if (typeof body.username === "string") {

    const cand = slugifyUsername(body.username);

    if (!cand)

      return NextResponse.json({ error: "Invalid username" }, { status: 400 });

    const clash = await User.findOne({ username: cand, _id: { $ne: u._id } })

      .select("_id")

      .lean();

    if (clash)

      return NextResponse.json({ error: "Username taken" }, { status: 409 });

    u.username = cand;

  }

  if (typeof body.email === "string") {

    const mail = body.email.trim().toLowerCase();

    const clash = await User.findOne({ email: mail, _id: { $ne: u._id } })

      .select("_id")

      .lean();

    if (clash)

      return NextResponse.json({ error: "Email in use" }, { status: 409 });

    u.email = mail;

  }

  await u.save();


  const f = await User.findById(u._id).select("-passwordHash").lean();

  const rel =

    typeof f.reliabilityAvg === "number" && Number.isFinite(f.reliabilityAvg)

      ? f.reliabilityAvg

      : 8;

  return NextResponse.json({

    id: f._id.toString(),

    email: f.email,

    name: f.name,

    username: f.username,

    bio: f.bio,

    phone: f.phone,

    location: f.location,

    avatarUrl: f.avatarUrl || "",

    following: f.following ?? 0,

    followers: f.followers ?? 0,

    likes: f.likes ?? 0,

    reliability: rel,

    reliabilityAvg: f.reliabilityAvg ?? null,

    exchangesCompleted: f.exchangesCompleted ?? 0,

    createdAt: f.createdAt,

    updatedAt: f.updatedAt,

  });

}

