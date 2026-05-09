import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/models/Package";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalPackages, pendingReviews, activeClients] = await Promise.all([
      Package.countDocuments(),
      Package.countDocuments({ status: "PENDING_INVOICE_REVIEW" }),
      User.countDocuments({ role: "CLIENT" }),
    ]);

    // Mock ship requests count for now until we have that model
    const shipRequests = 0;

    return NextResponse.json({
      totalPackages,
      pendingReviews,
      shipRequests,
      activeClients
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
