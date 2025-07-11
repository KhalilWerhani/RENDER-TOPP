// controllers/adminKanbanController.js

import Dossier from "../models/dossierModel.js";
import DossierFermeture from "../models/DossierFermetureModel.js";
import DossierModification from "../models/dossierModificationModel.js";
import user from "../models/userModel.js"; // 🔁 ajout obligatoire

export const getAllDossiers = async (req, res) => {
  try {
    const [creations, fermetures, modifications] = await Promise.all([
      Dossier.find().populate("user", "name email"),
      DossierFermeture.find().populate("user", "name email"),
      DossierModification.find().populate("user", "name email"),
    ]);

    const mapProjet = (item, type) => ({
      id: item._id,
      codeDossier: item.codeDossier,
      client: item.user?.name || "Client inconnu",
      email: item.user?.email || "-",
      type,
      statut: item.statut,
      avancement: item.etatAvancement,
      createdAt: item.createdAt,
    });

    const projets = [
      ...creations.map(d => mapProjet(d, "Création")),
      ...fermetures.map(d => mapProjet(d, "Fermeture")),
      ...modifications.map(d => mapProjet(d, "Modification")),
    ];

    res.status(200).json({ success: true, projets });
  } catch (error) {
    console.error("Erreur Kanban admin:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
export const getDossierById = async (req, res) => {
  const { id } = req.params;

  try {
    const types = [
      { model: Dossier, label: "Création" },
      { model: DossierFermeture, label: "Fermeture" },
      { model: DossierModification, label: "Modification" },
    ];

    for (const { model, label } of types) {
      const dossier = await model.findById(id)
      .populate("fichiers", 'filename url')
      .populate("user", "name email")
      .populate("boAffecte", "name email");
      if (dossier) {
      

        return res.status(200).json({
          success: true,
          type: label,
          dossier,
        });
        
      }
    }

    return res.status(404).json({ success: false, message: "Dossier non trouvé." });
  } catch (error) {
    console.error("Erreur récupération dossier :", error.message);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};
export const getDossiersByBO = async (req, res) => {
  const { boId } = req.params;
  console.log("Requested BO ID:", boId); // Check received ID

  try {
    const [creations, fermetures, modifications] = await Promise.all([
      Dossier.find({ boAffecte: boId }).populate("user", "name email"),
      DossierFermeture.find({ boAffecte: boId }).populate("user", "name email"),
      DossierModification.find({ boAffecte: boId }).populate("user", "name email"),
    ]);

    console.log("Found documents:", { 
      creations: creations.length,
      fermetures: fermetures.length,
      modifications: modifications.length
    });

    const mapProjet = (item, type) => ({
      id: item._id,
      client: item.user?.name || "Client inconnu",
      email: item.user?.email || "-",
      type,
      statut: item.statut,
      avancement: item.etatAvancement,
      createdAt: item.createdAt,
    });

    const projets = [
      ...creations.map(d => mapProjet(d, "Création")),
      ...fermetures.map(d => mapProjet(d, "Fermeture")),
      ...modifications.map(d => mapProjet(d, "Modification")),
    ];

    res.status(200).json({ success: true, projets });
  } catch (error) {
    console.error("Erreur récupération dossiers par BO :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Dans votre adminKanbanController.js
export const searchDossiers = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Construction de la condition de recherche
    const searchConditions = {
      $or: [
        { codeDossier: { $regex: q, $options: 'i' } },
        { 'user.name': { $regex: q, $options: 'i' } },
        { 'user.email': { $regex: q, $options: 'i' } }
      ]
    };

    const [creations, fermetures, modifications] = await Promise.all([
      Dossier.find(searchConditions)
        .populate({
          path: 'user',
          select: 'name email',
          match: { 
            $or: [
              { name: { $regex: q, $options: 'i' } },
              { email: { $regex: q, $options: 'i' } }
            ]
          }
        })
        .populate('boAffecte', 'name email')
        .populate('fichiers', 'filename url'),
        
      
      DossierFermeture.find(searchConditions)
        .populate({
          path: 'user',
          select: 'name email',
          match: { 
            $or: [
              { name: { $regex: q, $options: 'i' } },
              { email: { $regex: q, $options: 'i' } }
            ]
          }
        })
        .populate('boAffecte', 'name email'),
      
      DossierModification.find(searchConditions)
        .populate({
          path: 'user',
          select: 'name email',
          match: { 
            $or: [
              { name: { $regex: q, $options: 'i' } },
              { email: { $regex: q, $options: 'i' } }
            ]
          }
        })
        .populate('boAffecte', 'name email')
    ]);

    // Filtrer les résultats où user est null (si le populate ne match pas)
    const filteredCreations = creations.filter(d => d.user);
    const filteredFermetures = fermetures.filter(d => d.user);
    const filteredModifications = modifications.filter(d => d.user);

    const results = [
      ...filteredCreations.map(d => ({ ...d._doc, type: "Création" })),
      ...filteredFermetures.map(d => ({ ...d._doc, type: "Fermeture" })),
      ...filteredModifications.map(d => ({ ...d._doc, type: "Modification" }))
    ];

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Erreur recherche:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

