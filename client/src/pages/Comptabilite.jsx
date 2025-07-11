import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';

const Comptabilite = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    message: '',
    typeProjet: 'comptabilité',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leads', formData);
      toast.success('Merci, nous vous contactons très vite !');
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        message: '',
        typeProjet: 'comptabilité',
      });
    } catch (error) {
      toast.error('Erreur, veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-grow container mx-auto mt-20 px-4 py-12 max-w-6xl flex flex-col md:flex-row items-center justify-between">
        {/* Formulaire */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h1 className="text-3xl text-center md:text-4xl font-bold leading-tight text-black">
            Libérez votre business. <br /> La compta suit en ligne, sans <span className="text-blue-600">engagement</span>
          </h1>
          <p className="text-gray-900">
            Un accompagnement sur mesure pour gérer votre comptabilité avec fluidité et réactivité.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="telephone"
              placeholder="Numéro de téléphone"
              value={formData.telephone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              placeholder="Parlez-nous de votre projet"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              CONTACTEZ-MOI
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-2">Nos conseillers vous répondent en moyenne en moins de 5 minutes.</p>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center"
        >
          <img
            src={assets.bwoman_img}
            alt="Comptable au téléphone"
            className="rounded-lg shadow-lg max-w-md"
          />
        </motion.div>
      </main>

      {/* Témoignages et offre */}
      <section className="bg-white py-16 px-4 md:px-10 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl text-center max-w-[342px] mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Une offre complète et sans engagement</h3>
            <p className="text-4xl font-extrabold text-black mb-2">99€ <span className="text-sm font-medium text-gray-600">HT/mois*</span></p>
            <p className="text-sm text-gray-500 mb-6">Sans frais cachés. Sans surprise.</p>
            <ul className="text-left text-sm text-gray-800 space-y-2 mb-6">
              <li>✔️ Un accompagnement personnalisé</li>
              <li>✔️ Tenue comptable quotidienne</li>
              <li>✔️ Déclarations fiscales (TVA, IS, CFE…)</li>
              <li>✔️ Liasse fiscale & bilan</li>
              <li>✔️ Outils web et mobile inclus</li>
              <li>✔️ PV d'AGO ou AGM pour le greffe du TIC</li>
            </ul>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              Prendre rendez-vous
            </button>
          </div>

          <h2 className="text-3xl font-bold text-center mt-20 mb-12">Ils nous font confiance</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/default-avatar.jpg" alt="client" className="w-12 h-12 rounded-full bg-gray-300" />
                  <div>
                    <p className="font-semibold">{["Nadia B.", "Sofiane T.", "Julie R."][i]}</p>
                    <p className="text-sm text-blue-600">{["Créatrice SASU", "Auto-entrepreneur", "Gérante SARL"][i]}</p>
                  </div>
                </div>
                <p className="text-sm">
                  {[
                    "Service rapide, sans paperasse, j’ai obtenu mes documents comptables en quelques clics ! Je recommande à 100%.",
                    "Un vrai gain de temps, je gère ma comptabilité sans stress depuis l'application. Merci Top-Juridique !",
                    "Une équipe réactive, un outil simple, et surtout pas d'engagement. J’ai enfin trouvé la solution idéale !"
                  ][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Comptabilite;
