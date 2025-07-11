// models/DossierModificationModel.js
import mongoose from "mongoose";

const modificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  codeDossier: { type: String, required: true, unique: true },

  type: {
    type: String,
    enum: [
      "TRANSFERT_SIEGE",
      "CHANGEMENT_DENOMINATION",
      "CHANGEMENT_PRESIDENT",
      "CHANGEMENT_ACTIVITE",
      "TRANSFORMATION_SARL_EN_SAS",
      "TRANSFORMATION_SAS_EN_SARL"
    ],
    required: true,
  },
  boAffecte: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
 
  entreprise: {
    type: Object,
    required: false,
  },
  formeSociale: { type: String },
  modificationDate: { type: String },

  // Pour changement d’activité
  typeChangement: { type: String },
  nouvelleActivite: { type: String },

  // Pour changement de président
  nouveauPresident: {
    prenom: String,
    nom: String
  },

  // Pour changement de dénomination
  nouveauNom: { type: String },
  

  // Pour transfert de siège
  adresseActuelle: { type: String },
  adresseNouvelle: { type: String },

  // Pour vente de parts
  vendeurs: [
    {
      prenom: String,
      nom: String
    }
  ],

  // Options générales
  modifs: [String],
  beneficiaireEffectif: { type: Boolean },
  createdWithTop: { type: Boolean },
  modifiedStatuts: { type: Boolean },
  artisanale: { type: Boolean },

  // Suivi
  statut: {
    type: String,
     enum: ["en attente", "payé", "a traité", "en traitement", "traité"],
    default: "en attente"
  },
  
  etatAvancement: {
    type: String,
    enum: ["formulaire", "paiement", "documents", "traitement", "terminé"],
    default: "formulaire"
  },
   fichiers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const DossierModification = mongoose.models.DossierModification || mongoose.model("DossierModification", modificationSchema);
export default DossierModification;
