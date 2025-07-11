import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Briefcase, Building2, Phone, MessageCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Stepper from './Stepper';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bilan = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
    souhait: '',
    situation: '',
    societe: '',
    telephone: '',
    precisions: ''
  });

  const steps = [
    {
      title: "Informations personnelles",
      description: "Renseignez vos coordonnées pour que nous puissions vous contacter",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInput icon={<User />} name="nom" label="Nom" value={formData.nom} onChange={handleChange} />
          <LabelInput icon={<User />} name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} />
          <LabelInput icon={<Mail />} name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
          <LabelInput icon={<Phone />} name="telephone" label="Numéro de téléphone" value={formData.telephone} onChange={handleChange} />
        </div>
      ),
      validation: () => formData.nom && formData.prenom && formData.email && formData.telephone
    },
    {
      title: "Informations professionnelles",
      description: "Décrivez votre situation actuelle",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInput icon={<Briefcase />} name="role" label="Vous êtes :" type="select" options={["Dirigeant", "Salarié"]} value={formData.role} onChange={handleChange} />
          <LabelInput icon={<Building2 />} name="souhait" label="Vous souhaitez :" type="select" options={["Obtenir des renseignements", "Être accompagné dans une procédure de dépôt du bilan"]} value={formData.souhait} onChange={handleChange} />
          <LabelInput icon={<Briefcase />} name="situation" label="Situation actuelle" value={formData.situation} onChange={handleChange} />
          <LabelInput icon={<Building2 />} name="societe" label="Nom de votre société" value={formData.societe} onChange={handleChange} />
        </div>
      ),
      validation: () => formData.role && formData.souhait && formData.situation && formData.societe
    },
    {
      title: "Détails de votre situation",
      description: "Donnez-nous plus de détails sur votre situation",
      content: (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Quelques précisions sur votre situation*
          </label>
          <textarea
            name="precisions"
            rows={4}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#317ac1]"
            value={formData.precisions}
            onChange={handleChange}
            required
          />
        </div>
      ),
      validation: () => formData.precisions
    }
  ];

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleNextStep = () => {
    if (steps[currentStep].validation()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.warning("Veuillez compléter cette étape avant de continuer.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!steps[currentStep].validation()) return;

  setIsSubmitting(true);
  try {
    // Get user ID from context or auth
    const { data: userData } = await axios.get(`${backendUrl}/api/user/data`, {
      withCredentials: true
    });
    const userId = userData?.userData?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const payload = {
      user: userId,
      typeFermeture: "DEPOT_DE_BILAN", // Use the French version that matches your enum
      depotBilan: formData,
      statut: "en attente",
      etatAvancement: "formulaire",
      // For DEPOT_DE_BILAN, entreprise is optional but you can include societe from form
      entreprise: formData.societe ? { 
        nom: formData.societe,
        // Add other minimal company info if available
      } : null
    };

    const { data: nouveauDossier } = await axios.post(
      `${backendUrl}/api/fermeture/submit`,
      payload,
      { withCredentials: true }
    );

    navigate(`/paiement-fermeture/${nouveauDossier._id}`, {
      state: {
        dossier: nouveauDossier,
        type: 'Dépôt de bilan'
      }
    });

  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    toast.error(error.response?.data?.message || "Erreur lors de la soumission du formulaire.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mt-15 mx-auto px-4 py-8">
        <Stepper />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-600">Étape {currentStep + 1} sur {steps.length}</h2>
            <span className="text-sm font-medium text-[#317ac1]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complet
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#317ac1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{steps[currentStep].title}</h1>
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            {currentStep > 0 && (
              <button
                onClick={handlePrevStep}
                className="px-6 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Retour
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNextStep}
                disabled={!steps[currentStep].validation()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  steps[currentStep].validation()
                    ? 'bg-[#317ac1] text-white hover:bg-[#2a6cb3]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuer
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !steps[currentStep].validation()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  !isSubmitting && steps[currentStep].validation()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </button>
            )}
          </div>
        </motion.div>

        <div className="bg-[#317ac1]/10 rounded-xl p-5 border border-[#317ac1]/30">
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Notre équipe est disponible pour vous accompagner dans votre démarche de dépôt de bilan.
          </p>
          <button className="text-sm text-[#317ac1] font-medium hover:underline">
            Contactez notre support
          </button>
        </div>
      </div>
    </div>
  );
};

const LabelInput = ({ icon, name, label, value, onChange, type = "text", options = [] }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#317ac1]"
      >
        <option value="">-- Sélectionner --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#317ac1]"
      />
    )}
  </div>
);

export default Bilan;