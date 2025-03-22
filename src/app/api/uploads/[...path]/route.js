import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { params } = await context; // Ensure params is awaited

    if (!params?.path || !Array.isArray(params.path)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Construct a safe file path
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const safePath = path.join(uploadsDir, ...params.path);

    // Ensure the resolved path is within the "uploads" directory
    if (!safePath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists before reading
    try {
      await fs.access(safePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const file = await fs.readFile(safePath);

    // Determine MIME type
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
    };
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    // Return the file with correct headers
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Expires: "0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
