import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Stepper from '../Stepper';
import SearchEntreprise from '../../components/SearchEntreprise';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChangementActivite = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [formeSociale, setFormeSociale] = useState('');
  const [modificationDate, setModificationDate] = useState('');
  const [typeChangement, setTypeChangement] = useState('');
  const [nouvelleActivite, setNouvelleActivite] = useState('');
  const [beneficiaireEffectif, setBeneficiaireEffectif] = useState(null);
  const [createdWithTop, setCreatedWithTop] = useState(null);
  const [modifiedStatuts, setModifiedStatuts] = useState(null);
  const [isArtisanale, setIsArtisanale] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const initProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, {
          withCredentials: true
        });
        const userId = data?.userData?.id;
        if (!userId) return;

        const res = await axios.get(`${backendUrl}/api/progress/user/${userId}`);
        const existing = res.data.find(p => p.typeDemarche === 'changement-activite' && !p.isCompleted);

        if (existing) {
          setCurrentStep(existing.currentStep);
          if (existing.formData) {
            setSelectedEntreprise(existing.formData.entreprise);
            setFormeSociale(existing.formData.formeSociale);
            setModificationDate(existing.formData.modificationDate);
            setTypeChangement(existing.formData.typeChangement);
            setNouvelleActivite(existing.formData.nouvelleActivite);
            setBeneficiaireEffectif(existing.formData.beneficiaireEffectif);
            setCreatedWithTop(existing.formData.createdWithTop);
            setModifiedStatuts(existing.formData.modifiedStatuts);
            setIsArtisanale(existing.formData.artisanale);
          }
        } else {
          await axios.post(`${backendUrl}/api/progress/save`, {
            userId,
            typeDemarche: 'changement-activite',
            currentStep,
            formData: {
              entreprise: selectedEntreprise,
              formeSociale,
              modificationDate,
              typeChangement,
              nouvelleActivite,
              beneficiaireEffectif,
              createdWithTop,
              modifiedStatuts,
              artisanale: isArtisanale
            }
          });
        }
      } catch (err) {
        console.error("Erreur init progression :", err.message);
      }
    };

    initProgress();
  }, [backendUrl]);

  const updateProgress = async (newStep) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      const userId = data?.userData?.id;

      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'changement-activite',
        currentStep: newStep,
        formData: {
          entreprise: selectedEntreprise,
          formeSociale,
          modificationDate,
          typeChangement,
          nouvelleActivite,
          beneficiaireEffectif,
          createdWithTop,
          modifiedStatuts,
          artisanale: isArtisanale
        }
      });
    } catch (err) {
      console.error("Erreur update progression :", err.message);
    }
  };

  const steps = useMemo(() => [
    {
      title: "Sélectionnez la société à modifier",
      description: "Recherchez et sélectionnez votre entreprise dans notre base de données",
      content: <SearchEntreprise onSelect={setSelectedEntreprise} />,
      validation: () => selectedEntreprise !== null
    },
    {
      title: "Forme sociale de votre société",
      description: "Quelle est la forme sociale de votre société ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {['SAS', 'SASU', 'SARL', 'EURL', 'SCI', 'AE'].map((type) => (
            <button
              key={type}
              onClick={() => setFormeSociale(type)}
              className={`p-4 text-left rounded-lg border transition-all ${
                formeSociale === type
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => formeSociale !== ''
    },
    {
      title: "Date de modification",
      description: "Quand souhaitez-vous modifier votre entreprise ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {['Dans la semaine', 'Dans les prochaines semaines', 'Dans les prochains mois'].map((option) => (
            <button
              key={option}
              onClick={() => setModificationDate(option)}
              className={`p-4 text-left rounded-lg border transition-all ${
                modificationDate === option
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => modificationDate !== ''
    },
    {
      title: "Type de modification",
      description: "Comment modifiez-vous l'activité de la société ?",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {["Ajout d'une activité", "Changement complet"].map((option) => (
            <button
              key={option}
              onClick={() => setTypeChangement(option)}
              className={`p-4 text-left rounded-lg border transition-all ${
                typeChangement === option
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => typeChangement !== ''
    },
    {
      title: "Nouvelle activité",
      description: "Décrivez la nouvelle activité de votre société",
      content: (
        <div className="space-y-6">
          <textarea
            value={nouvelleActivite} 
            onChange={e => setNouvelleActivite(e.target.value)} 
            placeholder="Ex: Création de sites web..." 
            className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            rows={4}
          />
          <p className="text-sm text-gray-500">
            Décrivez de manière précise l'activité que vous souhaitez ajouter ou modifier
          </p>
        </div>
      ),
      validation: () => nouvelleActivite.trim() !== ''
    },
    {
      title: "Bénéficiaires effectifs",
      description: "Avez-vous déjà déposé votre liste des bénéficiaires effectifs ?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {['Oui', 'Non'].map((option) => (
            <button
              key={option}
              onClick={() => setBeneficiaireEffectif(option === 'Oui')}
              className={`p-4 text-center rounded-lg border transition-all ${
                beneficiaireEffectif === (option === 'Oui')
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => beneficiaireEffectif !== null
    },
    {
      title: "Création avec TOP-JURIDIQUE",
      description: "Avez-vous créé votre société avec TOP-JURIDIQUE ?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {['Oui', 'Non'].map((option) => (
            <button
              key={option}
              onClick={() => setCreatedWithTop(option === 'Oui')}
              className={`p-4 text-center rounded-lg border transition-all ${
                createdWithTop === (option === 'Oui')
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => createdWithTop !== null
    },
    {
      title: "Modification des statuts",
      description: "Avez-vous modifié vos statuts depuis la création ?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {['Oui', 'Non'].map((option) => (
            <button
              key={option}
              onClick={() => setModifiedStatuts(option === 'Oui')}
              className={`p-4 text-center rounded-lg border transition-all ${
                modifiedStatuts === (option === 'Oui')
                  ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                  : 'border-gray-200 hover:border-[#f4d47c]'}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      ),
      validation: () => modifiedStatuts !== null
    },
    {
      title: "Activité artisanale",
      description: "Votre activité est-elle artisanale ?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['Oui', 'Non'].map((option) => (
              <button
                key={option}
                onClick={() => setIsArtisanale(option === 'Oui')}
                className={`p-4 text-center rounded-lg border transition-all ${
                  isArtisanale === (option === 'Oui')
                    ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                    : 'border-gray-200 hover:border-[#f4d47c]'}`}
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Pour les activités artisanales, l'enregistrement auprès de la chambre des métiers et de l'artisanat est obligatoire. 
            Ce service est proposé par TOP-JURIDIQUE (79€ HT).
          </p>
        </div>
      ),
      validation: () => isArtisanale !== null
    }
  ], [
    selectedEntreprise, 
    formeSociale, 
    modificationDate, 
    typeChangement, 
    nouvelleActivite, 
    beneficiaireEffectif, 
    createdWithTop, 
    modifiedStatuts, 
    isArtisanale
  ]);

  const handleNextStep = () => {
    if (steps[currentStep].validation()) {
      setCurrentStep((prev) => prev + 1);
      updateProgress(currentStep + 1);
    } else {
      toast.warning("Veuillez compléter cette étape avant de continuer.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    updateProgress(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!steps[currentStep].validation()) return;

    setIsSubmitting(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });
      const userId = data?.userData?.id;
      if (!userId) throw new Error("Utilisateur non trouvé");

      const payload = {
        user: userId,
        entreprise: selectedEntreprise,
        formeSociale,
        modificationDate,
        typeChangement,
        nouvelleActivite,
        beneficiaireEffectif,
        createdWithTop,
        modifiedStatuts,
        artisanale: isArtisanale
      };

      const { data: nouveauDossier } = await axios.post(
        `${backendUrl}/api/modification/activite/submit`,
        payload
      );

      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'changement-activite',
        currentStep: steps.length - 1,
        isCompleted: true,
        formData: payload
      });

      await axios.post(`${backendUrl}/api/progress/reset`, {
        userId,
        typeDemarche: 'changement-activite'
      });

      toast.success("Formulaire soumis avec succès !");
      navigate(`/paiement-modification?dossierId=${nouveauDossier._id}`, {
        state: {
          ...nouveauDossier,
          type: "CHANGEMENT_ACTIVITE"
        }
      });

    } catch (error) {
      console.error("❌ Erreur :", error.response?.data || error.message);
      toast.error("Erreur lors de la soumission du formulaire.");
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
                {isSubmitting ? 'Enregistrement...' : 'Soumettre la demande'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#f4d47c]/10 rounded-xl p-5 border border-[#f4d47c]/30">
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nous sommes là pour vous aider à chaque étape de la modification de votre activité.
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

export default ChangementActivite;