import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  packageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  }],
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "ARRIVED", "DELIVERED"],
    default: "PENDING",
  },
  trackingNumber: String,
  estimatedArrival: Date,
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shippedAt: Date,
});

export default mongoose.models.Shipment || mongoose.model("Shipment", ShipmentSchema);
