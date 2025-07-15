import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import Dossier from "../models/dossierModel.js";
import DossierFermeture from '../models/DossierFermetureModel.js';
import DossierModification from '../models/dossierModificationModel.js';
import bcrypt from 'bcryptjs';

import { createNotification } from "../utils/createNotification.js";

// POST /api/admin/create-bo
export const createBO = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: "Champs requis manquants" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Un utilisateur avec cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBO = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'BO'
    });

    await newBO.save();

    res.status(201).json({ success: true, message: "Collaborateur BO créé avec succès" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllBO = async (req, res) => {
  try {
    const boUsers = await userModel.find({ role: 'BO' }).select('-password');
    res.status(200).json({ success: true, data: boUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getBOById = async (req, res) => {
  try {
    const bo = await userModel.findOne({ _id: req.params.id, role: 'BO' }).select('-password');
    if (!bo) {
      return res.status(404).json({ success: false, message: "Collaborateur BO introuvable" });
    }
    res.status(200).json({ success: true, data: bo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteBO = async (req, res) => {
  try {
    const bo = await userModel.findOneAndDelete({ _id: req.params.id, role: 'BO' });
    if (!bo) {
      return res.status(404).json({ success: false, message: "Collaborateur BO introuvable ou déjà supprimé" });
    }
    res.status(200).json({ success: true, message: "Collaborateur BO supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateBO = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await userModel.findOne({ email: req.body.email });
    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const updated = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Erreur updateBO :", err);
    res.status(500).json({ message: "Erreur interne lors de la mise à jour." });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const nombreClients = await userModel.countDocuments({ role: "user" });
    const nombreProjets = await Dossier.countDocuments();

    // Exemple de rating BO fictif ou calculé
    const boRating = 4.6;

    res.status(200).json({
      success: true,
      data: {
        nombreProjets,
        nombreClients,
        boRating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
export const updateBOPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Mot de passe invalide." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const updated = await userModel.findByIdAndUpdate(id, { password: hashed });

    res.json({ success: true, message: "Mot de passe mis à jour." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe." });
  }
};
export const assignDossierToBO = async (req, res) => {
  console.log("📩 assignDossierToBO reçu :", req.body);

  try {

    const { dossierId, boId, type } = req.body;

    if (!dossierId || !boId || !type) {
      return res.status(400).json({ success: false, message: "Données manquantes." });
    }

    const boUser = await userModel.findById(boId);
    if (!boUser || boUser.role !== 'BO') {
      return res.status(400).json({ success: false, message: "Utilisateur BO invalide." });
    }

    let Model;
    switch (type) {
      case "Création":
        Model = Dossier;
        break;
      case "Modification":
        Model = DossierModification;
        break;
      case "Fermeture":
        Model = DossierFermeture;
        break;
      default:
        return res.status(400).json({ success: false, message: "Type invalide." });
    }

    const dossier = await Model.findById(dossierId);
    if (!dossier) {
      return res.status(404).json({ success: false, message: "Dossier introuvable." });
    }

    dossier.boAffecte = boId;
    await dossier.save();

    const populatedDossier = await Model.findById(dossierId)
      .populate("boAffecte", "name email")
      .populate("user", "name email");
    const libelleType = populatedDossier.type || type;

    await createNotification({
      userId: boId,
      sender: populatedDossier.user?._id, // ✅ sender bien défini
      message: `Nouveau dossier ${type} de ${populatedDossier.user?.name || "inconnu"} attribué.`,
      link: `/admin/dossier/${dossierId}`
    });
    await createNotification({
      userId: populatedDossier.user?._id, // ✅ ID du client
      sender: boId, // l’utilisateur BO
      message: `Votre dossier ${libelleType} a été pris en charge par ${boUser.name} (${boUser.email})`,
      link: `/dashboard/projets`
    });


    res.status(200).json({ success: true, dossier: populatedDossier });
  } catch (err) {
    console.error("Erreur assignation :", err);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

export const getProjetsByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const [creations, fermetures, modifications] = await Promise.all([
      Dossier.find({ user: clientId }),
      DossierFermeture.find({ user: clientId }),
      DossierModification.find({ user: clientId }),
    ]);

    const mapProjet = (item, type) => ({
      id: item._id,
      type, // "Création", "Fermeture", "Modification"
      sousType: item.type || "-", // c’est ici qu’on récupère SAS, SARL, TRANSFERT_SIEGE...
      statut: item.statut,
      createdAt: item.createdAt,
    });

    const projets = [
      ...creations.map(p => mapProjet(p, "Création")),
      ...fermetures.map(p => mapProjet(p, "Fermeture")),
      ...modifications.map(p => mapProjet(p, "Modification")),
    ];

    res.status(200).json({ projets });
  } catch (err) {
    console.error("Erreur chargement projets client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add these new functions to your existing adminController.js

// Helper functions
const formatFullDossierData = (dossier, dossierType) => {
  const baseData = {
    ...dossier.toObject(),
    type: dossierType,
    user: dossier.user,
    statut: dossier.statut,
    createdAt: dossier.createdAt,
    updatedAt: dossier.updatedAt,
    boAffecte: dossier.boAffecte,
    codeDossier: dossier.codeDossier || `DOS-${dossier._id.toString().slice(-6).toUpperCase()}`,
    fichiers: dossier.fichiers || [],
    fichiersbo: dossier.fichiersbo || [],
    questionnaire: dossier.questionnaire || {},
    entreprise: dossier.entreprise || null,
    siret: dossier.siret || (dossier.entreprise ? dossier.entreprise.siret : null),
    domiciliation: dossier.domiciliation || (dossier.entreprise ? dossier.entreprise.adresse : null),
    nomEntreprise: dossier.nomEntreprise || (dossier.entreprise ? dossier.entreprise.nom : null)
  };

  // Add type-specific fields
  if (dossierType === 'Création') {
    return {
      ...baseData,
      typeEntreprise: dossier.typeEntreprise,
      logo: dossier.logo
    };
  } else if (dossierType === 'Modification') {
    return {
      ...baseData,
      // Add all modification-specific fields
      type: dossier.type,
      formeSociale: dossier.formeSociale,
      modificationDate: dossier.modificationDate,
      typeChangement: dossier.typeChangement,
      nouvelleActivite: dossier.nouvelleActivite,
      nouveauPresident: dossier.nouveauPresident,
      nouveauNom: dossier.nouveauNom,
      adresseActuelle: dossier.adresseActuelle,
      adresseNouvelle: dossier.adresseNouvelle,
      vendeurs: dossier.vendeurs,
      modifs: dossier.modifs,
      beneficiaireEffectif: dossier.beneficiaireEffectif,
      createdWithTop: dossier.createdWithTop,
      modifiedStatuts: dossier.modifiedStatuts,
      artisanale: dossier.artisanale
    };
  } else if (dossierType === 'Fermeture') {
    return {
      ...baseData,
      // Add all fermeture-specific fields
      typeFermeture: dossier.typeFermeture,
      formeSociale: dossier.formeSociale,
      modificationDate: dossier.modificationDate,
      artisanale: dossier.artisanale,
      timing: dossier.timing,
      observations: dossier.observations
    };
  }

  return baseData;
};

// New controller functions
export const getCombinedDossiers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, type, status } = req.query;
    const skip = (page - 1) * pageSize;

    // Build base query conditions
    const baseQuery = {};
    if (status) baseQuery.statut = status;

    // If type is specified, only query that type
    if (type) {
      let Model;
      switch (type) {
        case 'Création':
          Model = Dossier;
          break;
        case 'Modification':
          Model = DossierModification;
          break;
        case 'Fermeture':
          Model = DossierFermeture;
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid dossier type' });
      }

      const [dossiers, total] = await Promise.all([
        Model.find(baseQuery)
          .skip(skip)
          .limit(parseInt(pageSize))
          .populate('user', 'name email')
          .populate('boAffecte', 'name email')
          .populate('fichiers' ,  'filename url')
          .populate('fichiersbo')
          .lean()
          .sort({ createdAt: -1 }),
        Model.countDocuments(baseQuery)
      ]);

      return res.status(200).json({
        success: true,
        dossiers: dossiers.map(d => formatFullDossierData(d, type)),
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });
    }

    // If no type specified, query all types
     const [creations, modifications, fermetures, totalCreations, totalModifications, totalFermetures] = await Promise.all([
      Dossier.find(baseQuery)
        .skip(skip)
        .limit(parseInt(pageSize))
        .populate('user', 'name email')
        .populate('boAffecte', 'name email')
        .populate('fichiers', 'filename url')
        .populate('fichiersbo')
        .sort({ createdAt: -1 }),
      DossierModification.find(baseQuery)
        .skip(skip)
        .limit(parseInt(pageSize))
        .populate('user', 'name email')
        .populate('boAffecte', 'name email')
        .populate('fichiers', 'filename url')
        .populate('fichiersbo')
        .sort({ createdAt: -1 }),
      DossierFermeture.find(baseQuery)
        .skip(skip)
        .limit(parseInt(pageSize))
        .populate('user', 'name email')
        .populate('boAffecte', 'name email')
        .populate('fichiers', 'filename url')
        .populate('fichiersbo')
        .sort({ createdAt: -1 }),
      Dossier.countDocuments(baseQuery),
      DossierModification.countDocuments(baseQuery),
      DossierFermeture.countDocuments(baseQuery)
    ]);

    const combinedDossiers = [
      ...creations.map(d => formatFullDossierData(d, 'Création')),
      ...modifications.map(d => formatFullDossierData(d, 'Modification')),
      ...fermetures.map(d => formatFullDossierData(d, 'Fermeture'))
    ];

    // Sort combined results by createdAt (newest first)
    combinedDossiers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination to the combined results
    const paginatedResults = combinedDossiers.slice(skip, skip + parseInt(pageSize));

    res.status(200).json({
      success: true,
      dossiers: paginatedResults,
      total: totalCreations + totalModifications + totalFermetures,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });

  } catch (error) {
    console.error('Error fetching combined dossiers:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};


// Nouvelle fonction pour mettre à jour le statut simplement
// controllers/dossierController.js

// Update dossier with SIRET and domiciliation
export const updateDossier = async (req, res) => {
  try {
    const { id } = req.params;
    const { siret, domiciliation, logo, nomEntreprise } = req.body;

    const updateData = { 
      siret, 
      domiciliation, 
      logo,
      nomEntreprise
    };

    // Automatically set status to "traité" if all required fields are provided
    if (siret && domiciliation && nomEntreprise) {
      updateData.statut = "traité";
    }

    const dossier = await Dossier.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!dossier) {
      return res.status(404).json({ success: false, message: "Dossier introuvable" });
    }

    res.status(200).json({
      success: true,
      message: "Dossier mis à jour avec succès",
      dossier
    });
  } catch (error) {
    console.error('Error updating dossier:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
};

// Similar updates for modification and fermeture controllers
// Example for updateModification
export const updateModification = async (req, res) => {
  try {
    const { id } = req.params;
    const { siret, domiciliation, logo, nomEntreprise, statut } = req.body;

    const updateData = { 
      siret,
      domiciliation,
      logo,
      nomEntreprise,
      statut,
      $set: {
        'entreprise.siret': siret,
        'entreprise.adresse': domiciliation,
        'entreprise.nom': nomEntreprise,
      }
    };

    const modification = await DossierModification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!modification) {
      return res.status(404).json({ success: false, message: "Modification introuvable" });
    }

    res.status(200).json({
      success: true,
      message: "Modification mise à jour avec succès",
      modification
    });
  } catch (error) {
    console.error('Error updating modification:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
};

// Example for updateModification
export const updateFermeture = async (req, res) => {
  try {
    const { id } = req.params;
    const { siret, domiciliation, logo, nomEntreprise, statut } = req.body;

    const updateData = { 
      siret,
      domiciliation,
      logo,
      nomEntreprise,
      statut,
      $set: {
        'entreprise.siret': siret,
        'entreprise.adresse': domiciliation,
        'entreprise.nom': nomEntreprise,
      }
    };

    const fermeture = await DossierFermeture.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!fermeture) {
      return res.status(404).json({ success: false, message: "Fermeture introuvable" });
    }

    res.status(200).json({
      success: true,
      message: "Fermeture mise à jour avec succès",
      fermeture
    });
  } catch (error) {
    console.error('Error updating fermeture:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
};
