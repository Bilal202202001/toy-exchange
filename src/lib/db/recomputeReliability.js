import mongoose from "mongoose";
import User from "@/models/User";
import ReputationVote from "@/models/ReputationVote";

/**
 * @param {import('mongoose').Types.ObjectId | string} userId
 */
export async function recomputeUserReliability(userId) {
  const uid =
    typeof userId === "string"
      ? new mongoose.Types.ObjectId(userId)
      : userId;

  const agg = await ReputationVote.aggregate([
    { $match: { ratedUser: uid } },
    {
      $group: {
        _id: "$ratedUser",
        avg: { $avg: "$score" },
        count: { $sum: 1 },
      },
    },
  ]);

  const row = agg[0];
  if (!row) {
    await User.updateOne(
      { _id: uid },
      { reliabilityAvg: null, reliabilityCount: 0 },
    );
    return;
  }

  await User.updateOne(
    { _id: uid },
    {
      reliabilityAvg: Number(row.avg.toFixed(2)),
      reliabilityCount: row.count,
    },
  );
}
