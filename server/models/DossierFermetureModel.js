import mongoose from "mongoose";

const dossierFermetureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  codeDossier: { type: String, required: true, unique: true },

  typeFermeture: {
    type: String,
    enum: {
      values: ["RADIATION_AUTO_ENTREPRENEUR", "MISE_EN_SOMMEIL", "DISSOLUTION_LIQUIDATION", "DEPOT_DE_BILAN"],
      message: '{VALUE} n\'est pas un type de fermeture valide'
    },
    required: [true, 'Le type de fermeture est obligatoire']
  },
   type: {
  type: String,
  required: true,
  enum: [
    "DISSOLUTION_LIQUIDATION",
    "MISE_EN_SOMMEIL", 
    "RADIATION_AUTO_ENTREPRENEUR",  // Changed to uppercase
    "Radiation auto-entrepreneur",
    "DEPOT_DE_BILAN",   // Keep existing for backward compatibility
    "Dépôt de bilan",
    "Dépôt de marque"
  ]
},
typeFermeture: {
  type: String,
  required: [true, 'Le type de fermeture est obligatoire'],
  enum: [
    "DISSOLUTION_LIQUIDATION",
    "MISE_EN_SOMMEIL",
    "RADIATION_AUTO_ENTREPRENEUR",  // Changed to uppercase
    "Radiation auto-entrepreneur", 
    "DEPOT_DE_BILAN",  // Keep existing for backward compatibility
    "Dépôt de bilan",
    "Dépôt de marque"
  ] 
},
  

  entreprise: {
    type: Object,
    required: true,
  },
  formeSociale: { 
    type: String,
    enum: ['SAS', 'SASU', 'SARL', 'EURL', 'SCI', 'SC', 'AE', 'AUTO_ENTREPRENEUR'],
    required: function() {
      return this.typeFermeture === 'MISE_EN_SOMMEIL' || 
             this.typeFermeture === 'DISSOLUTION_LIQUIDATION';
    }
  },
     depotBilan: {
    type: {
      nom: { type: String },
      prenom: { type: String },
      email: { type: String },
      telephone: { type: String },
      role: { type: String },
      souhait: { type: String },
      situation: { type: String },
      societe: { type: String },
      precisions: { type: String }
    },
    required: function() {
      return this.typeFermeture === 'DEPOT_DE_BILAN' || 
             this.typeFermeture === 'Dépôt de bilan';
    }
  },
  modificationDate: { type: String },
  artisanale: { 
    type: Boolean,
    required: function() {
      return this.typeFermeture === 'MISE_EN_SOMMEIL';
    }
  },
  timing: {
    type: String,
    enum: ['Dans la semaine', 'Dans les prochaines semaines', 'Dans les prochains mois'],
    required: function() {
      return this.typeFermeture === 'MISE_EN_SOMMEIL';
    }
  },
  observations: { type: String },

  // Suivi
   statut: {
    type: String,
     enum: ["en attente", "payé", "a traité", "en traitement", "traité"],
    default: "en attente",
  },
  
  boAffecte: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },

  etatAvancement: {
    type: String,
    enum: ["formulaire", "paiement", "documents", "traitement", "terminé"],
    default: "formulaire",
  },

  fichiers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
  fichiersbo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
      ],
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
   
}, {
  timestamps: true,
});

const DossierFermeture = mongoose.models.DossierFermeture || mongoose.model("DossierFermeture", dossierFermetureSchema);

export default DossierFermeture;