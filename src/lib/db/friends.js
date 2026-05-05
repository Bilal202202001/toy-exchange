import mongoose from "mongoose";
import Friendship from "@/models/Friendship";

/**
 * @param {mongoose.Types.ObjectId | string} userId
 */
export async function getFriendUserIds(userId) {
  const uid =
    typeof userId === "string"
      ? new mongoose.Types.ObjectId(userId)
      : userId;
  const mine = String(uid);

  const rows = await Friendship.find({
    status: "accepted",
    $or: [{ requester: uid }, { recipient: uid }],
  })
    .select("requester recipient")
    .lean();

  const ids = rows.map((r) =>
    String(r.requester) === mine ? String(r.recipient) : String(r.requester),
  ).filter((id) => id !== mine);

  return [...new Set(ids)].map((s) => new mongoose.Types.ObjectId(s));
}

/**
 * Bi-directional accepted friendship checks.
 */
export async function areFriends(aId, bId) {
  const a =
    typeof aId === "string" ? new mongoose.Types.ObjectId(aId) : aId;
  const b =
    typeof bId === "string" ? new mongoose.Types.ObjectId(bId) : bId;

  const row = await Friendship.findOne({
    status: "accepted",
    $or: [
      { requester: a, recipient: b },
      { requester: b, recipient: a },
    ],
  })
    .select("_id")
    .lean();

  return Boolean(row);
}
