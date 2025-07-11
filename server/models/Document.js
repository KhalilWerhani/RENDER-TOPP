import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  fichier: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  roleUploader: { type: String, enum: ['client', 'admin', 'collaborateur'], required: true },
  roleDestinataire: { type: String, enum: ['client', 'admin', 'collaborateur'], required: true },
  statut: { type: String, enum: ['en_attente', 'valide'], default: 'en_attente' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
