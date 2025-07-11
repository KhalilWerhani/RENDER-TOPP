// controllers/demarcheProgressController.js
import DemarcheProgress from '../models/DemarcheProgress.js';

// Sauvegarder ou mettre à jour la progression
export const saveProgress = async (req, res) => {
  try {
    const { userId, typeDemarche, currentStep, formData } = req.body;

    const progress = await DemarcheProgress.findOneAndUpdate(
      { userId, typeDemarche },
      { currentStep, formData, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer la progression d’un utilisateur pour une démarche
export const getProgress = async (req, res) => {
  const { userId, typeDemarche } = req.params;
  let progress = await DemarcheProgress.findOne({ userId, typeDemarche });

  if (!progress) {
    progress = new DemarcheProgress({
      userId,
      typeDemarche,
      currentStep: 0,
      formData: {}, // Default empty data
      isCompleted: false,
      lastUpdated: new Date()
    });
    await progress.save();
  }

  res.status(200).json(progress);
};


// Récupérer toutes les démarches en cours d’un utilisateur
export const getAllProgressByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const progresses = await DemarcheProgress.find({ userId });


    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Marquer une démarche comme terminée
export const completeProgress = async (req, res) => {
  try {
    const { userId, typeDemarche } = req.body;

    const progress = await DemarcheProgress.findOneAndUpdate(
      { userId, typeDemarche },
      { isCompleted: true },
      { new: true }
    );

    res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/demarcheProgressController.js
export const resetProgress = async (req, res) => {
  try {
    const { userId, typeDemarche } = req.body;

    await DemarcheProgress.findOneAndDelete({ userId, typeDemarche });

    res.status(200).json({ success: true, message: "Progression réinitialisée." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

