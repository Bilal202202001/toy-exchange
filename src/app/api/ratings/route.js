

import { NextResponse } from "next/server";

import mongoose from "mongoose";

import connectDB from "@/lib/db/mongoose";

import { getAuthUser } from "@/lib/auth/session";

import ExchangeProposal from "@/models/ExchangeProposal";

import ReputationVote from "@/models/ReputationVote";

import { recomputeUserReliability } from "@/lib/db/recomputeReliability";

export async function POST(request) {

  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  let body;

  try {

    body = await request.json();

  } catch {

    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });

  }

  const exchangeId =
    typeof body.exchangeId === "string" ? body.exchangeId : "";

  const ratedUserId =
    typeof body.ratedUserId === "string" ? body.ratedUserId : "";

  const scoreRaw = Number(body.score);

  const score =

    Number.isFinite(scoreRaw) ? Math.round(scoreRaw) : NaN;

  if (!mongoose.isValidObjectId(exchangeId) || !mongoose.isValidObjectId(ratedUserId))

    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });

  if (score < 1 || score > 10)

    return NextResponse.json({ error: "score 1-10" }, { status: 400 });

  const exch = await ExchangeProposal.findOne({

    _id: exchangeId,

    status: "accepted",

  }).lean();

  if (!exch)

    return NextResponse.json({ error: "Exchange not found" }, {

      status: 404,

    });

  const raterId = auth.user._id;

  const prop = exch.proposer.toString();

  const rec = exch.recipient.toString();

  const mine = raterId.toString();

  if (mine !== prop && mine !== rec)

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rated = ratedUserId;

  if (rated !== prop && rated !== rec)

    return NextResponse.json({ error: "Invalid rated user" }, {

      status: 400,

    });

  if (rated === mine)

    return NextResponse.json({ error: "Cannot rate yourself" }, {

      status: 400,

    });

  try {

    await ReputationVote.create({

      exchange: exchangeId,

      rater: mine,

      ratedUser: rated,

      score,

    });

    await recomputeUserReliability(rated);

    return NextResponse.json({ ok: true });

  } catch (e) {

    console.error("[ratings]", e);

    return NextResponse.json(

      {

        error:

          "Rating already submitted for this swap or duplicate vote.",

      },

      { status: 409 },

    );

  }

}

