import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://jbrdevelopment.fr",
  "https://www.jbrdevelopment.fr",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

// Rate limiting: 10 uploads per hour per IP
const uploadRateMap = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  // 1. CSRF check
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rateEntry = uploadRateMap.get(ip);
  if (rateEntry) {
    if (now > rateEntry.resetAt) {
      uploadRateMap.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_WINDOW });
    } else if (rateEntry.count >= UPLOAD_RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many uploads" },
        { status: 429 }
      );
    } else {
      rateEntry.count++;
    }
  } else {
    uploadRateMap.set(ip, { count: 1, resetAt: now + UPLOAD_RATE_WINDOW });
  }

  // 3. Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 4. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 }
    );
  }

  // 5. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // 6. Upload to Vercel Blob
  try {
    const blob = await put(`brief/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}
