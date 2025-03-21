import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Price from '@/lib/models/price';
export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }


  try {
    let {newPenPrice,renewalPenPrice,insurancePrice} = await req.json();
    newPenPrice = isNaN(parseInt(newPenPrice, 10)) ? 0 : parseInt(newPenPrice, 10);
    renewalPenPrice = isNaN(parseInt(renewalPenPrice, 10)) ? 0 : parseInt(renewalPenPrice, 10);
    insurancePrice = isNaN(parseInt(insurancePrice, 10)) ? 0 : parseInt(insurancePrice, 10);
    const updatedPrice = await Price.findOneAndUpdate(
      {}, 
      { newPenPrice, renewalPenPrice, insurancePrice },
      { new: true, upsert: true }
    );
    await updatedPrice.save();
    return NextResponse.json({ success: true, message: 'Price updated successfully',data:updatedPrice}, { status: 200 });
  } catch (error) {
    console.error("Something Went wrong:", error);
    return NextResponse.json({ success: false, message: "Server error", error:error }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const price = await Price.findOne();
    return NextResponse.json({ success: true, message: "Price fetched successfully", data: price }, { status: 200 });
  } catch (error) {
    console.error("Something went wrong:", error);
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
