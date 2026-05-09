import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/models/Package";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packages = await Package.find()
      .populate("clientId", "name email suiteNumber")
      .sort({ receivedAt: -1 });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("GET Packages Error:", error);
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

    const body = await req.json();
    const { trackingNumber, clientId, description, weight, dimensions } = body;

    const newPackage = await Package.create({
      trackingNumber,
      clientId,
      description,
      weight,
      dimensions,
      status: "READY_TO_SEND",
      receivedAt: new Date(),
    });

    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error) {
    console.error("POST Package Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, adminNotes } = await req.json();

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!updatedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: updatedPackage });
  } catch (error) {
    console.error("PATCH Package Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
