import { NextResponse } from "next/server";

import mongoose from "mongoose";
import connectDB from "@/lib/db/mongoose";

import Friendship from "@/models/Friendship";

import { getAuthUser } from "@/lib/auth/session";

export async function PATCH(request, context) {

  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id))

    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  let body;

  try {

    body = await request.json();

  } catch {

    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });

  }

  const action =

    body.action === "accept" || body.action === "reject"

      ? body.action

      : null;

  if (!action)

    return NextResponse.json({ error: "action accept|reject" }, {

      status: 400,

    });

  const f = await Friendship.findById(id);

  if (!f || f.status !== "pending")

    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (String(f.recipient) !== String(auth.user._id))

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (action === "accept")

    f.status = "accepted";

  else

    f.status = "rejected";

  await f.save();

  return NextResponse.json({ ok: true, status: f.status });

}

