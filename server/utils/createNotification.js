import Notification from "../models/notificationModel.js";
import { io } from "../server.js"; // ou chemin réel
import { connectedUsers } from "../server.js"; // doit être exporté aussi

export const createNotification = async ({ userId, message, link = "" }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      link
    });

    // 🎯 Envoi temps réel si l’utilisateur est connecté
    const socketId = connectedUsers.get(userId.toString());
    if (socketId && io) {
      io.to(socketId).emit("new-notification", {
        _id: notification._id,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt
      });
    }

  } catch (error) {
    console.error("❌ Erreur création notification :", error.message);
  }
};
