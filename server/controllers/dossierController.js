import PDFDocument from "pdfkit";
import fs from "fs";


import Dossier from "../models/dossierModel.js";
import DossierModification from "../models/dossierModificationModel.js";
import DossierFermeture from "../models/DossierFermetureModel.js";
import { createNotification } from "../utils/createNotification.js";
import { generateCodeDossier } from "../utils/generateCodeDossier.js";





export const choisirDemarche = async (req, res) => {
  try {
    const { userId, typeDossier } = req.body;
console.log("req.userId :", userId);

    if (!userId || !typeDossier) {
      return res.status(400).json({ message: "userId et typeDossier sont obligatoires." });
    }
    const codeDossier = await generateCodeDossier("création");

    const nouveauDossier = await Dossier.create({
      user: userId,
      type: typeDossier,
      statut: "en attente",
      codeDossier
    });
    await createNotification({
      userId: process.env.ADMIN_ID,
      sender: userId,               // ✅ émetteur = utilisateur connecté (client)
      message: "Un nouveau dossier a été créé par .",
      link: `/admin/dossier/${nouveauDossier._id}`
    });
    /*creation d'une notification */

    res.status(201).json(nouveauDossier);
  } catch (err) {
    console.error("Erreur création dossier:", err);
    res.status(500).json({ message: "Erreur lors de la création du dossier.", error: err.message });
  }
};


export const remplirQuestionnaire = async (req, res) => {
  const { dossierId } = req.params;
  const { reponses } = req.body;
  const dossier = await Dossier.findByIdAndUpdate(dossierId, { questionnaire: reponses }, { new: true });
  res.json(dossier);
};

// dossierRoutes.js

