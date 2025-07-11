import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";


const router = express.Router();

router.get("/:userId", getNotifications); // Toutes les notifications de l’utilisateur
router.put("/read/:id", markNotificationAsRead); // Marquer une seule notif comme lue
router.put("/read-all/:userId", markAllAsRead); // Marquer toutes comme lues
router.delete("/:id", deleteNotification); // Supprimer une notification


export default router;
