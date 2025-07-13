import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import Stepper from './Stepper';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchEntreprise from '../components/SearchEntreprise';

const FormProject = () => {
  const { backendUrl } = useContext(AppContent);
  const [currentStep, setCurrentStep] = useState(0);
  const [entrepriseType, setEntrepriseType] = useState('');
  const [workingAlone, setWorkingAlone] = useState(null);
  const [entrepriseName, setEntrepriseName] = useState('');
  const [secteurActivite, setSecteurActivite] = useState('');
  const [autoEntrepreneur, setAutoEntrepreneur] = useState(null);
  const [profession, setProfession] = useState('');
  const [startDate, setStartDate] = useState('');
  const [domiciliation, setDomiciliation] = useState('');
  const [multipleAssociates, setMultipleAssociates] = useState(null);

  const navigate = useNavigate();

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const entrepriseTypes = [
    { label: "SAS / SASU", value: "SAS" },
    { label: "SARL / EURL", value: "SARL" },
    { label: "SCI", value: "SCI" },
    { label: "Auto-entrepreneur", value: "AUTO-ENTREPRENEUR" },
    { label: "Entreprise individuelle", value: "Entreprise individuelle" },
    { label: "Association", value: "Association" }
  ];

  const steps = [
    {
      title: "Choisir le type d'entreprise",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {entrepriseTypes.map((item, index) => (
            <div
              key={index}
              className={`p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer
                ${entrepriseType === item.value ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
              onClick={() => {
                if (item.value === "Association") {
                  navigate("/form-association");
                } else if (item.value === "AUTO-ENTREPRENEUR") {
                  navigate("/form-auto-entrepreneur");
                } else if (item.value === "Entreprise individuelle") {
                  navigate("/form-EI");
                } else if (item.value === "SCI") {
                  navigate("/form-sci");
                } else {
                  setEntrepriseType(item.value);
                  goToNextStep();
                }
              }}
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.label}</h3>
                <p className="text-sm text-gray-500">
                  {item.value === "SAS" && "Société par actions simplifiée"}
                  {item.value === "SARL" && "Société à responsabilité limitée"}
                  {item.value === "SCI" && "Société civile immobilière"}
                  {item.value === "AUTO-ENTREPRENEUR" && "Régime micro-entrepreneur"}
                  {item.value === "Entreprise individuelle" && "Entreprise en nom personnel"}
                  {item.value === "Association" && "Organisme à but non lucratif"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },

    ...(entrepriseType === "SAS" || entrepriseType === "SARL" ? [{
      title: entrepriseType === "SAS" 
        ? "Souhaitez-vous créer une SASU (seul) ou une SAS (à plusieurs) ?" 
        : "Souhaitez-vous créer une EURL (seul) ou une SARL (à plusieurs) ?",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            Sélectionnez la structure adaptée à votre situation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seul(e) */}
            <div 
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer
                ${entrepriseType === (entrepriseType === "SAS" ? "SASU" : "EURL") ? 
                  'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              onClick={() => {
                const newType = entrepriseType === "SAS" ? "SASU" : "EURL";
                setEntrepriseType(newType);
                setMultipleAssociates(false);
                if (newType === "SASU") {
                  navigate('/form-sasu');
                } else {
                  navigate('/form-eurl');
                }
              }}
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Je suis seul(e)</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {entrepriseType === "SAS" 
                    ? "Structure unipersonnelle avec une seule associé" 
                    : "Entreprise individuelle avec responsabilité limitée"}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                  {entrepriseType === "SAS" ? "Créer une SASU" : "Créer une EURL"}
                </button>
              </div>
            </div>

            {/* À plusieurs */}
            <div 
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer
                ${entrepriseType === entrepriseType ? 
                  'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              onClick={() => {
                setEntrepriseType(entrepriseType);
                setMultipleAssociates(true);
                if (entrepriseType === "SAS") {
                  navigate('/form-sas');
                } else {
                  navigate('/form-sarl');
                }
              }}
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">On est plusieurs</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {entrepriseType === "SAS" 
                    ? "Structure avec plusieurs associés et capital social" 
                    : "Entreprise avec plusieurs associés et responsabilité limitée"}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                  {entrepriseType === "SAS" ? "Créer une SAS" : "Créer une SARL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    }] : []),

    {
      title: "Quelle est votre profession ?",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["Étudiant", "Entrepreneur", "Salarié"].map((label, index) => (
            <div
              key={index}
              onClick={() => setProfession(label)}
              className={`p-4 rounded-lg text-center cursor-pointer transition-all duration-300 border
                ${profession === label 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <h3 className="font-medium text-gray-800">{label}</h3>
            </div>
          ))}
        </div>
      ),
    },

    {
      title: "Quand souhaitez-vous démarrer votre activité ?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["Dans une semaine", "Dans un mois", "Autres"].map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  const date = new Date();
                  if (option === "Dans une semaine") {
                    date.setDate(date.getDate() + 7);
                    setStartDate(date.toISOString().split("T")[0]);
                  } else if (option === "Dans un mois") {
                    date.setMonth(date.getMonth() + 1);
                    setStartDate(date.toISOString().split("T")[0]);
                  } else {
                    setStartDate('autres');
                  }
                }}
                className={`p-4 rounded-lg text-center cursor-pointer transition-all duration-300 border
                  ${(startDate === "autres" && option === "Autres") ||
                    (option === "Dans une semaine" && startDate === new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]) ||
                    (option === "Dans un mois" && startDate === new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0])
                    ? 'border-blue-500 bg-blue-50'
                    : 'bg-white border-gray-200 hover:border-gray-300'}`}
              >
                <h3 className="font-medium text-gray-800">{option}</h3>
              </div>
            ))}
          </div>

          {startDate === "autres" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionnez une date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          )}
        </div>
      ),
    },

    {
      title: "La domiciliation de votre entreprise",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de domiciliation</label>
            <input
              type="text"
              value={domiciliation}
              onChange={(e) => setDomiciliation(e.target.value)}
              placeholder="Adresse ou ville"
              className="w-full p-2.5 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Cette adresse sera utilisée pour le siège social de votre entreprise</p>
        </div>
      ),
    },

    {
      title: "Faites-vous cela seul ou avec d'autres personnes ?",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["Oui, avec des associés", "Non, je suis seul"].map((label, index) => (
            <div
              key={index}
              onClick={() => setWorkingAlone(index === 1)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border
                ${workingAlone === (index === 1) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <h3 className="font-medium text-gray-800">{label}</h3>
            </div>
          ))}
        </div>
      ),
    },

    {
      title: "Nom de l'entreprise",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de votre future entreprise</label>
            <input
              type="text"
              value={entrepriseName}
              onChange={(e) => setEntrepriseName(e.target.value)}
              placeholder="Entrez le nom de l'entreprise"
              className="w-full p-2.5 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Ce nom sera vérifié pour sa disponibilité</p>
        </div>
      ),
    },

    {
      title: "Secteur d'activité",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domaine d'activité principal</label>
            <input
              type="text"
              value={secteurActivite}
              onChange={(e) => setSecteurActivite(e.target.value)}
              placeholder="Ex: Restauration, Conseil IT, E-commerce..."
              className="w-full p-2.5 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Ceci nous aide à personnaliser votre expérience</p>
        </div>
      ),
    },

    {
      title: "Êtes-vous auto-entrepreneur ?",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["Oui, je suis auto-entrepreneur", "Non, autre régime"].map((label, index) => (
            <div
              key={index}
              onClick={() => setAutoEntrepreneur(index === 0)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border
                ${autoEntrepreneur === (index === 0) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <h3 className="font-medium text-gray-800">{label}</h3>
            </div>
          ))}
        </div>
      ),
    }
  ];

  const handleSubmit = async () => {
    const formData = {
      entrepriseType,
      profession,
      startDate,
      domiciliation,
      workingAlone,
      entrepriseName,
      secteurActivite,
      autoEntrepreneur,
      multipleAssociates
    };

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });

      const userId = data?.userData?.id;
      if (!userId) throw new Error("Données utilisateur introuvables.");

      const { data: nouveauDossier } = await axios.post(`${backendUrl}/api/dossier/choisir-demarche`, {
        userId,
        typeDossier: entrepriseType
      });

      const dossierId = nouveauDossier._id;

      await axios.post(`${backendUrl}/api/dossier/questionnaire/${dossierId}`, {
        reponses: formData
      });

      toast.success("Formulaire soumis avec succès !");
      navigate(`/paiement?dossierId=${dossierId}`);

    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);
      toast.error("Erreur lors de la soumission du formulaire.");
      navigate("/paiement-cancelled");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold text-gray-900">Création d'entreprise</h1>
              <span className="text-sm text-gray-500">
                Étape {currentStep + 1} sur {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Step Header */}
            <div className="bg-white p-6 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">{steps[currentStep].title}</h2>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {steps[currentStep].content}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 pb-6 flex justify-between border-t border-gray-200 pt-6">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition border border-gray-300"
                >
                  Précédent
                </button>
              )}

              <div className="flex-grow"></div>

              {currentStep < steps.length - 1 &&
                !(currentStep === 0 || (currentStep === 1 && (entrepriseType === "SAS" || entrepriseType === "SARL"))) && (
                <button
                  onClick={goToNextStep}
                  className="px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Suivant
                </button>
              )}

              {currentStep === steps.length - 1 && (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Finaliser la création
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProject;