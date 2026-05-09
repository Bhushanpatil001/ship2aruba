import mongoose from 'mongoose';

const ShipRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  packageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  }],
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED'],
    default: 'PENDING',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export default mongoose.models.ShipRequest || mongoose.model('ShipRequest', ShipRequestSchema);
