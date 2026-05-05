import mongoose from "mongoose";

const toyListingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true, maxlength: 64 },
    condition: {
      type: Number,
      min: 1,
      max: 10,
      default: 8,
    },
    ageRange: { type: String, default: "", trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 4000 },
    estimatedWorth: { type: String, default: "", trim: true, maxlength: 64 },
    exchangeFor: { type: String, default: "", trim: true, maxlength: 64 },
    imageUrls: {
      type: [String],
      default: [],
      validate: [(v) => Array.isArray(v) && v.length > 0, "At least one image URL"],
    },
    shareWithAll: { type: Boolean, default: true },
    contacts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true },
);

toyListingSchema.index({ category: 1, createdAt: -1 });

export default mongoose.models.ToyListing ||
  mongoose.model("ToyListing", toyListingSchema);
