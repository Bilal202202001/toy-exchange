import mongoose from "mongoose";

const exchangeProposalSchema = new mongoose.Schema(
  {
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToyListing",
      required: true,
    },
    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToyListing",
      required: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

exchangeProposalSchema.index({
  requestedListing: 1,
  proposer: 1,
  status: 1,
});

export default mongoose.models.ExchangeProposal ||
  mongoose.model("ExchangeProposal", exchangeProposalSchema);
