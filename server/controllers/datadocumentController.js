/*import DataDocument from "../models/datadocumentModel.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
// Upload document


export const uploadDocument = async (req, res) => {
    
  try {
        console.log("BODY >>>", req.body); // 🟡 AJOUTE ICI

    const { dossierId, documentType, uploadedBy, size, mimeType } = req.body;

    if (!uploadedBy || !mongoose.Types.ObjectId.isValid(uploadedBy)) {
      return res.status(400).json({ message: "uploadedBy invalide" });
    }

    const document = new DataDocument({
      name: documentType,
      path: `/uploads/documents/${req.file.filename}`,
      type: documentType,
      uploadedBy,
      dossier: req.originalUrl.includes("modification") ? undefined :
              req.originalUrl.includes("fermeture") ? undefined : dossierId,
      modification: req.originalUrl.includes("modification") ? dossierId : undefined,
      fermeture: req.originalUrl.includes("fermeture") ? dossierId : undefined,
      size: Number(size),
      mimeType
    });

    await document.save();
    res.status(201).json({ success: true, document });
  } catch (err) {
    console.error("Erreur d'upload document :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


// Récupérer les documents selon le type de dossier
export const getDocumentsByParent = async (req, res) => {
  try {
    const { dossier, modification, fermeture } = req.query;

    let filter = {};
    if (dossier) filter.dossier = dossier;
    else if (modification) filter.modification = modification;
    else if (fermeture) filter.fermeture = fermeture;

    const documents = await DataDocument.find(filter).sort({ createdAt: 1 });
    res.status(200).json(documents);
  } catch (err) {
    console.error("Erreur récupération documents :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Télécharger un document
export const downloadDocument = async (req, res) => {
  try {
    const doc = await DataDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document non trouvé" });

    const filePath = path.join(process.cwd(), 'public', doc.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    res.download(filePath, doc.name || "document.pdf");
  } catch (err) {
    console.error("Erreur téléchargement document :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
*/