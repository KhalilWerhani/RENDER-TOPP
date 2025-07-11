import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  typeProjet: { type: String, enum: ['création', 'modification', 'fermeture', 'comptabilité'], required: true },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
