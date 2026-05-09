import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/models/Package";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

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

    // Process file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "invoices");
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/uploads/invoices/${fileName}`;

    // Update package status and attach invoice
    pkg.status = "PENDING_INVOICE_REVIEW";
    pkg.invoiceUrl = publicPath;
    pkg.updatedAt = new Date();
    await pkg.save();

    return NextResponse.json({ 
      success: true, 
      message: "Invoice uploaded and package status updated",
      invoiceUrl: publicPath
    });
  } catch (error) {
    console.error("Client Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
