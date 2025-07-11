import Document from '../models/Document.js';
import User from '../models/userModel.js';

 // 📤 Upload de document
export const uploadDocument = async (req, res) => {
  try {
    const { titre, destinataireId, roleDestinataire } = req.body;

    if (!titre || !destinataireId || !roleDestinataire) {
      return res.status(400).json({ success: false, message: 'Champs requis manquants' });
    }

    if (!req.file || !req.user) {
      return res.status(400).json({ success: false, message: 'Fichier ou utilisateur manquant' });
    }

    const normalizedRoleUploader = req.user.role === 'BO' ? 'collaborateur' : req.user.role;

    const document = new Document({
      titre,
      fichier: req.file.path,
      uploader: req.user.id,
      destinataire: destinataireId,
      roleUploader: normalizedRoleUploader,
      roleDestinataire,
    });

    await document.save();
    res.status(201).json({ success: true, document });

  } catch (error) {
    console.error('❌ Erreur dans uploadDocument:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// 📥 Voir les documents reçus
export const getReceivedDocuments = async (req, res) => {
  try {
    console.log("✅ [getReceivedDocuments] req.user :", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
    }

    const docs = await Document.find({ destinataire: req.user.id }).populate('uploader', 'email');

    res.json(docs);
  } catch (error) {
    console.error('❌ Erreur getReceivedDocuments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// 📤 Voir les documents envoyés
export const getSentDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploader: req.user.id }).populate('destinataire', 'email');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
