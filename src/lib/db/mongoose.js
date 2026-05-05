import mongoose from "mongoose";

let cached =
  typeof globalThis !== "undefined"
    ? globalThis.__toyExchangeMongoose
    : undefined;

if (!cached) {
  cached = /** @type {typeof globalThis & { __toyExchangeMongoose?: typeof cached }} */
    (globalThis).__toyExchangeMongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then(() => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
