import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { getAuthUser } from "@/lib/auth/session";
import ToyListing from "@/models/ToyListing";
import ExchangeProposal from "@/models/ExchangeProposal";
import { areFriends } from "@/lib/db/friends";

const POP_USER =
  "name username avatarUrl location reliabilityAvg exchangesCompleted";

function diceUrl(seed) {
  const u = encodeURIComponent(String(seed || "user"));
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u;
}

function populateBlocks() {
  return [
    {
      path: "requestedListing",
      populate: { path: "owner", select: POP_USER },
    },
    {
      path: "offeredListing",
      populate: { path: "owner", select: POP_USER },
    },
    { path: "proposer", select: POP_USER },
    { path: "recipient", select: POP_USER },
  ];
}

function proposerIdOf(ex) {
  const p = ex.proposer;
  if (p && typeof p === "object" && "_id" in p) return p._id.toString();
  return String(p);
}

function serializeIncoming(doc, rq, offered, proposerDoc) {
  const p = proposerDoc;
  const r = rq;
  const rel =
    typeof p.reliabilityAvg === "number" && Number.isFinite(p.reliabilityAvg)
      ? p.reliabilityAvg
      : 8;

  return {
    id: doc._id.toString(),
    toyId: r._id.toString(),
    toyTitle: r.title,
    imageUrl: r.imageUrls?.[0] ?? diceUrl(p.username),
    requesterName: p.name || p.username || "Member",
    requesterUsername: p.username || null,
    requesterLocation: p.location || "—",
    requesterRating: rel,
    message: doc.message ?? "",
    requestedAt: doc.createdAt?.toISOString?.()?.slice(0, 10) ?? "",
    status: doc.status,
  };
}

function serializeOutgoing(doc, rq, _offered, sellerDoc) {
  const s = sellerDoc;
  const r = rq;

  return {
    id: doc._id.toString(),
    toyId: r._id.toString(),
    toyTitle: r.title,
    imageUrl: r.imageUrls?.[0] ?? diceUrl(s.username),
    sellerName: s.name || s.username || "Member",
    sellerUsername: s.username || null,
    sellerLocation: s.location || "—",
    message: doc.message ?? "",
    requestedAt: doc.createdAt?.toISOString?.()?.slice(0, 10) ?? "",
    status: doc.status,
  };
}

function serializeCompletedRow(ex, mine) {
  const rq = ex.requestedListing;
  const pid = proposerIdOf(ex);
  const pd = pid === mine ? ex.recipient : ex.proposer;
  return {
    id: ex._id.toString(),
    toyId: rq._id.toString(),
    toyTitle: rq.title,
    imageUrl: rq.imageUrls?.[0] ?? diceUrl(pd.username),
    partnerName: pd.name || pd.username || "Member",
    partnerUsername: pd.username ?? null,
    exchangeId: ex._id.toString(),
    partnerUserId: pd._id?.toString?.() ?? null,
  };
}

export async function GET(request) {
  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  const me = auth.user._id;

  const mine = me.toString();

  const pop = populateBlocks();

  const rowsIn = await ExchangeProposal.find({ recipient: me })
    .sort({ createdAt: -1 })

    .populate(pop)

    .lean();

  const incoming = [];

  for (const doc of rowsIn) {

    const rq = doc.requestedListing;

    const offered = doc.offeredListing;

    const pd = doc.proposer;

    if (!rq || !offered || !pd) continue;

    incoming.push(serializeIncoming(doc, rq, offered, pd));

  }

  const rowsOut = await ExchangeProposal.find({ proposer: me })

    .sort({ createdAt: -1 })

    .populate(pop)

    .lean();

  const outgoing = [];

  for (const doc of rowsOut) {

    const rq = doc.requestedListing;

    const offered = doc.offeredListing;

    const sd = doc.recipient;

    if (!rq || !offered || !sd) continue;

    outgoing.push(serializeOutgoing(doc, rq, offered, sd));

  }

  const done = await ExchangeProposal.find({

    status: "accepted",

    $or: [{ recipient: me }, { proposer: me }],

  })

    .sort({ updatedAt: -1 })

    .populate(pop)

    .lean();

  const completed = [];

  for (const ex of done) {

    const rq = ex.requestedListing;

    const off = ex.offeredListing;

    if (!rq || !off) continue;

    completed.push(serializeCompletedRow(ex, mine));

  }

  return NextResponse.json({ incoming, outgoing, completed });

}

export async function POST(request) {

  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  let body;

  try {

    body = await request.json();

  } catch {

    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  }

  const requestedToyId =

    typeof body.requestedToyListingId === "string"

      ? body.requestedToyListingId

      : "";

  const offeredToyId =

    typeof body.offeredToyListingId === "string"

      ? body.offeredToyListingId

      : "";

  const message =

    typeof body.message === "string"

      ? body.message.trim().slice(0, 2000)

      : "";

  if (

    !mongoose.isValidObjectId(requestedToyId) ||

    !mongoose.isValidObjectId(offeredToyId)

  ) {

    return NextResponse.json({ error: "Invalid listing ids" }, { status: 400 });

  }

  const requested = await ToyListing.findById(requestedToyId)

    .select("owner")

    .lean();

  const offered = await ToyListing.findById(offeredToyId).select("owner").lean();

  if (!requested || !offered) {

    return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  }

  const recipientId = requested.owner;

  const proposerId = auth.user._id;

  if (String(recipientId) === String(proposerId)) {

    return NextResponse.json({ error: "Cannot request your own listing" }, {

      status: 400,

    });

  }

  if (String(offered.owner) !== String(proposerId)) {

    return NextResponse.json({ error: "Offered toy must belong to you" }, {

      status: 403,

    });

  }

  if (!(await areFriends(proposerId, recipientId))) {

    return NextResponse.json(

      { error: "You can only exchange with accepted friends" },

      { status: 403 },

    );

  }

  const created = await ExchangeProposal.create({

    proposer: proposerId,

    recipient: recipientId,

    requestedListing: requestedToyId,

    offeredListing: offeredToyId,

    message,

  });

  await created.populate(populateBlocks());

  const d = created.toObject();

  const rq = d.requestedListing;

  const offeredPop = d.offeredListing;

  const pd = d.proposer;

  if (!rq || !offeredPop || !pd)

    return NextResponse.json({ error: "Could not complete" }, { status: 500 });

  return NextResponse.json(

    { exchange: serializeIncoming(d, rq, offeredPop, pd) },

    { status: 201 },

  );

}

