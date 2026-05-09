import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/models/Package";
import StatusHistory from "@/models/StatusHistory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const trackingNumber = formData.get("trackingNumber");

    if (!file || !trackingNumber) {
      return NextResponse.json({ error: "Missing file or tracking number" }, { status: 400 });
    }

    const pkg = await Package.findOne({
      trackingNumber,
      clientId: session.user.id
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found or access denied" }, { status: 404 });
    }

    // File Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, JPG, and PNG are allowed." }, { status: 400 });
    }

    // Record Status History before change
    await StatusHistory.create({
      packageId: pkg._id,
      oldStatus: pkg.status,
      newStatus: "PENDING_INVOICE_REVIEW",
      changedBy: session.user.id,
      note: "Client uploaded invoice"
    });

    // Process file with Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(buffer, "ship2aruba/invoices");
    } catch (uploadError) {
      console.error("Cloudinary Upload Failed:", uploadError);
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }

    const secureUrl = cloudinaryResult.secure_url;

    // Update package status and attach invoice
    pkg.status = "PENDING_INVOICE_REVIEW";
    pkg.invoiceUrl = secureUrl;
    pkg.updatedAt = new Date();
    await pkg.save();

    return NextResponse.json({ 
      success: true, 
      message: "Invoice uploaded successfully to cloud storage",
      invoiceUrl: secureUrl
    });
  } catch (error) {
    console.error("Client Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
