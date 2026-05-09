import mongoose from 'mongoose';

const StatusHistorySchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  oldStatus: {
    type: String,
    required: true,
  },
  newStatus: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String, // For rejection notes or admin comments
  }
});

export default mongoose.models.StatusHistory || mongoose.model('StatusHistory', StatusHistorySchema);
