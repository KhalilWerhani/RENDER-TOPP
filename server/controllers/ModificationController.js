// controllers/ModificationController.js
import DossierModification from '../models/dossierModificationModel.js';
import { createNotification } from "../utils/createNotification.js";

import { generateCodeDossier } from "../utils/generateCodeDossier.js";

import mongoose from 'mongoose';



// 🔁 Fonction réutilisable pour créer et notifier
const enregistrerEtNotifier = async (data, res) => {
  try {
        const codeDossier = await generateCodeDossier("modification");

   const created = await DossierModification.create({ ...data, codeDossier });

    await createNotification({
      userId: process.env.ADMIN_ID,
      message: "Un nouveau dossier a été créé.",
      link: `/admin/dossier/${created._id}`
    });
    /*creation d'une notification */

    res.status(201).json(created);
  } catch (err) {
    console.error(`Erreur enregistrement type ${data.type} :`, err);
    res.status(500).json({ message: "Erreur lors de la création du dossier." });
  }
};

// ✅ 6 types de modification avec notification
export const submitChangementActivite = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "CHANGEMENT_ACTIVITE" }, res);

export const submitChangementPresident = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "CHANGEMENT_PRESIDENT" }, res);

export const submitChangementDenomination = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "CHANGEMENT_DENOMINATION" }, res);

export const submitTransfertSiege = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "TRANSFERT_SIEGE" }, res);

export const submitTransformationSarlSas = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "TRANSFORMATION_SARL_EN_SAS" }, res);

export const submitTransformationSasSarl = async (req, res) =>
  enregistrerEtNotifier({ ...req.body, type: "TRANSFORMATION_SAS_EN_SARL" }, res);


export const getModificationDossierById = async (req, res) => {
  try {
    const dossier = await DossierModification.findById(req.params.id)
      .populate('user', 'name email')         // pour afficher nom/email du client
      .populate('boAffecte', 'name email')
      .populate('fichiers' ,  'filename url')   // pour afficher fichiers du BO

    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable." });
    }

    res.json(dossier);
  } catch (err) {
    console.error("Erreur chargement dossier modification :", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du dossier." });
  }
};



/*export const getDossierModificationById = async (req, res) => {
  try {
    const dossier = await DossierModification.findById(req.params.id);
    if (!dossier) return res.status(404).json({ message: "Dossier non trouvé." });
    res.status(200).json(dossier);
  } catch (err) {
    console.error("Erreur récupération dossier :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};*/

/*
export const ajouterPiecesModification = async (req, res) => {
  try {
    const modifId = req.params.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' });
    }

    const modification = await DossierModification.findById(modifId);
    if (!modification) return res.status(404).json({ message: 'Modification introuvable.' });

    const newPieces = files.map(file => ({
      name: file.originalname,
      path: `/${file.path.replace(/\\/g, "/")}`
    }));

    modification.pieces.push(...newPieces);
    await modification.save();

    res.status(200).json({ success: true, modification });
  } catch (err) {
    console.error("Erreur upload pièces modif :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};*/
export const addDocumentToModification = async (req, res) => {
  try {
    const { dossierId, documentType } = req.body;
    const filePath = req.filePath;

    const updatedModification = await DossierModification.findByIdAndUpdate(
      dossierId,
      {
        $push: {
          pieces: {
            name: documentType,
            path: filePath
          }
        }
      },
      { new: true }
    );

    if (!updatedModification) {
      return res.status(404).json({ message: 'Modification not found' });
    }

    return res.status(200).json({
      message: 'Document added to modification',
      modification: updatedModification,
      document: {
        name: documentType,
        path: filePath
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};









