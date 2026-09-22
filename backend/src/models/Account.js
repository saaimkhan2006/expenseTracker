import mongoose from 'mongoose';

// Phase 1: cash/bank accounts. Phase 2+ adds credit-card liabilities handling.
const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    type: {
      type: String,
      enum: ['cash', 'bank', 'upi', 'wallet', 'credit_card', 'other'],
      default: 'bank',
    },
    openingBalance: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    icon: { type: String, default: '🏦' },
    color: { type: String, default: '#22c55e' },
    isActive: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

const Account = mongoose.model('Account', accountSchema);

export default Account;
