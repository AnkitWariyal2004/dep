import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import PromotionalBanner from "@/lib/models/promotional";

export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params; // Directly use params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    try {
        // Find the banner to get the image filename
        const banner = await PromotionalBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
        }

        // Extract only the filename from `banner.image`
        const imageFilename = path.basename(banner.image); // Extracts "filename.jpg"

        // Construct the correct file path
        const imagePath = path.join(process.cwd(), "uploads", "promobanner", imageFilename);

        // Try deleting the file if it exists
        await fs.unlink(imagePath).catch(err => {
            if (err.code !== "ENOENT") {
                console.error("Error deleting image file:", err);
            }
        });

        // Delete the banner from the database
        await PromotionalBanner.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Banner and image deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
