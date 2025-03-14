import { connectDB } from "@/lib/db";
import Documents from "@/models/Document";

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();

  try {
    // Extract only allowed fields: status and remark
    const { status, remark } = body;

    if (!status && !remark) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedDocument = await Documents.findByIdAndUpdate(
      id,
      { $set: { status, remark } }, // Only update allowed fields
      { new: true }
    );

    if (!updatedDocument) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    return Response.json(updatedDocument, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating document" }, { status: 500 });
  }
}
