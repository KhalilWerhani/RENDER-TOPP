import transporter from '../config/nodemailer.js'; // Ton transporter Brevo

export const envoyerMessageContact = async (req, res) => {
  try {
    const { nom, email, telephone, message } = req.body;

    await transporter.sendMail({
      from: `"Formulaire contact" <${process.env.SENDER_EMAIL}>`,
      to: 'hadjhamoudasalim@gmail.com',
      subject: '📩 Nouveau message depuis le site TOP-JURIDIQUE',
      html: `
        <h3>Message reçu via le site</h3>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Message :</strong><br/>${message}</p>
      `
    });

    res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur envoi mail contact :', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
