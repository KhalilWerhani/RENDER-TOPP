import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // e.g. création, modification, fermeture
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export default Counter;
