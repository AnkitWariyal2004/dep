import  dbConnect  from "@/lib/dbConnect";
import Documents from "@/lib/models/document";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = await params;
  const body = await req.json();

  try {
    // Extract only allowed fields: status and remark
    const { status, remark } = body;

    if (!status && !remark) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedDocument = await Documents.findByIdAndUpdate(
      id,
      { $set: { status, remark } }, // Only update allowed fields
      { new: true }
    );

    if (!updatedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedDocument }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating document" }, { status: 500 });
  }
}


export async function GET(req,{ params }){
    await dbConnect();
    const { id } = await params;
    if(!id){
        return NextResponse.json({ error: "Id not found" }, { status: 400 });
    }
    try{
        const document= await Documents.findById(id)
        if(!document){
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: document }, { status: 200 });
    }catch(error){
        return NextResponse.json({ error: "Error fetching document" }, { status: 500 });
    }

}