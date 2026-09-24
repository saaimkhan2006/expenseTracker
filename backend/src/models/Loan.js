import mongoose from 'mongoose';

// Lending & borrowing ledger. Money lent is a receivable (asset), money
// borrowed is a payable (liability) — never counted as expense/income.
// Supports partial repayments via the repayments array.
const repaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, default: Date.now },
    note: { type: String, default: '', trim: true, maxlength: 300 },
  },
  { _id: true, timestamps: false }
);

const loanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    kind: { type: String, enum: ['lent', 'borrowed'], required: true },
    person: { type: String, required: true, trim: true, maxlength: 80 },
    amount: { type: Number, required: true, min: 0.01 },
    paidAmount: { type: Number, default: 0, min: 0 },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending',
    },
    repayments: { type: [repaymentSchema], default: [] },
    clientId: { type: String, index: true, default: null },
    deviceId: { type: String, default: null },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

loanSchema.index({ userId: 1, status: 1 });

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
