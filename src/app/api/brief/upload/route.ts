import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { LIMITS, ALLOWED_FILE_TYPES } from "@/data/briefTypes";

const ALLOWED_ORIGINS = [
  "https://jbrdevelopment.fr",
  "https://www.jbrdevelopment.fr",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

// Magic-byte signatures to verify actual file content (prevents MIME type spoofing)
const MAGIC_BYTES: Record<string, { offset: number; bytes: number[] }[]> = {
  "application/pdf": [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/webp": [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // WEBP
  ],
};

function verifyMagicBytes(buffer: ArrayBuffer, declaredType: string): boolean {
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return false;
  const view = new Uint8Array(buffer);
  return signatures.every(({ offset, bytes }) =>
    bytes.every((b, i) => view[offset + i] === b)
  );
}

// Sanitize filename: remove path traversal attempts and special characters
function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\]/g, "_")      // remove path separators
    .replace(/\.\./g, "_")       // remove directory traversal
    .replace(/[^\w.\-]/g, "_")   // keep only safe characters
    .slice(0, 100);              // limit length
}

// Rate limiting: 10 uploads per hour per IP
// NOTE: In-memory rate limiting is best-effort in serverless environments.
const uploadRateMap = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_RATE_WINDOW = 60 * 60 * 1000; // 1 hour
const UPLOAD_RATE_MAP_MAX_SIZE = 10_000;

function pruneUploadRateMap(map: Map<string, { count: number; resetAt: number }>, now: number) {
  if (map.size > UPLOAD_RATE_MAP_MAX_SIZE) {
    for (const [key, entry] of map) {
      if (now > entry.resetAt) map.delete(key);
    }
  }
}

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
  pruneUploadRateMap(uploadRateMap, now);
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

  // 4. Validate file type (client-declared MIME)
  if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 }
    );
  }

  // 5. Validate file size
  if (file.size > LIMITS.fileMaxSize) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // 6. Verify magic bytes match declared MIME type (prevents MIME spoofing)
  const arrayBuffer = await file.arrayBuffer();
  if (!verifyMagicBytes(arrayBuffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match declared type" },
      { status: 400 }
    );
  }

  // 7. Upload to Vercel Blob with sanitized filename
  const safeName = sanitizeFilename(file.name);
  try {
    const blob = await put(`brief/${Date.now()}-${safeName}`, new Blob([arrayBuffer], { type: file.type }), {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type, // enforce correct content-type header on the stored blob
    });

    return NextResponse.json({
      url: blob.url,
      name: file.name, // return original name for display
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
