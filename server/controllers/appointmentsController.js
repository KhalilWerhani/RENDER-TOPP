import Appointment from '../models/Appointment.js';
import Expert from '../models/Expert.js';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// Helper function to format dates in French
const formatFrenchDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

// Helper function to format time (ensure HH:MM format)
const formatTime = (time) => {
  if (time.includes(':')) return time;
  if (time.length === 3) return `${time.slice(0, 1)}:${time.slice(1)}`;
  return `${time.slice(0, 2)}:${time.slice(2)}`;
};

// Create new appointment
export  const createAppointment = async (req, res) => {
  try {
    const { date, time, expertId, userId, name, email, subject, notes } = req.body;

    // Validate required fields
    if (!date || !time || !expertId || !userId || !name || !email || !subject) {
      return res.status(400).json({ 
        success: false,
        message: 'Veuillez fournir tous les champs obligatoires' 
      });
    }

    // Check if expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collaborateur non trouvé' 
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      date,
      time,
      expertId,
      userId,
      name,
      email,
      subject,
      notes,
      status: 'pending'
    });

    await appointment.save();

    // Format date and time for display
    const formattedDate = formatFrenchDate(date);
    const formattedTime = formatTime(time);

    // Send email to expert
    const expertMailOptions = {
      from: process.env.SENDER_EMAIL,
      to: expert.email,
      subject: `[TOP-JURIDIQUE] Nouveau rendez-vous avec ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Nouveau rendez-vous programmé</h2>
          <p>Bonjour ${expert.name},</p>
          <p>Un nouveau rendez-vous a été réservé avec vous par ${name}.</p>
          
          <div style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Détails du rendez-vous</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Heure:</strong> ${formattedTime}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p><strong>Client:</strong> ${name} (${email})</p>
          </div>

          <p>Vous pouvez contacter le client directement par email ou via votre espace d'administration.</p>
          
          <p style="margin-top: 24px;">Cordialement,</p>
          <p>L'équipe TOP-JURIDIQUE</p>
        </div>
      `
    };

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `[TOP-JURIDIQUE] Confirmation de votre rendez-vous`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Rendez-vous confirmé</h2>
          <p>Bonjour ${name},</p>
          <p>Votre rendez-vous avec ${expert.name} a été confirmé avec succès.</p>
          
          <div style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Détails du rendez-vous</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Heure:</strong> ${formattedTime}</p>
            <p><strong>Avec:</strong> ${expert.name} (${expert.role})</p>
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>

          <p>Vous recevrez un rappel 24 heures avant votre rendez-vous.</p>
          
          <p style="margin-top: 24px;">Cordialement,</p>
          <p>L'équipe TOP-JURIDIQUE</p>
        </div>
      `
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(expertMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Rendez-vous créé avec succès',
      appointment 
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du rendez-vous',
      error: error.message 
    });
  }
};

// Get all appointments for a user
export  const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({ userId })
      .populate('expertId', 'name role')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des rendez-vous',
      error: error.message 
    });
  }
};

// Get all appointments for an expert
export const getExpertAppointments = async (req, res) => {
  try {
    const { expertId } = req.params;

    const appointments = await Appointment.find({ expertId })
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching expert appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des rendez-vous',
      error: error.message 
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Statut invalide' 
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('expertId', 'name email');

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Rendez-vous non trouvé' 
      });
    }

    // Format date for display
    const formattedDate = formatFrenchDate(appointment.date);
    const formattedTime = formatTime(appointment.time);

    // Send notification email based on status
    let emailSubject = '';
    let emailBody = '';

    if (status === 'confirmed') {
      emailSubject = `[TOP-JURIDIQUE] Rendez-vous confirmé`;
      emailBody = `
        <p>Bonjour ${appointment.userId.name},</p>
        <p>Votre rendez-vous du ${formattedDate} à ${formattedTime} 
        avec ${appointment.expertId.name} a été confirmé.</p>
      `;
    } else if (status === 'cancelled') {
      emailSubject = `[TOP-JURIDIQUE] Rendez-vous annulé`;
      emailBody = `
        <p>Bonjour ${appointment.userId.name},</p>
        <p>Votre rendez-vous du ${formattedDate} à ${formattedTime} 
        avec ${appointment.expertId.name} a été annulé.</p>
        <p>Veuillez prendre un nouveau rendez-vous si nécessaire.</p>
      `;
    }

    if (emailSubject && emailBody) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: appointment.userId.email,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">${emailSubject.replace('[TOP-JURIDIQUE] ', '')}</h2>
            ${emailBody}
            <p style="margin-top: 24px;">Cordialement,</p>
            <p>L'équipe TOP-JURIDIQUE</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ 
      success: true, 
      message: 'Statut du rendez-vous mis à jour',
      appointment 
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du rendez-vous',
      error: error.message 
    });
  }
};

// Delete appointment
export  const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id)
      .populate('userId', 'name email')
      .populate('expertId', 'name email');

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Rendez-vous non trouvé' 
      });
    }

    // Format date for display
    const formattedDate = formatFrenchDate(appointment.date);
    const formattedTime = formatTime(appointment.time);

    // Send cancellation email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: appointment.userId.email,
      subject: `[TOP-JURIDIQUE] Rendez-vous annulé`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Rendez-vous annulé</h2>
          <p>Bonjour ${appointment.userId.name},</p>
          <p>Votre rendez-vous du ${formattedDate} à ${formattedTime} 
          avec ${appointment.expertId.name} a été annulé.</p>
          <p>Veuillez prendre un nouveau rendez-vous si nécessaire.</p>
          <p style="margin-top: 24px;">Cordialement,</p>
          <p>L'équipe TOP-JURIDIQUE</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Rendez-vous supprimé avec succès' 
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression du rendez-vous',
      error: error.message 
    });
  }
};

