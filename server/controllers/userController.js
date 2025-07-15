import userModel from "../models/userModel.js";
import Dossier from '../models/dossierModel.js';
import DossierModification from "../models/dossierModificationModel.js";
import Document from "../models/Document.js";
import DossierFermeture from "../models/DossierFermetureModel.js";
import Expert from "../models/Expert.js";
import File from "../models/File.js";

export const getUserData = async (req , res ) => {
    
    try{
        const {userId} = req.body;
        
        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({ succes:false , message: 'User not found'});
        }

        res.json({
            succes : true ,
            userData : {
                id : user._id,
                name : user.name ,
                email :user.email,
                phone :user.phone,
                cni :user.cni,
                passportNumber :user.passportNumber,
                state :user.state,
                postCode :user.postCode,            
                isAccountVerified : user.isAccountVerified ,
                role : user.role ,
                user: user.role,

            }
        })

    }catch(error) {
        res.json ({succes:false , message: error.message});
    }

}
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id).select("name email phone role lastLogin");

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password"); // Exclude password for safety
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;  //
    const currentUser = await userModel.findOne({_id : userId},"-password"); // Exclude password for safety
    res.status(200).json({ success: true, currentUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch currentUser", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
    try {
      const userId = req.body.userId;
      const updatedFields = req.body;
  
      // Remove userId from update to avoid unintended modification
      delete updatedFields.userId;
  
      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedFields, {
        new: true,
      });
  
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
    }
  };

  export const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;  // Access userId from URL params
      
      const user = await userModel.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
  };
  
  export const adminUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedFields = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour", error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Compteurs par statut
    const [
      dossiersTraites,
      dossiersEnTraitement,
      dossiersATraiter,
      modifsTraites,
      modifsEnTraitement,
      modifsATraiter,
      fermeturesTraites,
      fermeturesATraiter,
      fermeturesEnTraitement
    ] = await Promise.all([
      Dossier.countDocuments({ user: userId, statut: 'traité' }),
      Dossier.countDocuments({ user: userId, statut: 'en traitement' }),
      Dossier.countDocuments({ user: userId, statut: 'a traité' }),
      DossierModification.countDocuments({ user: userId, statut: 'traité' }),
      DossierModification.countDocuments({ user: userId, statut: 'en traitement' }),
      DossierModification.countDocuments({ user: userId, statut: 'a traité' }),
      DossierFermeture.countDocuments({ user: userId, statut: 'traité' }),
      DossierFermeture.countDocuments({ user: userId, statut: 'a traité' }),
      DossierFermeture.countDocuments({ user: userId, statut: 'en traitement' })

    ]);
        // Documents reçus
    const documentsReceived = await Document.countDocuments({ destinataire: userId });

    // Compter tous les documents envoyés
    const [
      dossiersWithPieces,
      modifsWithPieces,
      fermeturesWithPieces,
      docsUploaded
    ] = await Promise.all([
      Dossier.find({ user: userId }).select('fichiers'),
      DossierModification.find({ user: userId }).select('fichiers'),
      DossierFermeture.find({ user: userId }).select('fichiers'),
      Document.countDocuments({ uploader: userId })
    ]);

    const countPieces = (docs) =>
      docs.reduce((acc, d) => acc + (Array.isArray(d.fichiers) ? d.fichiers.length : 0), 0);

    const documentsUploaded =
      countPieces(dossiersWithPieces) +
      countPieces(modifsWithPieces) +
      countPieces(fermeturesWithPieces) +
      docsUploaded;

    // Activité récente
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const [dossierActs, modifActs, fermetureActs] = await Promise.all([
      Dossier.find({ user: userId, createdAt: { $gte: last7Days } }).select('createdAt'),
      DossierModification.find({ user: userId, createdAt: { $gte: last7Days } }).select('createdAt'),
      DossierFermeture.find({ user: userId, createdAt: { $gte: last7Days } }).select('createdAt')
    ]);

    const allActivities = [...dossierActs, ...modifActs, ...fermetureActs];

    const activityByDay = Array(7).fill(0);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    allActivities.forEach(doc => {
      const dayIndex = new Date(doc.createdAt).getDay();
      activityByDay[dayIndex]++;
    });

    const activiteRecent = days.map((day, i) => ({
      day,
      value: activityByDay[i]
    }));

    res.json({
      success: true,
      dossiersTraites: dossiersTraites + modifsTraites + fermeturesTraites,
      dossiersATraiter: dossiersATraiter + modifsATraiter + fermeturesATraiter,
      dossiersEnTraitement: dossiersEnTraitement + modifsEnTraitement + fermeturesEnTraitement,
      documentsUploaded,
      documentsReceived,
      activiteRecent
    });

  } catch (err) {
    console.error("Erreur getUserStats:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getExpertInfo = async (req, res) => {
  try {
    const expert = await Expert.findOne(); // Gets the first expert
    if (!expert) {
      return res.status(404).json({ 
        success: false, 
        message: "No expert found" 
      });
    }
    res.json({ success: true, expert });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getUserDossiers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, type } = req.query;
    const skip = (page - 1) * pageSize;
    const userId = req.user.id;

    // Base query for all types
    const baseQuery = { 
      user: userId,
      statut: 'traité'
    };

    // Fetch all dossier types with status "traité" for the current user
    const [creations, modifications, fermetures] = await Promise.all([
      type && type !== 'Création' ? [] : 
        Dossier.find(baseQuery)
          .populate('user', 'name email')
          .populate('boAffecte', 'name')
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
      
      type && type !== 'Modification' ? [] :
        DossierModification.find(baseQuery)
          .populate('user', 'name email')
          .populate('boAffecte', 'name')
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean(),
      
      type && type !== 'Fermeture' ? [] :
        DossierFermeture.find(baseQuery)
          .populate('user', 'name email')
          .populate('boAffecte', 'name')
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .lean()
    ]);

    // Combine all dossier types and add a type field
    const combinedDossiers = [
      ...creations.map(d => ({ ...d, type: 'Création' })),
      ...modifications.map(d => ({ ...d, type: 'Modification' })),
      ...fermetures.map(d => ({ ...d, type: 'Fermeture' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get counts for pagination
    const counts = await Promise.all([
      type && type !== 'Création' ? 0 : Dossier.countDocuments(baseQuery),
      type && type !== 'Modification' ? 0 : DossierModification.countDocuments(baseQuery),
      type && type !== 'Fermeture' ? 0 : DossierFermeture.countDocuments(baseQuery)
    ]);

    const total = counts.reduce((sum, count) => sum + count, 0);

    res.status(200).json({
      success: true,
      dossiers: combinedDossiers,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getDossierFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Try to find in each collection
    let dossier = await Dossier.findOne({ 
      _id: id, 
      user: userId 
    }).populate('fichiers',  'filename url');

    if (!dossier) {
      dossier = await DossierModification.findOne({ 
        _id: id, 
        user: userId 
      }).populate('fichiers',  'filename url');
    }

    if (!dossier) {
      dossier = await DossierFermeture.findOne({ 
        _id: id, 
        user: userId 
      }).populate('fichiers','filename url');
    }

    if (!dossier) {
      return res.status(404).json({
        success: false,
        message: 'Dossier not found'
      });
    }

    res.status(200).json({
      success: true,
      dossier
    });
  } catch (error) {
    console.error('Error fetching dossier files:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};