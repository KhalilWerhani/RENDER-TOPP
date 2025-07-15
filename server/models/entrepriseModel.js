import mongoose from "mongoose";

const entrepriseSchema = new mongoose.Schema({
  // Basic info (from the entreprise object in other models)
  nomEntreprise: { type: String, required: true },
  siret: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{14}$/.test(v);
      },
      message: props => `${props.value} is not a valid SIRET number!`
    }
  },
  domiciliation: { type: String, required: true },
  logo: { type: String, default: "" },
  
  // Tracking modifications and fermetures
  modifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DossierModification'
  }],
  fermetures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DossierFermeture'
  }],
  dossiers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dossier'
  }],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to update lastModified
entrepriseSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Entreprise = mongoose.models.Entreprise || mongoose.model("Entreprise", entrepriseSchema);
export default Entreprise;