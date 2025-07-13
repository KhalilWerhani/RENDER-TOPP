import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Stepper from '../Stepper';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';

const FormSci = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [acquisitionStatut, setAcquisitionStatut] = useState('');
  const [typeBien, setTypeBien] = useState('');
  const [nbAssocies, setNbAssocies] = useState('');
  const [adresseCourrier, setAdresseCourrier] = useState('');
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  // Load progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const id = data?.userData?.id;
        setUserId(id);

        const res = await axios.get(`${backendUrl}/api/progress/${id}/sci`);
        const progress = res.data;

        if (progress) {
          const savedData = progress.formData;
          setAcquisitionStatut(savedData.acquisitionStatut || '');
          setTypeBien(savedData.typeBien || '');
          setNbAssocies(savedData.nbAssocies || '');
          setAdresseCourrier(savedData.adresseCourrier || '');
          setCurrentStep(progress.currentStep || 0);
        }
      } catch (err) {
        console.log("Aucune progression trouvée ou erreur :", err.message);
      }
    };

    fetchProgress();
  }, []);

  // Auto-save
  const saveProgress = async () => {
    if (!userId) return;
    try {
      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'sci',
        currentStep,
        formData: {
          acquisitionStatut,
          typeBien,
          nbAssocies,
          adresseCourrier
        },
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentStep, acquisitionStatut, typeBien, nbAssocies, adresseCourrier]);

  const steps = useMemo(() => [
    {
      title: "Acquisition immobilière",
      description: "Êtes-vous en train d'acquérir un bien immobilier ?",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <strong>Pourquoi créer une SCI ?</strong> Elle permet de gérer plus facilement un bien immobilier à plusieurs.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {["Je suis en cours d'acquisition", "Je suis déjà propriétaire", "Je cherche encore"].map((opt) => (
              <button
                key={opt}
                onClick={() => setAcquisitionStatut(opt)}
                className={`p-4 text-left rounded-lg border transition-all ${
                  acquisitionStatut === opt
                    ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                    : 'border-gray-200 hover:border-[#f4d47c]'}`}
              >
                <span className="font-medium">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ),
      validation: () => acquisitionStatut !== ''
    },
    {
      title: "Type de bien",
      description: "De quel bien s'agit-il ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {["Un investissement locatif", "Votre résidence principale", "Une résidence secondaire"].map((opt) => (
            <button
              key={opt}
              onClick={() => setTypeBien(opt)}
              className={`p-4 text-left rounded-lg border transition-all ${
                typeBien === opt
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
              >
              <span className="font-medium">{opt}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => typeBien !== ''
    },
    {
      title: "Nombre d'associés",
      description: "Combien serez-vous d'associés-créateurs ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {["2 associés", "3 associés", "4 associés ou plus", "Je suis le seul associé pour le moment"].map((opt) => (
            <button
              key={opt}
              onClick={() => setNbAssocies(opt)}
              className={`p-4 text-left rounded-lg border transition-all ${
                nbAssocies === opt
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
              >
              <span className="font-medium">{opt}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => nbAssocies !== ''
    },
    {
      title: "Adresse administrative",
      description: "Où voulez-vous recevoir vos courriers administratifs ?",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Le siège social correspond à l'adresse administrative de votre SCI.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {["Chez un Gérant", "Domiciliation via un partenaire", "Une autre adresse", "Je ne sais pas encore"].map((opt) => (
              <button
                key={opt}
                onClick={() => setAdresseCourrier(opt)}
                className={`p-4 text-left rounded-lg border transition-all ${
                  adresseCourrier === opt
                    ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                    : 'border-gray-200 hover:border-[#f4d47c]'}`}
                >
                <span className="font-medium">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ),
      validation: () => adresseCourrier !== ''
    }
  ], [acquisitionStatut, typeBien, nbAssocies, adresseCourrier]);

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
      const formData = {
        entrepriseType: "SCI",
        acquisitionStatut,
        typeBien,
        nbAssocies,
        adresseCourrier
      };

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });

      const userId = data?.userData?.id;
      if (!userId) throw new Error("Utilisateur introuvable");

      const { data: dossier } = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: "SCI"
      });

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${dossier._id}`, {
        reponses: formData
      });

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: "sci",
      });

      // Reset form
      setAcquisitionStatut('');
      setTypeBien('');
      setNbAssocies('');
      setAdresseCourrier('');
      setCurrentStep(0);

      toast.success("Formulaire SCI soumis avec succès !");
      navigate(`/paiement?dossierId=${dossier._id}`);
    } catch (err) {
      console.error("Erreur soumission :", err.message);
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
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide pour votre SCI ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nos experts en création de SCI sont disponibles pour répondre à toutes vos questions.
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

export default FormSci;