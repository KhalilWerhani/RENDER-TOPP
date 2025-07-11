import mongoose from "mongoose";

// ✅ Assure-toi que les modèles "Dossier" et "DossierModification" sont bien enregistrés ailleurs avant utilisation.

const paiementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  dossier: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "Dossier", // ✅ utilisera dynamiquement "Dossier" ou "DossierModification"
    required: true,
  },

  dossierModel: {
    type: String,
    enum: ["Dossier", "DossierModification", 'DossierFermeture'], // ✅ corriger ici avec MAJUSCULE exactement comme les modèles
    required: true,
  },

  montant: {
    type: Number,
    required: true,
  },

  statut: {
    type: String,
    enum: ["en attente", "payé"],
    default: "payé",
  },

  méthode: {
    type: String,
    default: "stripe",
  },

  sessionId: {
    type: String,
    required: true, // ✅ utilisé pour récupérer la session Stripe
  },

  date: {
    type: Date,
    default: Date.now,
  },

  modificationType: {
    type: String, // ✅ présent seulement pour les modifications
  },
});

// ✅ Export du modèle
export default mongoose.models.Paiement || mongoose.model("Paiement", paiementSchema);
