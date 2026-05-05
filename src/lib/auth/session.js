import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/models/User";

/**
 * Validates Bearer JWT and loads the user (without password hash).
 * @param {Request} request
 * @returns {Promise<{ user: object } | { response: NextResponse }>}
 */
export async function getAuthUser(request) {
  const header = request.headers.get("authorization");
  const token =
    header?.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token) {
    return {
      response: NextResponse.json(
        { error: "Authorization Bearer token required" },
        { status: 401 },
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload || typeof payload !== "object" || !("userId" in payload)) {
    return {
      response: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
    };
  }

  await connectDB();
  const user = await User.findById(
    /** @type {{ userId: string }} */ (payload).userId,
  )
    .select("-passwordHash")
    .lean();

  if (!user) {
    return {
      response: NextResponse.json({ error: "User not found" }, { status: 401 }),
    };
  }

  return { user };
}
