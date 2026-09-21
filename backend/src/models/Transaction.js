const mongoose = require('mongoose');

// Unified transaction model. Phase 1 uses expense/income (+transfer passthrough).
// lending/borrowing/repayment/transfer reserved for Phase 2 but accepted by the enum
// so frontend/backend contracts stay stable.
const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['expense', 'income', 'transfer', 'lending', 'borrowing', 'repayment'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, default: 'Other', trim: true },
    subcategory: { type: String, default: '', trim: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
    date: { type: Date, required: true },
    time: { type: String, default: '' },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    tags: { type: [String], default: [] },
    paymentMethod: { type: String, default: '' },
    recurringId: { type: String, default: null },
    // Offline-first / sync fields (last-write-wins v1)
    clientId: { type: String, index: true, default: null }, // uuid generated on device
    deviceId: { type: String, default: null },
    syncStatus: { type: String, enum: ['pending', 'synced', 'failed'], default: 'synced' },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, clientId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Transaction', transactionSchema);
