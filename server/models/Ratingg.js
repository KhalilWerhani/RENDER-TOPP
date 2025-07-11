import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  commentaire: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ratingg', ratingSchema);
