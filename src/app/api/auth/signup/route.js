import Customer from "@/lib/models/customer";
import User from "@/lib/models/user";
import dbConnect from "@/lib/dbConnect";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import Wallet from "@/lib/models/wallet";

export async function POST(req) {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("✅ Connected to database");

    // Parse request body
    const body = await req.json();
    const { name, mobileNumber, password, role } = body;

    // Check if all required fields are present
    if (!name || !mobileNumber || !password) {
      return new Response(
        JSON.stringify({ message: "❌ Missing required fields" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "❌ User already exists" }),
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await hash(password, 10);

    // ✅ Step 1: Create User first
    const newUser = await User.create({
      name,
      mobileNumber,
      password: hashedPassword, // Store password in User only
      role: role||"customer",
    });

    console.log("✅ User Created:", newUser);

    // ✅ Step 2: Create Customer and link it to the User
    const newCustomer = await Customer.create({
      name,
      mobileNumber,
      password:hashedPassword,
      userId: newUser._id, // Link UserId to Customer
    });

    console.log("✅ Customer Created:", newCustomer);

    const newWallet = await Wallet.create({
      customerId: newCustomer._id,
      balance: 0
    })

    return new Response(
      JSON.stringify({
        message: "✅ User and Customer registered successfully",
        user: newUser,
        customer: newCustomer,
        wallet: newWallet
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating user and customer:", error);
    return new Response(
      JSON.stringify({
        message: "❌ Error creating user and customer",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}


export async function GET() {
  // ✅ Step 1: Get all users
  await dbConnect();
  try{
    const customers = await Customer.find();
    // console.log("✅ Users:", users);
        return NextResponse.json({ success: true, data: customers }, { status: 200 });

  }catch(error){
    return NextResponse.json(
          { success: false, message: "Internal Server Error", error: error.message },
          { status: 500 }
        );
  }
}