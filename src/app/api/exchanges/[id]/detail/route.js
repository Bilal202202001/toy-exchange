import { NextResponse } from "next/server";

import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";

import ExchangeProposal from "@/models/ExchangeProposal";

import { getAuthUser } from "@/lib/auth/session";

import { estimatedWorthToUsd } from "@/lib/parseUsd";

const POP_USER =
  "name username avatarUrl location reliabilityAvg exchangesCompleted";

function diceUrl(seed) {
  const u = encodeURIComponent(String(seed || "user"));

  return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u;

}

function condLabel(condition) {

  const c = Number(condition);

  if (Number.isFinite(c))

    return Math.min(10, Math.max(1, Math.round(c))) + "/10";

  return "8/10";

}

function toyMini(toy) {

  if (!toy) return null;

  const id = toy._id.toString();

  const img =
    Array.isArray(toy.imageUrls) && toy.imageUrls[0]

      ? toy.imageUrls[0]

      : diceUrl(id);

  return {

    toyId: id,

    title: toy.title,

    imageUrl: img,

    conditionLabel: condLabel(toy.condition),

    estValueUsd: estimatedWorthToUsd(toy.estimatedWorth),

  };

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

export async function GET(_request, context) {

  await connectDB();

  const auth = await getAuthUser(_request);

  if ("response" in auth) return auth.response;

  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id)) {

    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  }

  const doc = await ExchangeProposal.findById(id)

    .populate(populateBlocks())

    .lean();

  if (!doc)

    return NextResponse.json({ error: "Not found" }, { status: 404 });

  /** @type {any} */

  const me = auth.user._id.toString();

  const propId =

    typeof doc.proposer === "object" && doc.proposer?._id

      ? doc.proposer._id.toString()

      : String(doc.proposer);

  const recId =

    typeof doc.recipient === "object" && doc.recipient?._id

      ? doc.recipient._id.toString()

      : String(doc.recipient);

  if (me !== propId && me !== recId)

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  /** @type {any} */

  const rq = doc.requestedListing;

  /** @type {any} */

  const of = doc.offeredListing;

  /** @type {any} */

  const proposer = doc.proposer;

  if (!rq || !of || !proposer)

    return NextResponse.json({ error: "Incomplete exchange" }, { status: 500 });

  const rel =

    typeof proposer.reliabilityAvg === "number" &&

    Number.isFinite(proposer.reliabilityAvg)

      ? proposer.reliabilityAvg

      : 8;

  const partnerAvatar =
    proposer.avatarUrl && /^https?:/i.test(proposer.avatarUrl)

      ? proposer.avatarUrl

      : diceUrl(proposer.username);

  const offerCard = toyMini(of);

  const yourCard = toyMini(rq);

  if (!offerCard || !yourCard)

    return NextResponse.json({ error: "Incomplete" }, { status: 500 });

  const totalRequestUsd = estimatedWorthToUsd(rq.estimatedWorth);

  const totalOfferUsd = estimatedWorthToUsd(of.estimatedWorth);

  const requestedAtIso =

    doc.createdAt?.toISOString?.()?.slice(0, 10) ?? "";

  const payload = {

    id: doc._id.toString(),

    toyId: rq._id.toString(),
    toyTitle: rq.title,

    imageUrl: rq.imageUrls?.[0] ?? diceUrl(proposer.username),

    requesterName: proposer.name || proposer.username || "Member",

    requesterUsername: proposer.username || null,

    requesterLocation: proposer.location || "—",

    requesterRating: rel,

    message: doc.message ?? "",

    requestedAt: requestedAtIso,

    status: doc.status,

    partnerOfferedToys: [offerCard],

    yourOfferToy: {

      ...yourCard,

      toyId: rq._id.toString(),
    },

    partnerDetail: {

      name: proposer.name || proposer.username,

      avatarUrl: partnerAvatar,

      location: proposer.location || "—",

      username: proposer.username ?? null,

      tradesCount: Number(proposer.exchangesCompleted ?? 12),

      ratingDisplay: Number(rel),

    },

    totalRequestValueUsd: totalRequestUsd,

    totalOfferValueUsd: totalOfferUsd,

  };

  return NextResponse.json(payload);

}

