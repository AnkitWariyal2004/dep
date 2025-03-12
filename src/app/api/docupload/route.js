import dbConnect from "@/lib/dbConnect";
import Document from "@/lib/models/document";
import {NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    // 🔹 Parse JSON body from request
    const body = await req.json();
    const { category, name, dob, fatherName, mobile, status, remark, createdBy } = body;

    if (!name || !category || !fatherName || !mobile || !dob || !createdBy) {
      return new Response(
        JSON.stringify({ message: "❌ Missing required fields" }),
        { status: 400 }
      );
    }

    const newDoc = await Document.create({
      category,
      name,
      dob,
      fatherName,
      mobile,
      status,
      remark,
      createdBy:createdBy // 
    });
    await newDoc.save();

    return NextResponse.json({ success: true, message: "Form submitted successfully", data: newDoc }, { status: 201 });

  } catch (error) {
    console.error("❌ Error processing form submission:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
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
