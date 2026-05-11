import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await User.find({ role: "CLIENT" }).sort({ createdAt: -1 });
    return NextResponse.json({ clients });
  } catch (error) {
    console.error("GET Clients API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, suiteNumber: manualSuite } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Use manual suite number or generate one
    let suiteNumber = manualSuite;
    if (!suiteNumber) {
      const count = await User.countDocuments({ role: "CLIENT" });
      suiteNumber = `S2A-${1001 + count}`;
    }

    // Check if suite number is unique
    const existingSuite = await User.findOne({ suiteNumber });
    if (existingSuite) {
      return NextResponse.json({ error: "Suite number already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "CLIENT",
      suiteNumber,
    });

    return NextResponse.json({ 
      success: true, 
      client: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        suiteNumber: newUser.suiteNumber
      }
    });
  } catch (error) {
    console.error("POST Clients API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
