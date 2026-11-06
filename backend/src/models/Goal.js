import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    target: { type: Number, required: true, min: 1 },
    current: { type: Number, default: 0, min: 0 },
    deadline: { type: String, trim: true },
    monthlyCommitment: { type: Number, default: 0, min: 0 },
    icon: { type: String, default: 'flag' },
    color: { type: String, default: '#c3f400' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
