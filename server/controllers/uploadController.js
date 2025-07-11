import Dossier from "../models/dossierModel.js";
import DossierModification from "../models/dossierModificationModel.js";
import path from 'path';
import mongoose from "mongoose";/*
// For regular Dossier
export const uploadDocument = async (req, res) => {
  try {
    const { dossierId, documentType, username } = req.body;
    if (!dossierId || !documentType || !username) {
      return res.status(400).json({ error: "dossierId, username ou documentType manquant" });
    }

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }

   dossier.pieces.push({
  path: `/uploads/${username}/${req.file.filename}`,
  name: documentType
});


    await dossier.save();
    res.status(200).json({ message: "Fichier ajouté", filePath: `/uploads/${username}/${req.file.filename}` });
  } catch (err) {
    console.error("Erreur lors de l'upload :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du fichier" });
  }
};

export const uploadModificationDocument = async (req, res) => {
  try {
    const { dossierId, documentType, username } = req.body;
    if (!dossierId || !documentType || !username) {
      return res.status(400).json({ error: "dossierId, username ou documentType manquant" });
    }

    const dossierModification = await DossierModification.findById(dossierId);
    if (!dossierModification) {
      return res.status(404).json({ error: "Dossier de modification introuvable" });
    }

    dossierModification.pieces.push({
      path: `/uploads/${username}/${req.file.filename}`,
      name: documentType
    });

    await dossierModification.save();
    res.status(200).json({ message: "Fichier ajouté", filePath: `/uploads/${username}/${req.file.filename}` });
  } catch (err) {
    console.error("Erreur lors de l'upload :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du fichier" });
  }
};


export const getUserDocuments = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "userId invalide" });
  }

  try {
    const dossiers = await Dossier.find({ user: userId }).select('pieces createdAt type');

    const documentsByDossier = dossiers.map((dossier) => ({
      dossierId: dossier._id,
      type: dossier.type,
      source: "CREATION",

      createdAt: dossier.createdAt,
      documents: dossier.pieces.map((piece) => ({
        title: piece.name,
        filePath: piece.path,
        uploadedAt: dossier.createdAt,
      })),
    }));

    return res.status(200).json({ success: true, dossiers: documentsByDossier });
  } catch (err) {
    console.error("Erreur lors de la récupération des pièces :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getUserModificationDocuments = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "userId invalide" });
  }

  try {
    const dossiers = await DossierModification.find({ user: userId }).select('pieces createdAt type');

    const documentsByDossier = dossiers.map((dossier) => ({
      dossierId: dossier._id,
      type: dossier.type,
        source: "MODIFICATION", // Ajout ici

      createdAt: dossier.createdAt,
      documents: dossier.pieces.map((piece) => ({
        title: piece.name,
        filePath: piece.path,
        uploadedAt: dossier.createdAt,
      })),
    }));

    return res.status(200).json({ success: true, dossiers: documentsByDossier });
  } catch (err) {
    console.error("Erreur lors de la récupération des pièces :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};*/
export const uploadDocument = async (req, res , next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(req.file.destination, req.file.filename).replace(/\\/g, '/');
    
    req.filePath = filePath; // Attach to request for next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadModificationDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(req.file.destination, req.file.filename).replace(/\\/g, '/');
    
    req.filePath = filePath; // Attach to request for next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadFermetureDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(req.file.destination, req.file.filename).replace(/\\/g, '/');
    
    req.filePath = filePath; // Attach to request for next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
