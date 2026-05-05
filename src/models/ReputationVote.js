import mongoose from "mongoose";

const reputationVoteSchema = new mongoose.Schema(
  {
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeProposal",
      required: true,
      index: true,
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true },
);

reputationVoteSchema.index({ exchange: 1, rater: 1 }, { unique: true });

export default mongoose.models.ReputationVote ||
  mongoose.model("ReputationVote", reputationVoteSchema);
