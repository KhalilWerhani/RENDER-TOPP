import Notification from "../models/notificationModel.js";

// ✅ Récupérer toutes les notifications d’un utilisateur
// Dans votre contrôleur backend
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name') // Ajoutez cette ligne pour peupler les données utilisateur
      .populate("sender", "name email") // pour afficher le BO dans la notif
      .exec();
    
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message
    });
  }

};

// ✅ Marquer une notification comme lue
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ success: true, message: "Notification marquée comme lue" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

// ✅ Marquer toutes les notifications comme lues
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "Toutes les notifications ont été marquées comme lues" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

// ✅ Supprimer une notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Notification supprimée" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};


