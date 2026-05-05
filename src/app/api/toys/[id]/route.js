import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import ToyListing from "@/models/ToyListing";
import { serializeToy } from "@/lib/serializeToy";
import { getAuthUser } from "@/lib/auth/session";
import { viewerCanSeeListing } from "@/lib/db/toyVisibility";

const OWNER_FIELDS =
  "name email username avatarUrl location reliabilityAvg exchangesCompleted";

export async function GET(request, context) {
  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  const toy = await ToyListing.findById(id)
    .populate("owner", OWNER_FIELDS)
    .lean();

  if (!toy) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

 
  const own = toy.owner;
  const ownerId = own?._id?.toString?.() ?? "";

  const ok = await viewerCanSeeListing(
    auth.user._id.toString(),
   (own._id),
    !!toy.shareWithAll,
    Array.isArray(toy.contacts) ? toy.contacts : [],
  );

  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ toy: serializeToy(toy) });
}

export async function DELETE(_request, context) {
  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const auth = await getAuthUser(_request);
  if ("response" in auth) return auth.response;

  const toy = await ToyListing.findById(id).select("owner").lean();
  if (!toy) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (String(toy.owner) !== String(auth.user._id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ToyListing.deleteOne({ _id: toy._id });
  return NextResponse.json({ ok: true });
}
