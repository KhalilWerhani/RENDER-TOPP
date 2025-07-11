import React, { useContext, useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Stepper from '../Stepper';
import SearchEntreprise from '../../components/SearchEntreprise';
import { AppContent } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangementDenomination = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [entreprise, setEntreprise] = useState(null);
  const [formeSociale, setFormeSociale] = useState('');
  const [modificationDate, setModificationDate] = useState('');
  const [modifs, setModifs] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [typeActivite, setTypeActivite] = useState('');
  const [vendeurs, setVendeurs] = useState([{ prenom: '', nom: '' }]);
  const [adresseActuelle, setAdresseActuelle] = useState('');
  const [adresseNouvelle, setAdresseNouvelle] = useState('');
  const [beneficiaireEffectif, setBeneficiaireEffectif] = useState(null);
  const [createdWithTop, setCreatedWithTop] = useState(null);
  const [modifiedStatuts, setModifiedStatuts] = useState(null);
  const [artisanale, setArtisanale] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data: userData } = await axios.get(`${backendUrl}/api/user/data`, {
          withCredentials: true
        });

        const uid = userData?.userData?.id;
        setUserId(uid);

        const { data } = await axios.get(`${backendUrl}/api/progress/${uid}/changement-denomination`);
        if (data) {
          const f = data.formData || {};
          setEntreprise(f.entreprise || null);
          setFormeSociale(f.formeSociale || '');
          setModificationDate(f.modificationDate || '');
          setModifs(f.modifs || []);
          setNouveauNom(f.nouveauNom || '');
          setTypeActivite(f.typeActivite || '');
          setVendeurs(f.vendeurs || [{ prenom: '', nom: '' }]);
          setAdresseActuelle(f.adresseActuelle || '');
          setAdresseNouvelle(f.adresseNouvelle || '');
          setBeneficiaireEffectif(f.beneficiaireEffectif || null);
          setCreatedWithTop(f.createdWithTop || null);
          setModifiedStatuts(f.modifiedStatuts || null);
          setArtisanale(f.artisanale || null);
          setCurrentStep(data.currentStep || 0);
        }
      } catch (err) {
        console.log("Pas de progression existante.");
      }
    };

    fetchProgress();
  }, [backendUrl]);

  const saveProgress = async (step) => {
    if (!userId) return;
    try {
      const formData = {
        entreprise,
        formeSociale,
        modificationDate,
        modifs,
        nouveauNom,
        typeActivite,
        vendeurs,
        adresseActuelle,
        adresseNouvelle,
        beneficiaireEffectif,
        createdWithTop,
        modifiedStatuts,
        artisanale
      };

      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'changement-denomination',
        currentStep: step,
        formData
      });
    } catch (err) {
      console.error("Erreur sauvegarde progression :", err);
    }
  };

  const toggleModif = (item) => {
    setModifs(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const updateVendeur = (index, key, value) => {
    const newList = [...vendeurs];
    newList[index][key] = value;
    setVendeurs(newList);
  };

  const steps = useMemo(() => {
    const baseSteps = [
      {
        title: 'Sélectionnez la société à modifier',
        description: 'Recherchez et sélectionnez votre entreprise dans notre base de données',
        content: <SearchEntreprise onSelect={setEntreprise} />,
        validation: () => entreprise !== null
      },
      {
        title: 'Forme sociale de votre société',
        description: 'Quelle est la forme sociale de votre société ?',
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
        title: 'Date de modification',
        description: 'Quand souhaitez-vous modifier votre entreprise ?',
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
        title: 'Modifications souhaitées',
        description: 'Que souhaitez-vous modifier sur la société ?',
        content: (
          <div className="grid grid-cols-2 gap-3">
            {["Adresse", "Dirigeants", "Vente de parts", "Activité", "Dénomination", "Établissements", "Ajout nom commercial", "Date clôture", "Commissaire aux comptes"].map(item => (
              <label key={item} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#f4d47c] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={modifs.includes(item)} 
                  onChange={() => toggleModif(item)} 
                  className="h-5 w-5 text-[#f4d47c] focus:ring-[#f4d47c]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        ),
        validation: () => modifs.length > 0
      }
    ];

    // Conditional steps based on selected modifications
    if (modifs.includes("Dénomination")) {
      baseSteps.push({
        title: 'Nouvelle dénomination',
        description: 'Quel sera le nouveau nom de la société ?',
        content: (
          <div className="space-y-2">
            <input
              type="text"
              value={nouveauNom}
              onChange={(e) => setNouveauNom(e.target.value)}
              placeholder="Nouveau nom de l'entreprise"
              className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c] focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              Le nom doit être unique et disponible au registre du commerce
            </p>
          </div>
        ),
        validation: () => nouveauNom.trim() !== ''
      });
    }

    if (modifs.includes("Activité")) {
      baseSteps.push({
        title: "Modification d'activité",
        description: "Comment modifiez-vous l'activité de la société ?",
        content: (
          <div className="grid grid-cols-1 gap-3">
            {["Ajout d'une activité", "Changement complet"].map((option) => (
              <button
                key={option}
                onClick={() => setTypeActivite(option)}
                className={`p-4 text-left rounded-lg border transition-all ${
                  typeActivite === option
                    ? 'border-[#f4d47c] bg-[#f4d47c]/10'
                    : 'border-gray-200 hover:border-[#f4d47c]'}`}
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        ),
        validation: () => typeActivite !== ''
      });
    }

    if (modifs.includes("Vente de parts")) {
      baseSteps.push({
        title: 'Vendeurs de parts',
        description: 'Qui vend des parts de la société ?',
        content: (
          <div className="space-y-4">
            {vendeurs.map((v, i) => (
              <div key={i} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={v.prenom}
                  onChange={e => updateVendeur(i, 'prenom', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={v.nom}
                  onChange={e => updateVendeur(i, 'nom', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
                />
              </div>
            ))}
            <button
              onClick={() => setVendeurs([...vendeurs, { prenom: '', nom: '' }])}
              className="text-[#f4d47c] font-medium hover:underline"
            >
              + Ajouter un vendeur
            </button>
          </div>
        ),
        validation: () => vendeurs.every(v => v.prenom.trim() !== '' && v.nom.trim() !== '')
      });
    }

    if (modifs.includes("Adresse")) {
      baseSteps.push({
        title: 'Changement d\'adresse',
        description: 'Adresse actuelle et nouvelle adresse',
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adresse actuelle</label>
              <input
                type="text"
                placeholder="Adresse actuelle"
                value={adresseActuelle}
                onChange={(e) => setAdresseActuelle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nouvelle adresse</label>
              <input
                type="text"
                placeholder="Nouvelle adresse"
                value={adresseNouvelle}
                onChange={(e) => setAdresseNouvelle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4d47c]"
              />
            </div>
          </div>
        ),
        validation: () => adresseActuelle.trim() !== '' && adresseNouvelle.trim() !== ''
      });
    }

    // Common final steps
    baseSteps.push(
      {
        title: 'Bénéficiaires effectifs',
        description: 'Avez-vous déjà déposé votre liste des bénéficiaires effectifs ?',
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
        title: 'Création avec TOP-JURIDIQUE',
        description: 'Avez-vous créé votre société avec TOP-JURIDIQUE ?',
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
        title: 'Modification des statuts',
        description: 'Avez-vous déjà modifié vos statuts depuis la création ?',
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
        title: 'Activité artisanale',
        description: 'Votre activité est-elle artisanale ?',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['Oui', 'Non'].map((option) => (
                <button
                  key={option}
                  onClick={() => setArtisanale(option === 'Oui')}
                  className={`p-4 text-center rounded-lg border transition-all ${
                    artisanale === (option === 'Oui')
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
        validation: () => artisanale !== null
      }
    );

    return baseSteps;
  }, [
    entreprise, 
    formeSociale, 
    modificationDate, 
    modifs, 
    nouveauNom, 
    typeActivite, 
    vendeurs, 
    adresseActuelle, 
    adresseNouvelle, 
    beneficiaireEffectif, 
    createdWithTop, 
    modifiedStatuts, 
    artisanale
  ]);

  const handleNextStep = () => {
    if (steps[currentStep].validation()) {
      setCurrentStep((prev) => prev + 1);
      saveProgress(currentStep + 1);
    } else {
      toast.warning("Veuillez compléter cette étape avant de continuer.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    saveProgress(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!steps[currentStep].validation()) return;

    setIsSubmitting(true);
    try {
      if (!userId || !entreprise) {
        toast.error("Utilisateur ou entreprise manquante");
        return;
      }

      const payload = {
        user: userId,
        type: 'CHANGEMENT_DENOMINATION',
        entreprise,
        formeSociale,
        modificationDate,
        modifs,
        nouveauNom,
        typeActivite,
        vendeurs,
        adresseActuelle,
        adresseNouvelle,
        beneficiaireEffectif,
        createdWithTop,
        modifiedStatuts,
        artisanale
      };

      const { data: nouveauDossier } = await axios.post(`${backendUrl}/api/modification/changement-denomination`, payload);

      await axios.post(`${backendUrl}/api/progress/save`, {
        userId,
        typeDemarche: 'changement-denomination',
        currentStep: steps.length - 1,
        formData: payload,
        isCompleted: true
      });

      await axios.post(`${backendUrl}/api/progress/reset`, {
        userId,
        typeDemarche: 'changement-denomination'
      });

      toast.success("Formulaire soumis !");
      navigate(`/paiement-modification?dossierId=${nouveauDossier._id}`, {
        state: {
          ...nouveauDossier,
          type: "CHANGEMENT_DENOMINATION"
        }
      });

    } catch (err) {
      console.error("Erreur soumission changement :", err);
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
                {isSubmitting ? 'Enregistrement...' : 'Soumettre la demande'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#f4d47c]/10 rounded-xl p-5 border border-[#f4d47c]/30">
          <h3 className="font-medium text-gray-800 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nous sommes là pour vous aider à chaque étape de la modification de votre entreprise.
          </p>
          <button className="text-sm text-[#f4d47c] font-medium hover:underline">
            Contactez notre support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangementDenomination;