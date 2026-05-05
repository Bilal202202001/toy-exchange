import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";
import { getAuthUser } from "@/lib/auth/session";
import ExchangeProposal from "@/models/ExchangeProposal";
import ToyListing from "@/models/ToyListing";
import User from "@/models/User";

const HANDOFF_VISIBILITY = { shareWithAll: true, contacts: [] };

export async function PATCH(request, context) {
  await connectDB();
  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status =
    body.status === "accepted" || body.status === "declined" ? body.status : null;

  if (!status) {
    return NextResponse.json(
      { error: "status must be accepted or declined" },
      { status: 400 },
    );
  }

  const ex = await ExchangeProposal.findById(id);
  if (!ex) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (ex.status !== "pending") {
    return NextResponse.json({ error: "Request already resolved" }, { status: 409 });
  }

  if (String(ex.recipient) !== String(auth.user._id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (status === "declined") {
    ex.status = "declined";
    await ex.save();
    return NextResponse.json({ ok: true, status: ex.status });
  }

  const locked = await ExchangeProposal.findOneAndUpdate(
    { _id: id, status: "pending", recipient: auth.user._id },
    { $set: { status: "accepted" } },
    { new: true },
  ).exec();

  if (!locked) {
    return NextResponse.json({ error: "Request already resolved" }, { status: 409 });
  }

  const reqSet = {
    owner: locked.proposer,
    ...HANDOFF_VISIBILITY,
  };
  const offSet = {
    owner: locked.recipient,
    ...HANDOFF_VISIBILITY,
  };

  const rReq = await ToyListing.updateOne(
    { _id: locked.requestedListing, owner: locked.recipient },
    { $set: reqSet },
  );
  const rOff = await ToyListing.updateOne(
    { _id: locked.offeredListing, owner: locked.proposer },
    { $set: offSet },
  );

  if (rReq.matchedCount === 1 && rOff.matchedCount === 1) {
    await User.updateOne({ _id: locked.proposer }, { $inc: { exchangesCompleted: 1 } });
    await User.updateOne({ _id: locked.recipient }, { $inc: { exchangesCompleted: 1 } });
    return NextResponse.json({ ok: true, status: "accepted" });
  }

  if (rReq.matchedCount === 1) {
    await ToyListing.updateOne(
      { _id: locked.requestedListing, owner: locked.proposer },
      { $set: { owner: locked.recipient } },
    );
  }
  if (rOff.matchedCount === 1) {
    await ToyListing.updateOne(
      { _id: locked.offeredListing, owner: locked.recipient },
      { $set: { owner: locked.proposer } },
    );
  }

  await ExchangeProposal.updateOne({ _id: id }, { $set: { status: "pending" } });

  return NextResponse.json(
    {
      error:
        "Could not swap toys — listings may have changed or one listing is missing.",
    },
    { status: 409 },
  );
}
