import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Use export default for ES modules
export default mongoose.model('Appointment', appointmentSchema);