import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  fichier: { type: String },  // For BO-uploaded files
  url: { type: String },      // For client-uploaded files
  filename: { type: String }, // For client-uploaded files
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  roleUploader: { type: String, enum: ['client', 'admin', 'collaborateur'], required: true },
  roleDestinataire: { type: String, enum: ['client', 'admin', 'collaborateur'], required: true },
  statut: { type: String, enum: ['en_attente', 'valide'], default: 'en_attente' },
  dossier: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'dossierModel'
  },
  dossierModel: {
    type: String,
    enum: ['Dossier', 'DossierModification', 'DossierFermeture'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema);