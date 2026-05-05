

import { NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";

import User from "@/models/User";

import ToyListing from "@/models/ToyListing";

import { getAuthUser } from "@/lib/auth/session";

import { slugifyUsername } from "@/lib/profile";

import { serializeToy } from "@/lib/serializeToy";

import { viewerCanSeeListing } from "@/lib/db/toyVisibility";

const OWN =

  "name email username avatarUrl location reliabilityAvg exchangesCompleted";

export async function GET(request, ctx) {

  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  const { username } = await ctx.params;

  const uname = slugifyUsername(String(username || ""));

  if (!uname)

    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const peer = await User.findOne({ username: uname })

    .select("-passwordHash")

    .lean();

  if (!peer)

    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = auth.user._id;

  const mine = peer._id.toString() === me.toString();

  const toyRows = await ToyListing.find({ owner: peer._id })

    .populate("owner", OWN)

    .lean();

  /** @type {any[]} */

  const listings = [];

  for (const row of toyRows) {

    const ok =
      mine ||

      (await viewerCanSeeListing(
        me,
        typeof row.owner === "object" ? row.owner._id : row.owner,
        !!row.shareWithAll,
        Array.isArray(row.contacts) ? row.contacts : [],
      ));

    if (!ok) continue;

    listings.push(serializeToy(row));

  }


  const p = peer;

  const rel =
    typeof p.reliabilityAvg === "number" && Number.isFinite(p.reliabilityAvg)

      ? p.reliabilityAvg

      : 8;

  const profilePayload = {

    id: String(p._id),

    displayName: p.name || p.username,

    username: p.username,

    bio: p.bio || "",

    location: p.location || "",

    email: mine ? p.email : "",

    avatarUrl:

      p.avatarUrl ||

      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.username)}`,

    phone: mine ? (p.phone || "") : "",
    following: p.following ?? 0,

    followers: p.followers ?? 0,

    likes: p.likes ?? 0,

    reliability: rel,

    reliabilityAvg: p.reliabilityAvg ?? null,

    exchangesCompleted: p.exchangesCompleted ?? 0,

  };

  return NextResponse.json({

    profile: profilePayload,

    listings,

    isSelf: mine,

  });

}

