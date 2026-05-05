import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { getAuthUser } from "@/lib/auth/session";

export async function POST(request) {
  const auth = await getAuthUser(request);
  if ("response" in auth) return auth.response;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: 'Missing file field "file" (image)' },
      { status: 400 },
    );
  }

  const upload = file;

  if (!upload.type?.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  const maxBytes = 15 * 1024 * 1024;
  if (upload.size > maxBytes) {
    return NextResponse.json({ error: "Image too large (max 15MB)" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await upload.arrayBuffer());
    const result = await uploadImageBuffer(buffer, upload.type || "image/jpeg");

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
