import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "", trim: true, maxlength: 120 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 32,
      match: /^[a-z0-9_]+$/,
    },
    avatarUrl: { type: String, default: "", trim: true, maxlength: 2048 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    location: { type: String, default: "", trim: true, maxlength: 240 },
    bio: { type: String, default: "", trim: true, maxlength: 2000 },
    following: { type: Number, default: 0, min: 0 },
    followers: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    reliabilityAvg: { type: Number, default: null, min: 1, max: 10 },
    reliabilityCount: { type: Number, default: 0, min: 0 },
    exchangesCompleted: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
