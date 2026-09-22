import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    kind: { type: String, enum: ['expense', 'income'], required: true },
    icon: { type: String, default: '📦' },
    color: { type: String, default: '#38bdf8' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, kind: 1, name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
