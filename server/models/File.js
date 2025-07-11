import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  url: String,
  public_id: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Assure-toi que ton modèle User s'appelle bien "User"
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);
export default File;
