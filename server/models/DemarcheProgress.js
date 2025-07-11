// models/DemarcheProgress.js
import mongoose from "mongoose";

const DemarcheProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  typeDemarche: { type: String, required: true }, // e.g. 'creation-sas', 'modif-siege'
  currentStep: { type: Number, default: 0 },
  formData: { type: Object, default: {} },
  isCompleted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("DemarcheProgress", DemarcheProgressSchema);
