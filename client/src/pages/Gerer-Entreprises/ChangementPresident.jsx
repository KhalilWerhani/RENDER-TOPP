import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Stepper from '../Stepper';
import SearchEntreprise from '../../components/SearchEntreprise';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChangementPresident = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [formeSociale, setFormeSociale] = useState('');
  const [modificationDate, setModificationDate] = useState('');
  const [nouveauPresident, setNouveauPresident] = useState({ prenom: '', nom: '' });
  const [beneficiaireEffectif, setBeneficiaireEffectif] = useState(null);
  const [createdWithTop, setCreatedWithTop] = useState(null);
  const [modifiedStatuts, setModifiedStatuts] = useState(null);
  const [isArtisanale, setIsArtisanale] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initProgress = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, {
          withCredentials: true
        });
        const id = data?.userData?.id;
        setUserId(id);
        if (!id) return;

        const res = await axios.get(`${backendUrl}/api/progress/user/${id}`);
        const existing = res.data.find(p => p.typeDemarche === 'changement-president' && !p.isCompleted);

        if (existing) {
          setCurrentStep(existing.currentStep);
          if (existing.formData) {
            setSelectedEntreprise(existing.formData.entreprise);
            setFormeSociale(existing.formData.formeSociale);
            setModificationDate(existing.formData.modificationDate);
            setNouveauPresident(existing.formData.nouveauPresident || { prenom: '', nom: '' });
            setBeneficiaireEffectif(existing.formData.beneficiaireEffectif);
            setCreatedWithTop(existing.formData.createdWithTop);
            setModifiedStatuts(existing.formData.modifiedStatuts);
            setIsArtisanale(existing.formData.artisanale);
          }
        }
      } catch (err) {
        console.error("Erreur init progression :", err.message);
      }
    };

    initProgress();
  }, [backendUrl]);

  const saveProgress = async () => {
    if (!userId) return;
    try {
      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'changement-president',
        currentStep,
        formData: {
          entreprise: selectedEntreprise,
          formeSociale,
          modificationDate,
          nouveauPresident,
          beneficiaireEffectif,
          createdWithTop,
          modifiedStatuts,
          artisanale: isArtisanale
        }
      });
    } catch (err) {
      console.error("Erreur sauvegarde temporaire :", err.message);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [currentStep, selectedEntreprise, formeSociale, modificationDate, nouveauPresident, beneficiaireEffectif, createdWithTop, modifiedStatuts, isArtisanale]);

  const steps = useMemo(() => [
    {
      title: "Sélectionnez la société à modifier",
      description: "Recherchez votre entreprise dans notre base de données",
      content: <SearchEntreprise onSelect={setSelectedEntreprise} />,
      validation: () => selectedEntreprise !== null
    },
    {
      title: "Forme sociale de la société",
      description: "Quelle est la forme sociale de votre société ?",
      content: (
        <select 
          value={formeSociale} 
          onChange={(e) => setFormeSociale(e.target.value)} 
          className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
        >
          <option value="">Sélectionner</option>
          {['SAS', 'SASU', 'SARL', 'EURL', 'SCI', 'AE'].map(fs => (
            <option key={fs} value={fs}>{fs}</option>
          ))}
        </select>
      ),
      validation: () => formeSociale !== ''
    },
    {
      title: "Date de modification",
      description: "Quand souhaitez-vous modifier votre entreprise ?",
      content: (
        <div className="space-y-3">
          {['Dans la semaine', 'Dans les prochaines semaines', 'Dans les prochains mois'].map((option) => (
            <label key={option} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={modificationDate === option}
                onChange={() => setModificationDate(option)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ),
      validation: () => modificationDate !== ''
    },
    {
      title: "Nouveau président ou dirigeant",
      description: "Renseignez les informations du nouveau dirigeant",
      content: (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Prénom"
            value={nouveauPresident.prenom}
            onChange={e => setNouveauPresident({ ...nouveauPresident, prenom: e.target.value })}
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
          />
          <input
            type="text"
            placeholder="Nom"
            value={nouveauPresident.nom}
            onChange={e => setNouveauPresident({ ...nouveauPresident, nom: e.target.value })}
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
          />
        </div>
      ),
      validation: () => nouveauPresident.prenom.trim() !== '' && nouveauPresident.nom.trim() !== ''
    },
    {
      title: "Bénéficiaires effectifs",
      description: "Avez-vous déjà déposé votre liste des bénéficiaires effectifs ?",
      content: (
        <div className="space-y-3">
          {[{ label: "Oui", value: true }, { label: "Non", value: false }].map(option => (
            <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={beneficiaireEffectif === option.value}
                onChange={() => setBeneficiaireEffectif(option.value)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ),
      validation: () => beneficiaireEffectif !== null
    },
    {
      title: "Création avec TOP-JURIDIQUE",
      description: "Avez-vous créé votre société avec TOP-JURIDIQUE ?",
      content: (
        <div className="space-y-3">
          {[{ label: "Oui", value: true }, { label: "Non", value: false }].map(option => (
            <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={createdWithTop === option.value}
                onChange={() => setCreatedWithTop(option.value)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ),
      validation: () => createdWithTop !== null
    },
    {
      title: "Modification des statuts",
      description: "Avez-vous modifié vos statuts depuis la création ?",
      content: (
        <div className="space-y-3">
          {[{ label: "Oui", value: true }, { label: "Non", value: false }].map(option => (
            <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
              <input
                type="radio"
                checked={modifiedStatuts === option.value}
                onChange={() => setModifiedStatuts(option.value)}
                className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
              />
              <span>{option.label}</span>
            </label>
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
          <div className="space-y-3">
            {[{ label: "Oui", value: true }, { label: "Non", value: false }].map(option => (
              <label key={option.label} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
                <input
                  type="radio"
                  checked={isArtisanale === option.value}
                  onChange={() => setIsArtisanale(option.value)}
                  className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Pour les activités artisanales, l'enregistrement auprès de la chambre des métiers et de l'artisanat est obligatoire. Ce service est proposé par TOP-JURIDIQUE (79€ HT).
          </p>
        </div>
      ),
      validation: () => isArtisanale !== null
    }
  ], [
    selectedEntreprise, formeSociale, modificationDate, nouveauPresident, 
    beneficiaireEffectif, createdWithTop, modifiedStatuts, isArtisanale
  ]);

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
      const payload = {
        user: userId,
        entreprise: selectedEntreprise,
        formeSociale,
        modificationDate,
        nouveauPresident,
        beneficiaireEffectif,
        createdWithTop,
        modifiedStatuts,
        artisanale: isArtisanale
      };

      const { data: nouveauDossier } = await axios.post(
        `${backendUrl}/api/modification/president/submit`,
        payload
      );

      await axios.post(`${backendUrl}/api/progress/complete`, {
        userId,
        typeDemarche: 'changement-president'
      });

      toast.success("Formulaire soumis avec succès !");
      navigate(`/paiement-modification?dossierId=${nouveauDossier._id}`, {
        state: {
          ...nouveauDossier,
          type: "CHANGEMENT_PRESIDENT"
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
        <Stepper />
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
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#f4d47c]/10 rounded-xl p-5 border border-[#f4d47c]/30">
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Notre équipe est disponible pour vous accompagner dans le changement de président de votre entreprise.
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

export default ChangementPresident;