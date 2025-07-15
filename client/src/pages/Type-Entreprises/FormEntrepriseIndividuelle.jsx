import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Stepper from '../Stepper';

const FormEntrepriseIndividuelle = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [artisanale, setArtisanale] = useState(null);
  const [adresse, setAdresse] = useState('');
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevStepRef = useRef(currentStep);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const id = data?.userData?.id;
        setUserId(id);

        const res = await axios.get(`${backendUrl}/api/progress/${id}/entreprise-individuelle`);
        const progress = res.data;

        if (progress) {
          const savedData = progress.formData;
          setStartDate(savedData.startDate || '');
          setArtisanale(savedData.artisanale ?? null);
          setAdresse(savedData.adresse || '');
          setCurrentStep(progress.currentStep || 0);
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
        typeDemarche: 'entreprise-individuelle',
        currentStep,
        formData: {
          startDate,
          artisanale,
          adresse,
        },
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentStep, startDate, artisanale, adresse]);

  const steps = useMemo(() => [
    {
      title: "Date de création",
      description: "Quand souhaitez-vous créer votre entreprise ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {["Dans la semaine", "Dans les prochaines semaines", "Dans les prochains mois"].map((option) => (
            <button
              key={option}
              onClick={() => setStartDate(option)}
              className={`p-4 text-left rounded-lg border transition-all ${
                startDate === option
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => startDate !== ''
    },
    {
      title: "Activité artisanale",
      description: "Votre activité sera-t-elle artisanale ?",
      content: (
        <div className="space-y-3">
          {[{ label: "Oui", value: true }, { label: "Non", value: false }].map(option => (
            <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={artisanale === option.value}
                onChange={() => setArtisanale(option.value)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option.label}</span>
            </label>
          ))}
          <p className="text-sm text-gray-500 mt-2">
            Pour les activités artisanales, l'enregistrement auprès de la Chambre des Métiers et de l'Artisanat est obligatoire.
          </p>
        </div>
      ),
      validation: () => artisanale !== null
    },
    {
      title: "Adresse de l'entreprise",
      description: "Où sera situé le siège de votre entreprise ?",
      content: (
        <div className="space-y-2">
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Ex : 12 rue des Entrepreneurs, 75001 Paris"
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
            required
          />
        </div>
      ),
      validation: () => adresse.trim() !== ''
    }
  ], [startDate, artisanale, adresse]);

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
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      const userId = data?.userData?.id;
      if (!userId) throw new Error("Utilisateur introuvable.");

      const { data: nouveauDossier } = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: "Entreprise individuelle",
      });

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${nouveauDossier._id}`, {
        reponses: {
          entrepriseType: "Entreprise individuelle",
          startDate,
          artisanale,
          adresse,
        },
      });

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: "entreprise-individuelle",
      });

      toast.success("Formulaire soumis avec succès !");

      setStartDate('');
      setArtisanale(null);
      setAdresse('');
      setCurrentStep(0);

      setTimeout(() => {
        navigate(`/paiement?dossierId=${nouveauDossier._id}`);
      }, 500);

    } catch (error) {
      console.error("❌ Erreur :", error.response?.data || error.message);
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
            Nous sommes là pour vous aider à chaque étape de la création de votre entreprise individuelle.
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

export default FormEntrepriseIndividuelle;