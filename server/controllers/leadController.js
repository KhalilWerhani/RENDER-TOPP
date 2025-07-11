import Lead from "../models/Lead.js";
import transporter from "../config/nodemailer.js";

// Contrôleur pour enregistrer un lead et envoyer un email
export const recevoirLead = async (req, res) => {
  try {
    const { prenom, nom, email, telephone, typeProjet, message } = req.body;

    // Création du lead
    const lead = await Lead.create({ prenom, nom, email, telephone, typeProjet, message });

    // Email envoyé au gestionnaire (ton adresse)
    await transporter.sendMail({
      from: `"Top-Juridique" <${process.env.SENDER_EMAIL}>`,
      to: process.env.SENDER_EMAIL,  // a corriger apres avec le mail de l'admin 
      replyTo: email, // permet au gestionnaire de répondre au lead directement
      subject: `🆕 Nouveau lead : ${prenom} ${nom}`,
      html: `
        <h2>Nouveau prospect</h2>
        <p><strong>Nom :</strong> ${prenom} ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Type de projet :</strong> ${typeProjet}</p>
        <p><strong>Message :</strong><br/>${message || "(aucun message)"}</p>
      `
    });

    // Email automatique envoyé au client (lead)
    await transporter.sendMail({
      from: `"Top-Juridique" <${process.env.SENDER_EMAIL}>`,
      to: lead.email,
      replyTo: process.env.SENDER_EMAIL,
      subject: "Merci pour votre demande",
      html: `
        <p>Bonjour ${prenom},</p>
        <p>Merci pour votre message concernant votre projet <strong>${typeProjet}</strong>.</p>
        <p>Un conseiller vous contactera dans les plus brefs délais.</p>
        <p style="margin-top: 20px;">— L’équipe Top-Juridique</p>
      `
    });

    res.status(201).json({ success: true, message: "Lead enregistré et emails envoyés avec succès." });

  } catch (err) {
    console.error("Erreur réception lead :", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

// Contrôleur pour récupérer tous les leads
export const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: leads });
    } catch (error) {
        console.error("Erreur récupération leads:", error.message);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
};
