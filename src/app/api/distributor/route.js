import dbConnect from "@/lib/dbConnect";
import Distributer from "@/lib/models/distributer";
import User from "@/lib/models/user";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("✅ Connected to database");

    // Parse request body
    const body = await req.json();
    const { name, mobileNumber, password, address } = body;

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
      role: "distributer",
    });

    console.log("✅ User Created:", newUser);

    // ✅ Step 2: Create Customer and link it to the User
    const newDistributer = await Distributer.create({
      name,
      mobileNumber,
      password:hashedPassword,
      address,
      userId: newUser._id, // Link UserId to Customer
    });

    console.log("✅ Customer Created:", newDistributer);

    return new Response(
      JSON.stringify({
        message: "✅ User and Distributer registered successfully",
        user: newUser,
        Distributer: newDistributer,
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
