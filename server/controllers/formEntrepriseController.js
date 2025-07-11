import Notification from '../models/notificationModel.js';
import { io } from '../server.js'; // Socket.io instance

// Appel après création du dossier entreprise
await Notification.create({
  title: 'Nouvelle création d’entreprise',
  message: `Un nouveau formulaire a été soumis par ${user.prenom}`,
  link: `/admin/dossiers/${newDossier._id}`,
  recipientRole: 'admin',
});

// Émettre via socket
io.emit('newNotification', {
  role: 'admin',
  title: 'Nouvelle création d’entreprise',
  message: `Un nouveau formulaire a été soumis`,
});
