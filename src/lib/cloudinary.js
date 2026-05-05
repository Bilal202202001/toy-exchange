import { v2 as cloudinary } from "cloudinary";

function ensureConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_SECRET_KEY;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_SECRET_KEY.",
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret });
}

/**
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @param {{ folder?: string }} [options]
 */
export async function uploadImageBuffer(buffer, mimeType, options = {}) {
  ensureConfig();

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder: options.folder ?? "toy-exchange",
    resource_type: "image",
  });

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    width: uploaded.width,
    height: uploaded.height,
  };
}
