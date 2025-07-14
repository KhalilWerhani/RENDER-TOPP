import DossierFermeture from "../models/DossierFermetureModel.js";
import { createNotification } from "../utils/createNotification.js";
import { generateCodeDossier } from "../utils/generateCodeDossier.js";
import fs from 'fs';
import mongoose from "mongoose";

// Submit fermeture dossier
export const submitDossierFermeture = async (req, res) => {
  try {
    // Validate typeFermeture
    const validTypes = [
      "RADIATION_AUTO_ENTREPRENEUR",
      "MISE_EN_SOMMEIL",
      "DISSOLUTION_LIQUIDATION",
      "DEPOT_DE_BILAN"
    ];
    
    if (!validTypes.includes(req.body.typeFermeture)) {
      return res.status(400).json({
        message: `Type de fermeture invalide. Options valides: ${validTypes.join(', ')}`,
        received: req.body.typeFermeture
      });
    }

    // Additional validation for DEPOT_DE_BILAN
    if (req.body.typeFermeture === "DEPOT_DE_BILAN" && !req.body.depotBilan) {
      return res.status(400).json({
        message: "Pour un dépôt de bilan, les informations de bilan sont obligatoires"
      });
    }

    const codeDossier = await generateCodeDossier("fermeture");

    const newDossier = new DossierFermeture({
      ...req.body,
      type: req.body.typeFermeture,
      statut: "en attente",
      etatAvancement: "formulaire",
      codeDossier
    });

    const created = await newDossier.save();
    
    await createNotification({
      userId: process.env.ADMIN_ID,
      message: "fermeture",
      link: `/admin/dossier/${created._id}`,
    });

    res.status(201).json(created);
    
  } catch (err) {
    console.error("Erreur enregistrement dossier fermeture :", err);
    res.status(500).json({ 
      message: "Erreur lors de la création du dossier.",
      error: err.message 
    });
  }
};

// Get fermeture dossier by ID
export const getDossierFermetureById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const dossier = await DossierFermeture.findById(req.params.id)
      .populate("fichiers", 'filename url')
      .populate('user', 'name email')
      .populate('boAffecte', 'name email')
      .populate("fichiersbo");

    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    res.json(dossier);
  } catch (err) {
    console.error("Erreur récupération dossier fermeture :", err);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: err.message 
    });
  }
};

// controllers/DossierFermetureController.js
// controllers/DossierFermetureController.js
export const addDocumentToFermeture = async (req, res) => {
  try {
    const { dossierId, documentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = {
      name: documentType,
      path: req.file.path.replace(/\\/g, '/')
    };

    const updatedFermeture = await DossierFermeture.findByIdAndUpdate(
      dossierId,
      { $push: { pieces: document } },
      { new: true }
    );

    if (!updatedFermeture) {
      return res.status(404).json({ message: 'Dossier fermeture not found' });
    }

    return res.status(200).json({
      message: 'Document added successfully',
      document,
      dossier: updatedFermeture
    });
  } catch (error) {
    console.error('Error adding document to fermeture:', error);
    return res.status(500).json({ 
      message: 'Failed to add document',
      error: error.message 
    });
  }
};
// Add documents to fermeture dossier
/*
export const ajouterPiecesFermeture = async (req, res) => {
  try {
    const fermetureId = req.params.id;
    const file = req.file; // Note: single file
    const { documentType } = req.body; // Get document type from body

    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' });
    }

    const fermeture = await DossierFermeture.findById(fermetureId);
    if (!fermeture) return res.status(404).json({ message: 'Dossier de fermeture introuvable.' });

    fermeture.pieces.push({
      name: documentType || file.originalname,
      path: `/${file.path.replace(/\\/g, "/")}`
    });

    await fermeture.save();
    res.status(200).json({ success: true, fermeture });
  } catch (err) {
    console.error("Erreur upload pièces fermeture :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};*/

// Update fermeture status
export const updateFermetureStatus = async (req, res) => {
  try {
    const fermeture = await DossierFermeture.findById(req.params.id);
    if (!fermeture) return res.status(404).json({ message: "Dossier introuvable." });

    if (req.body.statut) {
      fermeture.statut = req.body.statut;
    }
    if (req.body.etatAvancement) {
      fermeture.etatAvancement = req.body.etatAvancement;
    }

    await fermeture.save();

    res.status(200).json({
      message: "Statut mis à jour",
      fermeture: {
        _id: fermeture._id,
        statut: fermeture.statut,
        etatAvancement: fermeture.etatAvancement
      }
    });
  } catch (err) {
    console.error("Erreur mise à jour statut fermeture :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};