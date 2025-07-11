import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const documentModel = mongoose.model('Document', DocumentSchema);

export default documentModel;
