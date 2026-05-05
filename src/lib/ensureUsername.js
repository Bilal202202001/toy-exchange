import crypto from "crypto";
import User from "@/models/User";
import { slugifyUsername } from "@/lib/profile";

export async function ensureUniqueUsername(displayName, email) {
  let base =
    slugifyUsername(String(displayName || "").trim()).replace(/^_+/u, "") ||
    slugifyUsername(String(email || "").split("@")[0] || "");
  if (!base) base = "member";

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const candidate =
      attempt === 0 ? base : `${base}_${crypto.randomBytes(2).toString("hex")}`;
    const exists = await User.exists({ username: candidate });
    if (!exists) return candidate;
  }

  return `${base}_${crypto.randomBytes(8).toString("hex")}`;
}
