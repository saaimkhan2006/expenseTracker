import mongoose from 'mongoose';

// Subscription / recurring-charge tracker. Active subscriptions are
// auto-charged lazily on list: every elapsed billing cycle posts an
// expense transaction and advances nextBilling. Covers Phase 2
// "recurring transactions" for fixed-cycle commitments.
const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    amount: { type: Number, required: true, min: 0.01 },
    cycle: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly' },
    category: { type: String, default: 'Subscriptions', trim: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    nextBilling: { type: Date, required: true },
    active: { type: Boolean, default: true },
    icon: { type: String, default: 'repeat' },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, active: 1, nextBilling: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
