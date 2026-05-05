import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUser } from "@/lib/auth/session";

import Friendship from "@/models/Friendship";

import User from "@/models/User";

const MINI =
  "_id name username avatarUrl location reliabilityAvg exchangesCompleted";

function dice(seed) {

  const u = encodeURIComponent(String(seed || "user"));

  return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u;

}


function serializeFriendUser(doc, friendshipId, direction) {

  return {

    friendshipId,

    id: doc._id.toString(),
    name: doc.name || "",

    username: doc.username || "",
    avatarUrl:

      doc.avatarUrl && /^https?:/i.test(doc.avatarUrl)

        ? doc.avatarUrl

        : dice(doc.username),

    location: doc.location || "—",

    direction,

    reliabilityAvg:

      typeof doc.reliabilityAvg === "number" ? doc.reliabilityAvg : null,

  };

}

export async function GET(request) {
  await connectDB();

  const auth = await getAuthUser(request);

  if ("response" in auth) return auth.response;

  const uid = auth.user._id;

  const acceptedDocs = await Friendship.find({

    status: "accepted",

    $or: [{ requester: uid }, { recipient: uid }],

  })

    .populate([

      {

        path: "requester",

        select: MINI,

      },

      {

        path: "recipient",

        select: MINI,

      },

    ])

    .lean();


  const friends = [];

  for (const f of acceptedDocs) {

    const other =
      String(f.requester._id) === String(uid)

        ? f.recipient

        : f.requester;

    friends.push(
      serializeFriendUser(other, String(f._id), "accepted"),

    );

  }

  const inc = await Friendship.find({ recipient: uid, status: "pending" })

    .populate({ path: "requester", select: MINI })

    .lean();


  const incomingFriendRequests = inc.map((r) =>
    serializeFriendUser(r.requester, String(r._id), "incoming"),

  );

  const out = await Friendship.find({ requester: uid, status: "pending" })

    .populate({ path: "recipient", select: MINI })

    .lean();

  const outgoingFriendRequests = out.map((r) =>

    serializeFriendUser(r.recipient, String(r._id), "outgoing"),

  );

  return NextResponse.json({
    friends,

    incomingFriendRequests,

    outgoingFriendRequests,
  });

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

  const username =

    typeof body.username === "string"

      ? body.username.trim().toLowerCase().slice(0, 40)

      : "";

  if (!username)

    return NextResponse.json({ error: "username required" }, { status: 400 });

  const peer = await User.findOne({ username }).select("_id username name").lean();

  if (!peer)

    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (String(peer._id) === String(auth.user._id)) {

    return NextResponse.json({ error: "Cannot friend yourself" }, {

      status: 400,

    });

  }

  try {

    const row = await Friendship.create({

      requester: auth.user._id,

      recipient: peer._id,

      status: "pending",

    });

    await row.populate({ path: "recipient", select: MINI });

    const rpop = (row.toObject());

    return NextResponse.json(

      {

        friendshipId: row._id.toString(),

        user: serializeFriendUser(rpop.recipient, String(row._id), "outgoing"),

      },

      { status: 201 },

    );

  } catch (e) {

    console.error("[friends POST]", e);

    return NextResponse.json(

      {

        error:

          "Could not send request — already pending or you are connected.",

      },

      { status: 409 },

    );

  }

}

