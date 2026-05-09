import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
  },
  dimensions: {
    width: Number,
    height: Number,
    length: Number,
    weight: Number, // Assuming kg or lbs based on admin choice
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  status: {
    type: String,
    enum: [
      'READY_TO_SEND',
      'PENDING_INVOICE_REVIEW',
      'INVOICE_APPROVED',
      'NEEDS_REVIEW',
      'SHIP_REQUESTED',
      'SHIPPED',
      'READY_FOR_PICKUP',
      'DELIVERED'
    ],
    default: 'READY_TO_SEND',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  invoiceUrl: {
    type: String,
  },
  adminNotes: {
    type: String, // For "Needs Review" explanations
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
