import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { getAuthUser } from "@/lib/auth/session";
import ToyListing from "@/models/ToyListing";
import { serializeToy } from "@/lib/serializeToy";
import { getFriendUserIds } from "@/lib/db/friends";

const OWNER_FIELDS =
  "name email username avatarUrl location reliabilityAvg exchangesCompleted";

function parseMine(url) {
  const v = url.searchParams.get("mine");
  return v === "1" || v === "true";
}

function viewerMaySeeFriendsToy(viewerId, ownerIdStr, toy) {
  if (viewerId === ownerIdStr) return true;
  if (toy.shareWithAll) return true;
  return toy.contacts.some((cId) => String(cId) === viewerId);
}

export async function GET(request) {
  await connectDB();

  const mine = parseMine(new URL(request.url));
  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  const viewerId = auth.user._id.toString();

  if (!mine) {
    const friendIds = await getFriendUserIds(auth.user._id);
    if (friendIds.length === 0) {
      return NextResponse.json({ toys: [] });
    }

    const items = await ToyListing.find({ owner: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .limit(80)
      .populate("owner", OWNER_FIELDS)
      .lean();

    const friendSet = new Set(friendIds.map((id) => id.toString()));
    const filtered = [];

    for (const row of items) {
      if (!(row.owner && typeof row.owner === "object" && "_id" in row.owner))
        continue;
      /** @type {any} */
      const own = row.owner;
      const ownerMongoStr = own._id.toString();
      if (!friendSet.has(ownerMongoStr)) continue;

      const toyContacts = Array.isArray(row.contacts) ? row.contacts : [];
      if (
        !viewerMaySeeFriendsToy(viewerId, ownerMongoStr, {
          shareWithAll: !!row.shareWithAll,
          contacts: toyContacts,
        })
      ) {
        continue;
      }

      filtered.push(serializeToy(row));
    }

    return NextResponse.json({ toys: filtered });
  }

  const items = await ToyListing.find({ owner: auth.user._id })
    .sort({ createdAt: -1 })
    .limit(80)
    .populate("owner", OWNER_FIELDS)
    .lean();

  return NextResponse.json({ toys: items.map(serializeToy) });
}

export async function POST(request) {
  await connectDB();
  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter((u) => typeof u === "string" && u.length > 0)
    : [];

  if (!title || !category) {
    return NextResponse.json(
      { error: "title and category are required" },
      { status: 400 },
    );
  }

  if (imageUrls.length === 0) {
    return NextResponse.json(
      {
        error: "imageUrls must include at least one URL (upload images first)",
      },
      { status: 400 },
    );
  }

  const conditionRaw = body.condition;
  const condition =
    typeof conditionRaw === "number" && !Number.isNaN(conditionRaw)
      ? Math.min(10, Math.max(1, Math.round(conditionRaw)))
      : 8;

  const ageRange =
    typeof body.ageRange === "string" ? body.ageRange.trim().slice(0, 80) : "";
  const description =
    typeof body.description === "string"
      ? body.description.trim().slice(0, 4000)
      : "";
  const estimatedWorth =
    typeof body.estimatedWorth === "string"
      ? body.estimatedWorth.trim().slice(0, 64)
      : "";
  const exchangeFor =
    typeof body.exchangeFor === "string"
      ? body.exchangeFor.trim().slice(0, 64)
      : "";

  const shareWithAll =
    typeof body.shareWithAll === "boolean" ? body.shareWithAll : true;
  const contactsInput = Array.isArray(body.contacts)
    ? body.contacts
        .filter((c) => typeof c === "string" && mongoose.isValidObjectId(c))
        .map((c) => new mongoose.Types.ObjectId(c))
        .slice(0, 32)
    : [];

  if (!shareWithAll && contactsInput.length === 0) {
    return NextResponse.json(
      {
        error:
          "When limiting visibility to specific friends, choose at least one contact (friend).",
      },
      { status: 400 },
    );
  }

  const friendIdsArr = await getFriendUserIds(auth.user._id);
  const allowed = new Set(friendIdsArr.map((id) => id.toString()));
  const contactsClean = [];
  for (const cid of contactsInput) {
    if (allowed.has(cid.toString())) contactsClean.push(cid);
  }

  if (!shareWithAll && contactsClean.length === 0) {
    return NextResponse.json(
      { error: "Selected contacts must be accepted friends." },
      { status: 400 },
    );
  }

  try {
    const created = await ToyListing.create({
      owner: auth.user._id,
      title,
      category,
      condition,
      ageRange,
      description,
      estimatedWorth,
      exchangeFor,
      imageUrls,
      shareWithAll,
      contacts: shareWithAll ? [] : contactsClean,
    });

    await created.populate("owner", OWNER_FIELDS);
    return NextResponse.json(
      { toy: serializeToy(created.toObject()) },
      { status: 201 },
    );
  } catch (err) {
    console.error("[toys POST]", err);
    return NextResponse.json(
      { error: "Could not create listing" },
      { status: 500 },
    );
  }
}
