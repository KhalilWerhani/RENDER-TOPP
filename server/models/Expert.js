// models/Expert.js
import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true }, // Make sure this exists
  role: String,
  description: String,
  phone: String
  
});

export default mongoose.model("Expert", expertSchema);
