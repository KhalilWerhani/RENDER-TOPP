import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Stepper from '../Stepper';

const FormSas = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    startDate: '',
    domiciliation: ''
  });
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevStepRef = useRef(currentStep);

  const navigate = useNavigate();

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const userId = data?.userData?.id;
        setUserId(userId);
        if (!userId) return;

        const res = await axios.get(`${backendUrl}/api/progress/${userId}/SAS`);
        const progress = res.data;

        if (progress?.isCompleted) {
          await axios.post(`${backendUrl}/api/progress/reset`, {
            userId,
            typeDemarche: "SAS"
          });
          setCurrentStep(0);
        } else if (progress?.currentStep >= 0) {
          setCurrentStep(progress.currentStep);
          if (progress.formData) setFormData(progress.formData);
        }
      } catch (err) {
        console.error("Erreur récupération progrès :", err);
      }
    };

    checkProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      if (!userId) return;
      try {
        await axios.post(`${backendUrl}/api/progress/save`, {
          userId,
          typeDemarche: "SAS",
          currentStep,
          isCompleted: false,
          formData
        });
      } catch (err) {
        console.error("Erreur sauvegarde auto :", err);
      }
    };

    saveProgress();
  }, [currentStep, formData, userId]);

  const steps = useMemo(() => [
    {
      title: "Nom de la SAS",
      description: "Quel nom souhaitez-vous donner à votre société ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Ma Société SAS"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Choisissez un nom unique et représentatif de votre activité
          </p>
        </div>
      ),
      validation: () => formData.name.trim() !== ''
    },
    {
      title: "Activité principale",
      description: "Quelle est la profession principale de votre SAS ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            placeholder="Ex: Conseil en informatique"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Décrivez succinctement votre activité principale
          </p>
        </div>
      ),
      validation: () => formData.profession.trim() !== ''
    },
    {
      title: "Date de création",
      description: "Quand souhaitez-vous créer votre SAS ?",
      content: (
        <div className="space-y-2">
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
            required
          />
          <p className="text-sm text-gray-500">
            Sélectionnez la date prévue pour la création officielle
          </p>
        </div>
      ),
      validation: () => formData.startDate !== ''
    },
    {
      title: "Siège social",
      description: "Où sera situé le siège social de votre SAS ?",
      content: (
        <div className="space-y-2">
          <input
            type="text"
            value={formData.domiciliation}
            onChange={(e) => setFormData({ ...formData, domiciliation: e.target.value })}
            placeholder="Adresse complète (Ex: 12 rue des Entrepreneurs, 75001 Paris)"
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
            required
          />
          <p className="text-sm text-gray-500">
            Cette adresse sera utilisée pour les formalités légales
          </p>
        </div>
      ),
      validation: () => formData.domiciliation.trim() !== ''
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
      const { data: nouveauDossier } = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: "SAS"
      });

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${nouveauDossier._id}`, {
        reponses: {
          entrepriseType: "SAS",
          ...formData
        }
      });

      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: "SAS",
        currentStep,
        isCompleted: true
      });

      toast.success("Formulaire SAS complété avec succès !");

      setFormData({
        name: '',
        profession: '',
        startDate: '',
        domiciliation: ''
      });
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
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide pour votre SAS ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nos experts sont disponibles pour vous accompagner dans la création de votre Société par Actions Simplifiée.
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

export default FormSas;