// GET /api/dossier/user/all
// 🔥 Tous les projets (création + modification) de l'utilisateur connecté
export const getAllProject = async (req, res) => {
  try {
    const userId = req.user.id;

    const [dossiers, modifications, fermetures] = await Promise.all([
      Dossier.find({ user: userId })
        .populate("fichiers")
        .populate("boAffecte", "name email")
        .sort({ createdAt: -1 }),
      DossierModification.find({ user: userId })
        .populate("fichiers")
        .populate("boAffecte", "name email")
        .sort({ createdAt: -1 }),
      DossierFermeture.find({ user: userId })
        .populate("fichiers")
        .populate("boAffecte", "name email")
        .sort({ createdAt: -1 })
    ]);

    const dossiersFormatted = dossiers.map(d => ({
      ...d.toObject(),
      isModification: false,
      isFermeture: false
    }));

    const modificationsFormatted = modifications.map(m => ({
      ...m.toObject(),
      isModification: true,
      isFermeture: false
    }));

    const fermeturesFormatted = fermetures.map(f => ({
  ...f.toObject(),
   type: f.type || f.typeFermeture || 'FERMETURE', // Add default type if missing
  isModification: false,
  isFermeture: true
}));

    const all = [...dossiersFormatted, ...modificationsFormatted, ...fermeturesFormatted].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ success: true, dossiers: all });
  } catch (err) {
    console.error("Erreur récupération dossiers combinés :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};



export const genererStatutsPDF = async (req, res) => {
  const doc = new PDFDocument();
  const path = `./uploads/statuts_${Date.now()}.pdf`;
  doc.pipe(fs.createWriteStream(path));
  doc.text("Statuts de la société :");
  doc.text("Informations : ...");
  doc.end();
  res.download(path);
};
export const getAllDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find()
      .populate("user", "name email") // optionnel : pour avoir les infos du user
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, dossiers });
  } catch (error) {
    console.error("Erreur lors de la récupération des dossiers :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
export const getDossiersByStatut = async (req, res) => {
  const { statut } = req.params;

  const validStatuts = ["en attente", "en cours", "payé", "terminé"];
  if (!validStatuts.includes(statut)) {
    return res.status(400).json({ success: false, message: "Statut invalide" });
  }

  try {
    const dossiers = await Dossier.find({ statut })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, dossiers });
  } catch (error) {
    console.error("Erreur lors du filtrage :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
// ✅ Récupérer un dossier avec infos user et BO
export const getDossierCreationById = async (req, res) => {

  try {
    const dossier = await Dossier.findById(req.params.id)

      .populate('user', 'name email')  // Ensure this matches your User model
      .populate('boAffecte', 'name email ') // Note: 'boAffecte' spelling must match schema
      .populate('fichiers')
      .populate('fichiersbo')
      
      .lean(); // Convert to plain JS object

      
 

    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable." });
    }

    res.json(dossier);
  } catch (err) {
    console.error("Erreur récupération dossier création :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Ajouter des pièces jointes à un dossier
/*
export const ajouterPiecesDossier = async (req, res) => {
  try {
    const dossierId = req.params.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' });
    }

    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier introuvable.' });
    }

    const newPieces = files.map(file => ({
      name: file.originalname,
      path: `/${file.path.replace(/\\/g, "/")}`
    }));

    dossier.pieces.push(...newPieces);
    await dossier.save();

    res.status(200).json({ success: true, dossier });
  } catch (err) {
    console.error("Erreur upload pièces :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};*/
export const addDocumentToDossier = async (req, res) => {
  try {
    const { dossierId, documentType } = req.body;
    const filePath = req.filePath;

    const updatedDossier = await Dossier.findByIdAndUpdate(
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

    if (!updatedDossier) {
      return res.status(404).json({ message: 'Dossier not found' });
    }

    return res.status(200).json({
      message: 'Document added to dossier',
      dossier: updatedDossier,
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

// Exemple Express (dossierController.js)
export const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const updated = await Dossier.findByIdAndUpdate(id, { statut }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Erreur update statut :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Get existing dossier in 'paiement' status
export const getUnpaidDossier = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const existing = await Dossier.findOne({
      user: userId,
      etatAvancement: 'paiement',
      paymentStatus: { $in: ['pending', 'requires_action', 'failed'] }
    });

    if (existing) {
      return res.status(200).json({ success: true, dossier: existing });
    }
    return res.status(204).json({ success: true, dossier: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};


// Add these functions to your existing controller

// Update status for regular dossier
export const updateDossierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const updated = await Dossier.findByIdAndUpdate(
      id, 
      { statut },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      return res.status(404).json({ message: 'Dossier introuvable' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Erreur update statut dossier:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Update status for modification dossier
export const updateModificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const updated = await DossierModification.findByIdAndUpdate(
      id, 
      { statut },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      return res.status(404).json({ message: 'Dossier de modification introuvable' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Erreur update statut modification:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Update status for fermeture dossier
export const updateFermetureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const updated = await DossierFermeture.findByIdAndUpdate(
      id, 
      { statut },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      return res.status(404).json({ message: 'Dossier de fermeture introuvable' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Erreur update statut fermeture:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Send status email notification
export const sendStatusEmail = async (req, res) => {
  try {
    const { dossierId, dossierType, newStatus, clientEmail, clientName } = req.body;
    
    // Configure your email sending logic here (using nodemailer or similar)
    // Example:
    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: clientEmail,
      subject: `Mise à jour de votre dossier ${dossierId}`,
      html: `
        <p>Bonjour ${clientName},</p>
        <p>Le statut de votre dossier ${dossierType} (${dossierId}) a été mis à jour: <strong>${newStatus}</strong>.</p>
        <p>Cordialement,<br/>Votre équipe</p>
      `
    };
    
    // Uncomment when you have nodemailer configured
    // await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true,
      message: 'Email notification sent successfully'
    });
  } catch (err) {
    console.error("Erreur envoi email notification:", err);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de l'envoi de la notification par email"
    });
  }
};


export const updateDossier = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Handle file upload if needed
    if (req.files?.logo) {
      const logoFile = req.files.logo;
      // Process the file (save to disk, cloud storage, etc.)
      // For example, save to uploads folder
      const uploadPath = path.join(__dirname, '../uploads', logoFile.name);
      await logoFile.mv(uploadPath);
      updates.logo = `/uploads/${logoFile.name}`;
    }

    // Determine which collection to update based on dossier type
    let dossier;
    if (req.query.isFermeture === 'true') {
      dossier = await DossierFermeture.findByIdAndUpdate(id, updates, { new: true });
    } else if (req.query.isModification === 'true') {
      dossier = await DossierModification.findByIdAndUpdate(id, updates, { new: true });
    } else {
      dossier = await Dossier.findByIdAndUpdate(id, updates, { new: true });
    }

    if (!dossier) {
      return res.status(404).json({ success: false, message: 'Dossier not found' });
    }

    res.json({ success: true, dossier });
  } catch (err) {
    console.error("Error updating dossier:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




