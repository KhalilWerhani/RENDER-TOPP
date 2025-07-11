import mongoose from "mongoose";

import Message from "../models/messageModel.js";

// Envoyer un message
export const sendMessage = async (req, res) => {
  try {
    const sender = req.body.userId; // injecté via middleware d'auth
    const { receiver, content } = req.body;

    // Validation des champs requis
    if (!sender || !receiver || !content) {
      return res.status(400).json({ success: false, message: "Champs requis manquants." });
    }

    // Création du message
    const message = await Message.create({ sender, receiver, content });

    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Erreur dans sendMessage:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// Récupérer la conversation entre deux utilisateurs
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    const conversationMap = new Map();

    for (const msg of messages) {
      const id1 = msg.sender._id.toString();
      const id2 = msg.receiver._id.toString();

      const otherUser = id1 === userId ? msg.receiver : msg.sender;
      const key = [id1, id2].sort().join("_");

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          _id: key,
          user: otherUser,
          lastMessage: {
            content: msg.content,
            read: msg.read,
            createdAt: msg.createdAt,
            senderId: msg.sender._id.toString()
          }
        });
      }
    }

    const conversations = Array.from(conversationMap.values());
    res.json({ success: true, conversations });

  } catch (error) {
    console.error("Erreur getAllConversations:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};




export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.messageId, { read: true });
    if (!message) return res.status(404).json({ success: false, message: "Message introuvable" });
    res.status(200).json({ success: true, message: "Marqué comme lu" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
export const markConversationAsRead = async (req, res) => {
  const receiverId = req.user.id; // celui qui lit
  const senderId = req.params.userId; // l'expéditeur

  try {
    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Conversation marquée comme lue" });
  } catch (err) {
    console.error("Erreur lors du marquage comme lu :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
export const getMessagesBetweenUsers = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

export const getunreadconversation = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const count = await Message.countDocuments({
      receiver: userId,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  
  }
};