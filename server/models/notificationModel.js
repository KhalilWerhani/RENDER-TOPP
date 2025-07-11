// models/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Expéditeur

  message: { type: String, required: true },
  link: { type: String }, // redirection (ex : /admin/dossier/xyz)
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
