import Dossier from "../models/dossierModel.js";
import DossierModification from '../models/dossierModificationModel.js';
import DossierFermeture from '../models/DossierFermetureModel.js';
import Paiement from '../models/paiementModel.js';
import Rating from "../models/Rating.js";


// GET /api/bo/dossiers-attribues
export const getDossiersAttribues = async (req, res) => {
  try {
    const boId = req.user.id;

    const dossiers = await Dossier.find({ boAffecte: boId })
      .sort({ createdAt: -1 })
      .populate("user", "name email codedossier");

    res.status(200).json({ success: true, data: dossiers });
  } catch (error) {
    console.error("Erreur récupération dossiers BO :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};
// controllers/boController.js

export const getAllDossiersBO = async (req, res) => {
  try {
        const boId = req.user.id;

    const { type, statut, dateDebut, dateFin, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filtreCommun = {boAffecte: boId};
    if (statut) filtreCommun.statut = statut;

    if (dateDebut || dateFin) {
      filtreCommun.createdAt = {};
      if (dateDebut) filtreCommun.createdAt.$gte = new Date(dateDebut);
      if (dateFin) filtreCommun.createdAt.$lte = new Date(dateFin);
    }

    // ✅ Si type est précisé, on fait une requête paginée sur un seul modèle
    if (type) {
      let model;
      if (type === 'création') model = Dossier;
      else if (type === 'modification') model = DossierModification;
      else if (type === 'fermeture') model = DossierFermeture;

      if (!model) {
        return res.status(400).json({ success: false, message: "Type de dossier invalide." });
      }

      const dossiers = await model.find(filtreCommun)
        .populate("user", "name email codedossier")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await model.countDocuments(filtreCommun);

      let dossiersFormatted = dossiers.map(d => ({ ...d.toObject(), type }));

      // Filtrage par nom ou email
      if (search) {
        const term = search.toLowerCase();
        dossiersFormatted = dossiersFormatted.filter(d => {
          const name = d.user?.name?.toLowerCase() || '';
          const email = d.user?.email?.toLowerCase() || '';
          return name.includes(term) || email.includes(term);
        });
      }

      return res.status(200).json({
        success: true,
        dossiers: dossiersFormatted,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // ✅ Si aucun type n’est précisé → tout afficher (sans pagination)
    const [creations, modifications, fermetures] = await Promise.all([
      Dossier.find(filtreCommun).populate("user", "name email").sort({ createdAt: -1 }),
      DossierModification.find(filtreCommun).populate("user", "name email").sort({ createdAt: -1 }),
      DossierFermeture.find(filtreCommun).populate("user", "name email").sort({ createdAt: -1 }),
    ]);

    let resultats = [
      ...creations.map(d => ({ ...d.toObject(), type: 'création' })),
      ...modifications.map(d => ({ ...d.toObject(), type: 'modification' })),
      ...fermetures.map(d => ({ ...d.toObject(), type: 'fermeture' }))
    ];

    if (search) {
      const term = search.toLowerCase();
      resultats = resultats.filter(d => {
        const name = d.user?.name?.toLowerCase() || '';
        const email = d.user?.email?.toLowerCase() || '';
        return name.includes(term) || email.includes(term);
      });
    }

    // Tri global par date
    resultats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, dossiers: resultats });
  } catch (err) {
    console.error("Erreur getAllDossiersBO :", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};
/*

export const getDashboardStats = async (req, res) => {
  try {
    // Total par type
    const totalCreation = await Dossier.countDocuments();
    const totalModification = await DossierModification.countDocuments();
    const totalFermeture = await DossierFermeture.countDocuments();

    const totalDossiers = totalCreation + totalModification + totalFermeture;

    // Statuts
    const statutList = ['en attente', 'en cours', 'payé', 'terminé'];
    const statutCounts = {};
    for (let statut of statutList) {
      const [a, b, c] = await Promise.all([
        Dossier.countDocuments({ statut }),
        DossierModification.countDocuments({ statut }),
        DossierFermeture.countDocuments({ statut })
      ]);
      statutCounts[statut] = a + b + c;
    }

    // Montant total encaissé
    const paiements = await Paiement.aggregate([
      { $match: { statut: 'payé' } },
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);
    const totalEncaisse = paiements[0]?.total || 0;

    // Dossiers récents (5 derniers)
    const [recentsA, recentsB, recentsC] = await Promise.all([
      Dossier.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      DossierModification.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      DossierFermeture.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

    const dossiersRecents = [...recentsA, ...recentsB, ...recentsC]
      .map(d => ({ ...d.toObject(), type: d.type || d.typeDossier || 'N/A' }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // ✅ Répartition par date (création)
    let creationParDate = [];
    try {
      creationParDate = await Dossier.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } catch (err) {
      console.warn("⚠️ Impossible de générer le graphique par date :", err.message);
    }

    res.status(200).json({
      success: true,
      stats: {
        totalDossiers,
        parType: {
          création: totalCreation,
          modification: totalModification,
          fermeture: totalFermeture
        },
        parStatut: statutCounts,
        totalEncaisse,
        creationParDate
      },
      dossiersRecents
    });
  } catch (err) {
    console.error("Erreur dashboard BO :", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};*/

// In your backend controller (e.g., boController.js)
export const getDashboardStats = async (req, res) => {
  try {
    const { range } = req.query;
    const boId = req.user._id;

    // Calculate date range based on the query parameter
    let startDate;
    const endDate = new Date();
    
    switch (range) {
      case 'day':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    // 1. Get dossier counts by type
    const [totalCreation, totalModification, totalFermeture] = await Promise.all([
      Dossier.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      DossierModification.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      DossierFermeture.countDocuments({ statut: 'fermé', updatedAt: { $gte: startDate, $lte: endDate } })
    ]);

    // 2. Get dossier status counts (updated to match your schema enum values)
    const [dossiersATraite, dossiersEnTraitement, dossiersTraites] = await Promise.all([
      Dossier.countDocuments({ statut: 'a traité' }),
      Dossier.countDocuments({ statut: 'en traitement' }),
      Dossier.countDocuments({ statut: 'traité' })
    ]);

    // Also get counts for DossierModification with same statuses
    const [modifsATraite, modifsEnTraitement, modifsTraites] = await Promise.all([
      DossierModification.countDocuments({ statut: 'a traité' }),
      DossierModification.countDocuments({ statut: 'en traitement' }),
      DossierModification.countDocuments({ statut: 'traité' })
    ]);

    const [FermetureATraite, FermetureEnTraitement, FermetureTraites] = await Promise.all([
      DossierFermeture.countDocuments({ statut: 'a traité' }),
      DossierFermeture.countDocuments({ statut: 'en traitement' }),
      DossierFermeture.countDocuments({ statut: 'traité' })
    ]);

    // Combine counts for both Dossier and DossierModification
    const totalATraite = dossiersATraite + modifsATraite + FermetureATraite;
    const totalEnTraitement = dossiersEnTraitement + modifsEnTraitement + FermetureEnTraitement;
    const totalTraites = dossiersTraites + modifsTraites + FermetureTraites;

    // 3. Get client ratings
    const clientRatings = await Rating.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$value", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // 4. Get creation by date for the chart
    const creationParDate = await Dossier.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { 
        $group: {
          _id: { 
            $dateToString: { 
              format: range === 'day' ? "%H" : "%Y-%m-%d", 
              date: "$createdAt" 
            } 
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5. Get dossiers by type - Modified to include all types with zero counts
    const allTypes = ["SAS", "SASU", "SARL", "EURL", "SCI", "AUTO-ENTREPRENEUR", "Entreprise individuelle", "Association"];
    const parTypeRaw = await Dossier.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // Create an object with all types initialized to 0
    let parType = allTypes.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    // Update with actual counts from the database
    parTypeRaw.forEach(item => {
      parType[item._id] = item.count;
    });

    // 6. Get dossiers by status
    const parStatut = await Dossier.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$statut", count: { $sum: 1 } } }
    ]);

    // 7. Get recent dossiers (both Dossier and DossierModification)
    const [dossiersRecents, modificationsRecentes, fermeturesRecentes] = await Promise.all([
      Dossier.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name'),
      DossierModification.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name'),
      DossierFermeture.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name')
    ]);

    const dossiersRecentsCombines = [...dossiersRecents, ...modificationsRecentes, ...fermeturesRecentes]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    // Format the data for the frontend
    const stats = {
      totalCreation,
      totalModification,
      totalFermeture,
      statusCounts: {
        aTraite: totalATraite,
        enTraitement: totalEnTraitement,
        traites: totalTraites
      },
      clientRatings: clientRatings.map(r => ({ value: r._id, count: r.count })),
      creationParDate,
      parType,
      parStatut: parStatut.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      dossierCounts: {
        totalDossiers: await Dossier.countDocuments({}),
        totalModifications: await DossierModification.countDocuments({}),
        totalFermetures: await DossierFermeture.countDocuments({})
      }
    };

    res.json({
      success: true,
      stats,
      dossiersRecents: dossiersRecentsCombines
    });

  } catch (err) {
    console.error("Erreur getDashboardStats:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


