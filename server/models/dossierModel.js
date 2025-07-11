import mongoose from "mongoose";

const dossierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  codeDossier: { type: String, required: true, unique: true },

  type: {
    type: String,
    enum: ["SAS", "SASU", "SARL", "EURL", "SCI", "AUTO-ENTREPRENEUR", "Entreprise individuelle", "Association"],
    required: true,
  },
  boAffecte: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  statut: {
    type: String,
    enum: ["en attente", "payé", "a traité", "en traitement", "traité"],
    default: "en attente",
  },

  questionnaire: {
    type: Object,
    default: {},
  },
  fichiers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
  etatAvancement: {
    type: String,
    enum: ['formulaire', 'paiement', 'documents', 'traitement', 'terminé'],
    default: 'formulaire'
  },
  
  nomEntreprise: { type: String, default: "" }, // Add this line
  siret: { type: String , default: ""},
  logo: { type: String , default: ""},
  domiciliation: { type: String , default: ""},
  notes: { type: String  , default: ""} ,

  paymentStatus: {
    type: String,
    enum: ['pending', 'requires_action', 'succeeded', 'failed'],
    default: 'pending'
  },
  paymentIntentId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});


const Dossier = mongoose.models.Dossier || mongoose.model("Dossier", dossierSchema);
export default Dossier;
