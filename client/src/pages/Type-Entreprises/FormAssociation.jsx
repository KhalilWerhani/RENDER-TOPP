import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Stepper from '../Stepper';

const FormAssociation = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [entrepriseName, setEntrepriseName] = useState('');
  const [associationActivityType, setAssociationActivityType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [associationPresidentAlso, setAssociationPresidentAlso] = useState(null);
  const [domiciliation, setDomiciliation] = useState('');
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

        const res = await axios.get(`${backendUrl}/api/progress/${id}/association`);
        const progress = res.data;

        if (progress) {
          const savedData = progress.formData;
          setEntrepriseName(savedData.entrepriseName || '');
          setAssociationActivityType(savedData.associationActivityType || '');
          setStartDate(savedData.startDate || '');
          setAssociationPresidentAlso(savedData.associationPresidentAlso ?? null);
          setDomiciliation(savedData.domiciliation || '');
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
        typeDemarche: 'association',
        currentStep,
        formData: {
          entrepriseName,
          associationActivityType,
          startDate,
          associationPresidentAlso,
          domiciliation,
        },
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentStep, entrepriseName, associationActivityType, startDate, associationPresidentAlso, domiciliation]);

  const steps = useMemo(() => [
    {
      title: "Nom de votre association",
      description: "Comment souhaitez-vous nommer votre association ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={entrepriseName}
            onChange={(e) => setEntrepriseName(e.target.value)}
            placeholder="Ex: Les Amis de la Nature"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Choisissez un nom simple et représentatif de votre mission
          </p>
        </div>
      ),
      validation: () => entrepriseName.trim() !== ''
    },
    {
      title: "Activité principale",
      description: "Quel est le domaine d'activité de votre association ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {["Sport", "Loisirs", "Éducation", "Santé", "Culture", "Arts", "Autres"].map((type) => (
            <button
              key={type}
              onClick={() => setAssociationActivityType(type)}
              className={`p-4 text-left rounded-lg border transition-all ${
                associationActivityType === type
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => associationActivityType !== ''
    },
    {
      title: "Date de création",
      description: "Quand souhaitez-vous officialiser votre association ?",
      content: (
        <div className="space-y-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
            required
          />
        </div>
      ),
      validation: () => startDate !== ''
    },
    {
      title: "Présidence",
      description: "Qui sera le président de l'association ?",
      content: (
        <div className="space-y-3">
          {[{ label: "Je serai le président", value: true }, { label: "Une autre personne", value: false }].map(option => (
            <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={associationPresidentAlso === option.value}
                onChange={() => setAssociationPresidentAlso(option.value)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ),
      validation: () => associationPresidentAlso !== null
    },
    {
      title: "Adresse du siège",
      description: "Où sera situé le siège social de votre association ?",
      content: (
        <div className="space-y-2">
          <input
            type="text"
            value={domiciliation}
            onChange={(e) => setDomiciliation(e.target.value)}
            placeholder="Adresse complète"
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
            required
          />
        </div>
      ),
      validation: () => domiciliation.trim() !== ''
    }
  ], [entrepriseName, associationActivityType, startDate, associationPresidentAlso, domiciliation]);

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
        typeDossier: "Association",
      });

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${nouveauDossier._id}`, {
        reponses: {
          entrepriseType: "Association",
          entrepriseName,
          associationActivityType,
          startDate,
          associationPresidentAlso,
          domiciliation,
        },
      });

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: "association",
      });

      toast.success("Formulaire soumis avec succès !");

      setEntrepriseName('');
      setAssociationActivityType('');
      setStartDate('');
      setAssociationPresidentAlso(null);
      setDomiciliation('');
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
            Nous sommes là pour vous aider à chaque étape de la création de votre association.
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

export default FormAssociation;