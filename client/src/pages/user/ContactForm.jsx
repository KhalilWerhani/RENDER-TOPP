import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
   const { backendUrl } = useContext(AppContent);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent) {
      toast.error("Veuillez accepter d'être contacté.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/contact/send`, {
        nom, email, telephone, message
      });

      if (res.data.success) {
        toast.success('Message envoyé avec succès.');
        setNom('');
        setEmail('');
        setTelephone('');
        setMessage('');
        setConsent(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <input
          type="text"
          id="name"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Votre nom"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="votre@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input
          type="tel"
          id="phone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="07 00 00 00 00"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Votre message..."
          required
        ></textarea>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
          J'accepte d'être contacté par <span className="font-semibold text-gray-800">TOP-JURIDIQUE</span> à propos de mes démarches.
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
      >
        Envoyer le message
      </button>
    </form>
  );
};

export default ContactForm;
