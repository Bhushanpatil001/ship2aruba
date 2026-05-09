import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shipment from "@/models/Shipment";
import Package from "@/models/Package";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = {};
    if (session.user.role !== "ADMIN") {
      query.clientId = session.user.id;
    }

    const shipments = await Shipment.find(query)
      .populate("packageIds")
      .populate("clientId", "name suiteNumber")
      .sort({ createdAt: -1 });

    return NextResponse.json({ shipments });
  } catch (error) {
    console.error("GET Shipments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageIds } = await req.json();

    // Verify all packages belong to the user and are approved
    const packages = await Package.find({
      _id: { $in: packageIds },
      clientId: session.user.id,
      status: "INVOICE_APPROVED"
    });

    if (packages.length !== packageIds.length) {
      return NextResponse.json({ error: "One or more packages are not eligible for shipment" }, { status: 400 });
    }

    const newShipment = await Shipment.create({
      clientId: session.user.id,
      packageIds,
      status: "PENDING",
    });

    // Update package statuses
    await Package.updateMany(
      { _id: { $in: packageIds } },
      { status: "SHIP_REQUESTED" }
    );

    return NextResponse.json({ shipment: newShipment }, { status: 201 });
  } catch (error) {
    console.error("POST Shipment Error:", error);
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

    const { id, status, trackingNumber, adminNotes } = await req.json();

    const updateData = { status, adminNotes };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    } else if (status === "SHIPPED") {
      updateData.trackingNumber = `S2A-${Date.now().toString().slice(-6)}`;
    }
    
    if (status === "SHIPPED") {
      updateData.shippedAt = new Date();
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (status === "SHIPPED") {
      // Update all associated packages to SHIPPED
      await Package.updateMany(
        { _id: { $in: updatedShipment.packageIds } },
        { status: "SHIPPED" }
      );
    }

    return NextResponse.json({ shipment: updatedShipment });
  } catch (error) {
    console.error("PATCH Shipment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
