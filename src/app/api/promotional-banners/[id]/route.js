import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import Banner from "@/lib/models/banner";
import mongoose from "mongoose";
import PromotionalBanner from "@/lib/models/promotional";

export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = await params;

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
        // console.log("Extracted Image Filename:", imageFilename);

        // Construct the correct file path
        const imagePath = path.resolve(process.cwd(), "public/uploads/promobanner", imageFilename);
        // console.log("Resolved Image Path:", imagePath);

        // Check if the file exists before deleting
        try {
            await fs.access(imagePath); // Ensure file exists
            await fs.unlink(imagePath); // Delete the file
            console.log("Image deleted successfully:", imageFilename);
        } catch (err) {
            console.error("File does not exist or cannot be deleted:", err.message);
        }

        // Delete the banner from the database
        await PromotionalBanner.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Banner and image deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
