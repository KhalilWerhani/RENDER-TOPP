/*import mongoose from "mongoose";

const dataDocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  dossier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dossier"
  },
  modification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DossierModification"
  },
  fermeture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DossierFermeture"
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  },
  tags: [{
    type: String
  }],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search functionality
dataDocumentSchema.index({
  name: "text",
  type: "text",
  tags: "text"
});

// Pre-save hook to update lastModified
dataDocumentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  if (this.isModified()) {
    this.version += 1;
  }
  next();
});

const DataDocument = mongoose.models.DataDocument || mongoose.model("DataDocument", dataDocumentSchema);

export default DataDocument;*/