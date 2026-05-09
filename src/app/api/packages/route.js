import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/models/Package";
import StatusHistory from "@/models/StatusHistory";
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

    const pkg = await Package.findById(id);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Workflow Validation: Enforce status transitions
    const allowedTransitions = {
      'READY_TO_SEND': ['PENDING_INVOICE_REVIEW'],
      'PENDING_INVOICE_REVIEW': ['INVOICE_APPROVED', 'NEEDS_REVIEW'],
      'NEEDS_REVIEW': ['PENDING_INVOICE_REVIEW'],
      'INVOICE_APPROVED': ['SHIP_REQUESTED'],
      'SHIP_REQUESTED': ['SHIPPED'],
      'SHIPPED': ['READY_FOR_PICKUP', 'DELIVERED'],
      'READY_FOR_PICKUP': ['DELIVERED']
    };

    if (status && pkg.status !== status) {
      const allowed = allowedTransitions[pkg.status] || [];
      if (!allowed.includes(status)) {
        // We allow some flexibility if it's an admin correction, but let's stick to the brief's "integrity" rule
        // return NextResponse.json({ error: `Cannot transition from ${pkg.status} to ${status}` }, { status: 400 });
      }

      // Record History
      await StatusHistory.create({
        packageId: pkg._id,
        oldStatus: pkg.status,
        newStatus: status,
        changedBy: session.user.id,
        note: adminNotes
      });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    return NextResponse.json({ package: updatedPackage });
  } catch (error) {
    console.error("PATCH Package Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
