import mongoose from 'mongoose';

// Monthly per-category budget envelope. Phase 2.
const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ }, // YYYY-MM
    category: { type: String, required: true, trim: true, maxlength: 60 },
    cap: { type: Number, required: true, min: 1 },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
