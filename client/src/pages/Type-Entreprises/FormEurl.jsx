import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Stepper from '../Stepper';

const FormEurl = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevStepRef = useRef(currentStep);

  const [formData, setFormData] = useState({
    eurlNom: '',
    activite: '',
    adresseSiege: '',
    capital: '',
    gerantNom: '',
    gerantEmail: '',
    regimeFiscal: '',
    duree: '',
    depotCapital: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const id = data?.userData?.id;
        setUserId(id);

        const res = await axios.get(`${backendUrl}/api/progress/${id}/EURL`);
        const progress = res.data;

        if (progress) {
          setCurrentStep(progress.currentStep || 0);
          setFormData(progress.formData || {
            eurlNom: '',
            activite: '',
            adresseSiege: '',
            capital: '',
            gerantNom: '',
            gerantEmail: '',
            regimeFiscal: '',
            duree: '',
            depotCapital: '',
          });
        }
      } catch (err) {
        console.log("Aucune progression trouvée ou erreur :", err.message);
      }
    };

    fetchProgress();
  }, []);

  const saveProgress = async () => {
    if (!userId) return;
    try {
      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'EURL',
        currentStep,
        formData,
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentStep, formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const steps = useMemo(() => [
    {
      title: "Nom de l'entreprise",
      description: "Quel nom souhaitez-vous donner à votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.eurlNom}
            onChange={(e) => handleInputChange('eurlNom', e.target.value)}
            placeholder="Ex: Mon Entreprise EURL"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Choisissez un nom simple et représentatif de votre activité
          </p>
        </div>
      ),
      validation: () => formData.eurlNom.trim() !== ''
    },
    {
      title: "Activité principale",
      description: "Quelle est l'activité principale de votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.activite}
            onChange={(e) => handleInputChange('activite', e.target.value)}
            placeholder="Ex: Conseil en informatique"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Décrivez brièvement votre activité principale
          </p>
        </div>
      ),
      validation: () => formData.activite.trim() !== ''
    },
    {
      title: "Adresse du siège social",
      description: "Où se situe le siège social de votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.adresseSiege}
            onChange={(e) => handleInputChange('adresseSiege', e.target.value)}
            placeholder="Adresse complète"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Cette adresse sera utilisée pour les formalités légales
          </p>
        </div>
      ),
      validation: () => formData.adresseSiege.trim() !== ''
    },
    {
      title: "Capital social",
      description: "Quel est le montant du capital social de votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="number"
            value={formData.capital}
            onChange={(e) => handleInputChange('capital', e.target.value)}
            placeholder="Montant en euros"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Le capital minimum pour une EURL est de 1€
          </p>
        </div>
      ),
      validation: () => formData.capital.trim() !== '' && !isNaN(formData.capital)
    },
    {
      title: "Nom du gérant",
      description: "Qui sera le gérant de l'EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.gerantNom}
            onChange={(e) => handleInputChange('gerantNom', e.target.value)}
            placeholder="Nom et prénom du gérant"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Le gérant peut être vous-même ou une autre personne
          </p>
        </div>
      ),
      validation: () => formData.gerantNom.trim() !== ''
    },
    {
      title: "Email du gérant",
      description: "Quelle est l'adresse email du gérant ?",
      content: (
        <div className="space-y-6">
          <input
            type="email"
            value={formData.gerantEmail}
            onChange={(e) => handleInputChange('gerantEmail', e.target.value)}
            placeholder="Email du gérant"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Cette adresse sera utilisée pour les communications officielles
          </p>
        </div>
      ),
      validation: () => /^\S+@\S+\.\S+$/.test(formData.gerantEmail)
    },
    {
      title: "Régime fiscal",
      description: "Quel régime fiscal choisissez-vous pour votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.regimeFiscal}
            onChange={(e) => handleInputChange('regimeFiscal', e.target.value)}
            placeholder="Ex: Impôt sur le revenu"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Consultez un expert pour choisir le régime le plus adapté
          </p>
        </div>
      ),
      validation: () => formData.regimeFiscal.trim() !== ''
    },
    {
      title: "Durée de la société",
      description: "Pour quelle durée créez-vous votre EURL ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.duree}
            onChange={(e) => handleInputChange('duree', e.target.value)}
            placeholder="Ex: 99 ans"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            La durée classique est de 99 ans
          </p>
        </div>
      ),
      validation: () => formData.duree.trim() !== ''
    },
    {
      title: "Dépôt du capital",
      description: "Avez-vous déjà déposé le capital social ?",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {['Oui', 'Non'].map((option) => (
            <button
              key={option}
              onClick={() => handleInputChange('depotCapital', option)}
              className={`p-4 text-center rounded-lg border transition-all ${
                formData.depotCapital === option
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10 font-medium'
                  : 'border-gray-200 hover:border-[#f4d47c]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ),
      validation: () => formData.depotCapital !== ''
    }
  ], [formData]);

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

  const handleSubmit = async () => {
    if (!steps[currentStep].validation()) return;

    setIsSubmitting(true);
    try {
      const dossierRes = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: "EURL"
      });

      const dossierId = dossierRes.data._id;

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${dossierId}`, {
        reponses: formData
      });

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: "EURL"
      });

      toast.success("Formulaire EURL soumis avec succès !");

      setFormData({
        eurlNom: '',
        activite: '',
        adresseSiege: '',
        capital: '',
        gerantNom: '',
        gerantEmail: '',
        regimeFiscal: '',
        duree: '',
        depotCapital: '',
      });
      setCurrentStep(0);

      setTimeout(() => {
        navigate(`/paiement?dossierId=${dossierId}`);
      }, 500);
    } catch (err) {
      console.error("Erreur finale :", err.message);
      toast.error("Erreur lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mt-15 mx-auto px-4 py-8">
        <Stepper/>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-600">Étape {currentStep + 1} sur {steps.length}</h2>
            <span className="text-sm font-medium text-[#f4d47c]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complet
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#f4d47c] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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
                    ? 'bg-[#f4d47c] text-white hover:bg-[#e6c76f]'
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
                {isSubmitting ? 'Enregistrement...' : 'Finaliser la création'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#f4d47c]/10 rounded-xl p-5 border border-[#f4d47c]/30">
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nous sommes là pour vous aider à chaque étape de la création de votre EURL.
          </p>
           <button
            onClick={() => navigate('/dashboard/centredaide')}
            className="text-sm text-[#317ac1] font-medium hover:underline"
            aria-label="Aller à la page Contactez notre support"
          >
            Contactez notre support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormEurl;