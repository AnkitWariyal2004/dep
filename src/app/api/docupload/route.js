import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Document from "@/lib/models/document";
import { NextResponse } from "next/server"; 

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();

    // Extract form data fields
    const category = formData.get("category");
    const name = formData.get("name");
    const dob = formData.get("dob");
    const fatherName = formData.get("fatherName");
    const mobile = formData.get("mobile");
    const status = formData.get("status");
    const remark = formData.get("remark") || "";
    const createdBy = formData.get("createdBy");
    const panOption= formData.get("panOption");

    // Extract files
    const photo = formData.get("photo");
    const signImage = formData.get("signImage");
    const aadharBack = formData.get("aadharBack");
    const aadharFront = formData.get("aadharFront"); // ✅ Now declared
    const  previousPanImage = formData.get("previousPanImage");
    const  blueBookImage = formData.get("blueBookImage");

    // Function to save a file and return its path
    async function saveFile(file, subDir) {
      if (!file || file.size === 0) return ""; // If no file uploaded, return empty string

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get file extension
      const ext = path.extname(file.name).toLowerCase();
      const fileName = `${uuidv4()}${ext}`; // Generate unique filename
      const folderPath = path.join(process.cwd(), "public", "uploads", subDir);

      // Create directory if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);
      await writeFile(filePath, buffer);

      return `/uploads/${subDir}/${fileName}`; // Relative path for frontend
    }

    // Save files
    const photoPath = await saveFile(photo, "photo");
    const signPath = await saveFile(signImage, "sign");
    const aadharBackPath = await saveFile(aadharBack, "aadharback");
    const aadharFrontPath = await saveFile(aadharFront, "aadharfront");
    const  blueBookPath = await saveFile(blueBookImage,"bluebook");
    const previousPanImagePath = await saveFile(previousPanImage, "previouspan");
   

    // Create document in MongoDB
    const newDoc = await Document.create({
      category,
      name,
      dob,
      fatherName,
      panOption,
      mobile,
      status,
      remark,
      createdBy,
      photo: photoPath,
      signImage: signPath,
      blueBookImage:blueBookPath,
      previousPanImage: previousPanImagePath,
      aadharBack: aadharBackPath,
      aadharFront: aadharFrontPath,
    });

    return new Response(JSON.stringify({ success: true, data: newDoc }), { status: 200 });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}



export async function GET(req) {
  try {
    await dbConnect(); // Ensure database connection

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const userID = searchParams.get("userID");

    if (!role || !userID) {
      return NextResponse.json({ success: false, message: "Missing role or userID" }, { status: 400 });
    }

    let documents = [];

    if (role === "admin") {
      // ✅ Fetch all documents for admin
      documents = await Document.find({}).populate("createdBy", "name"); ;
    } 
    else if (role === "customer") {
      // ✅ Fetch documents created by the user (customer)
      documents = await Document.find({ createdBy: userID });
    } 
    else {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: documents }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
