import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import mime from "mime-types"; // Install: npm install mime-types

export async function GET(req, context) {
  try {
    const { params } = context;
    if (!params?.path || !Array.isArray(params.path)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Define the uploads directory
    const uploadsDir = path.resolve(process.cwd(), "uploads");

    // Normalize and validate the file path
    const requestedPath = path.normalize(path.join(...params.path));
    if (requestedPath.includes("..")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const safePath = path.join(uploadsDir, requestedPath);
    if (!safePath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.stat(safePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read the file
    const file = await fs.readFile(safePath);
    const mimeType = mime.lookup(safePath) || "application/octet-stream";

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
