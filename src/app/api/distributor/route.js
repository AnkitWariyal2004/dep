import dbConnect from "@/lib/dbConnect";
import Distributer from "@/lib/models/distributer";
import User from "@/lib/models/user";
import { hash } from "bcryptjs";
import Customer from "@/lib/models/customer";

export async function POST(req) {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("✅ Connected to database");

    // Parse request body
    const body = await req.json();
    const { name, mobileNumber, password, address, status } = body;

    // Check if all required fields are present
    if (!name || !mobileNumber || !password || !address) {
      return new Response(
        JSON.stringify({ success: false, message: "❌ Missing required fields" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User already exists in the database" }),
        { status: 400 } // 🔴 Changed from 500 to 400
      );
    }

    // Hash the password before saving
    const hashedPassword = await hash(password, 10);

    // ✅ Step 1: Create User first
    const newUser = await User.create({
      name,
      mobileNumber,
      password: hashedPassword, // Store password in User only
      role: "distributer",
    });

    console.log("✅ User Created:", newUser);

    const newCus= await Customer.create({
      name,
      mobileNumber,
      password:hashedPassword,
      userId: newUser._id
    })


    // ✅ Step 2: Create Distributer and link it to the User
    const newDistributer = await Distributer.create({
      name,
      mobileNumber,
      password: hashedPassword,
      address,
      status,
      userId: newUser._id, // Link UserId to Distributer
    });

    console.log("✅ Distributer Created:", newDistributer);

    return new Response(
      JSON.stringify({ success: true, data: newDistributer }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating user and distributer:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
        error: error.message, // 🔴 Show detailed error in response
      }),
      { status: 500 }
    );
  }
}
