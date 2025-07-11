import React, { useContext, useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Stepper from '../Stepper';

const FormSasu = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    presidentName: '',
    capital: '',
    startDate: '',
    activity: '',
    domiciliation: '',
    salaryPresident: null
  });

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const steps = useMemo(() => [
    {
      title: "Nom de la SASU",
      description: "Quel nom souhaitez-vous donner à votre entreprise ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ex: Mon Entreprise SASU"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Choisissez un nom simple et représentatif de votre activité
          </p>
        </div>
      ),
      validation: () => formData.name.trim() !== ''
    },
    {
      title: "Président de la SASU",
      description: "Qui sera le président de votre société ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.presidentName}
            onChange={(e) => handleInputChange('presidentName', e.target.value)}
            placeholder="Nom et prénom du président"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            En SASU, le président est l'unique associé
          </p>
        </div>
      ),
      validation: () => formData.presidentName.trim() !== ''
    },
    {
      title: "Capital social",
      description: "Quel montant souhaitez-vous affecter au capital ?",
      content: (
        <div className="space-y-6">
          <input
            type="number"
            value={formData.capital}
            onChange={(e) => handleInputChange('capital', e.target.value)}
            placeholder="Montant en euros"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
            min="1"
          />
          <p className="text-sm text-gray-500">
            Le capital minimum est librement fixé par les statuts
          </p>
        </div>
      ),
      validation: () => formData.capital.trim() !== '' && !isNaN(formData.capital)
    },
    {
      title: "Date de création",
      description: "Quand souhaitez-vous créer votre SASU ?",
      content: (
        <div className="space-y-6">
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Cette date déterminera le début de votre exercice fiscal
          </p>
        </div>
      ),
      validation: () => formData.startDate.trim() !== ''
    },
    {
      title: "Activité principale",
      description: "Quelle est l'activité de votre entreprise ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.activity}
            onChange={(e) => handleInputChange('activity', e.target.value)}
            placeholder="Ex: Conseil en informatique"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Décrivez brièvement votre activité principale
          </p>
        </div>
      ),
      validation: () => formData.activity.trim() !== ''
    },
    {
      title: "Adresse de domiciliation",
      description: "Où sera situé le siège social de votre SASU ?",
      content: (
        <div className="space-y-6">
          <input
            type="text"
            value={formData.domiciliation}
            onChange={(e) => handleInputChange('domiciliation', e.target.value)}
            placeholder="Adresse complète"
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500">
            Cette adresse sera utilisée pour les formalités légales
          </p>
        </div>
      ),
      validation: () => formData.domiciliation.trim() !== ''
    },
    {
      title: "Rémunération du président",
      description: "Souhaitez-vous vous verser un salaire en tant que président ?",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {['Oui', 'Non'].map((label) => (
            <button
              key={label}
              onClick={() => handleInputChange('salaryPresident', label === 'Oui')}
              className={`p-4 text-center rounded-lg border transition-all ${
                formData.salaryPresident === (label === 'Oui')
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10 font-medium'
                  : 'border-gray-200 hover:border-[#f4d47c]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ),
      validation: () => formData.salaryPresident !== null
    }
  ], [formData]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const id = data?.userData?.id;
        setUserId(id);

        const res = await axios.get(`${backendUrl}/api/progress/${id}/SASU`);
        const progress = res.data;

        if (progress?.isCompleted) {
          await axios.post(`${backendUrl}/api/progress/reset`, {
            userId: id,
            typeDemarche: "SASU"
          });
          setCurrentStep(0);
        } else if (progress) {
          setCurrentStep(progress.currentStep || 0);
          setFormData(progress.formData || {
            name: '',
            presidentName: '',
            capital: '',
            startDate: '',
            activity: '',
            domiciliation: '',
            salaryPresident: null
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
        typeDemarche: 'SASU',
        currentStep,
        formData,
        isCompleted: false
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [formData, currentStep]);

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
      const { data: dossier } = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: "SASU"
      });

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${dossier._id}`, {
        reponses: formData
      });

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: "SASU"
      });

      toast.success("Formulaire SASU soumis avec succès !");

      setFormData({
        name: '',
        presidentName: '',
        capital: '',
        startDate: '',
        activity: '',
        domiciliation: '',
        salaryPresident: null
      });
      setCurrentStep(0);

      setTimeout(() => {
        navigate(`/paiement?dossierId=${dossier._id}`);
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
            Nous sommes là pour vous aider à chaque étape de la création de votre SASU.
          </p>
          <button className="text-sm text-[#f4d47c] font-medium hover:underline">
            Contactez notre support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSasu;