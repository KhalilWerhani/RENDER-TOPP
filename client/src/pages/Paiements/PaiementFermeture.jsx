import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Stepper from '../Stepper';
import { FiCheckCircle, FiAlertCircle, FiLoader, FiCreditCard, FiInfo, FiShield } from 'react-icons/fi';

const PaiementFermeture = () => {
  const { backendUrl } = useContext(AppContent);
  const { id: dossierId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(location.state?.dossier);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [montant, setMontant] = useState(0);

const calculateAmount = (dossier) => {
  if (!dossier) return 0;
  
  let baseAmount = 0;
  switch(dossier.typeFermeture) {
    case 'RADIATION_AUTO_ENTREPRENEUR':
      baseAmount = 10;
      break;
    case 'DISSOLUTION_LIQUIDATION':
      baseAmount = 15;
      break;
    case 'MISE_EN_SOMMEIL':
      baseAmount = 8;
      break;
    case 'DEPOT_DE_BILAN':
      baseAmount = 20; // Set your price for this type
      break;
    default:
      baseAmount = 10;
  }
  
  return dossier.artisanale ? baseAmount + 10 : baseAmount;
};

  useEffect(() => {
    const fetchDossier = async () => {
      setIsLoading(true);
      try {
        // First check if we have dossier in location state
        if (location.state?.dossier) {
          setDossier(location.state.dossier);
          setMontant(calculateAmount(location.state.dossier));
          setIsLoading(false);
          return;
        }

        if (!dossierId) {
          toast.error("Dossier introuvable");
          navigate("/paiement-cancelled");
          return;
        }

        const { data } = await axios.get(
          `${backendUrl}/api/fermeture/${dossierId}`,
          { withCredentials: true }
        );
        setDossier(data);
        setMontant(calculateAmount(data));
        if (data.statut === 'payé') {
          setPaymentStatus('succeeded');
        }
      } catch (err) {
        toast.error("Impossible de charger le dossier. Redirection...");
        navigate("/paiement-cancelled");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [dossierId, backendUrl, navigate, location.state]);

  const getTypeDetails = () => {
    switch (dossier?.typeFermeture) {
      case "RADIATION_AUTO_ENTREPRENEUR":
        return {
          message: "Radiation auto-entrepreneur",
          icon: "🚪",
          color: "from-[#f4d47c] to-[#f4d47c]",
          badgeColor: "bg-gray-100 text-gray-800"
        };
      case "DISSOLUTION_LIQUIDATION":
        return {
          message: "Dissolution et liquidation",
          icon: "🏦",
          color: "from-[#f4d47c] to-[#f4d47c]",
          badgeColor: "bg-gray-100 text-gray-800"
        };
      case "MISE_EN_SOMMEIL":
        return {
          message: "Mise en sommeil",
          icon: "🛌",
          color: "from-[#f4d47c] to-[#f4d47c]",
          badgeColor: "bg-gray-100 text-gray-800"
        };
      case "DEPOT_DE_BILAN":
        return {
          message: "Dépôt de bilan",
          icon: "📉",
          color: "from-[#f4d47c] to-[#f4d47c]",
          badgeColor: "bg-gray-100 text-gray-800"
        };
      default:
        return {
          message: "Fermeture",
          icon: "🔒",
          color: "from-[#f4d47c] to-[#f4d47c]",
          badgeColor: "bg-gray-100 text-gray-800"
        };
    }
  };

  const lancerPaiement = async () => {
  setIsProcessing(true);
  try {
    const { data: userRes } = await axios.get(`${backendUrl}/api/user/data`, {
      withCredentials: true,
    });

    const userId = userRes?.userData?.id;
    
    if (!userId) throw new Error("Utilisateur non identifié");

    if (!dossier?._id || !dossier?.typeFermeture) {
      throw new Error("Données du dossier incomplètes.");
    }

    const payload = {
      userId: userId,  // Use the userId we just fetched
      dossierId: dossier._id,  // Use the dossier from component state
      modificationType: dossier.typeFermeture,  // Use the type from dossier
      modificationId: dossier._id,
      amount: montant,  // Use the calculated amount
      isFermeture: true
    };

    const { data: session } = await axios.post(
      `${backendUrl}/api/paiement/create-checkout-session`,
      payload,
      { withCredentials: true }
    );

    if (session?.url) {
      window.location.href = session.url;
    } else {
      toast.error("Erreur lors de la redirection vers le paiement.");
    }
  } catch (err) {
    toast.error("Erreur lors du paiement.");
    console.error("❌ Axios error:", err.response?.data || err.message);
  } finally {
    setIsProcessing(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f4d47c]"></div>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Dossier introuvable</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const typeDetails = getTypeDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mt-14 mx-auto px-4 pt-6 pb-12">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper currentStep={2} />
        </div>
        
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${typeDetails.color} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{typeDetails.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Paiement de votre fermeture</h1>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${typeDetails.badgeColor}`}>
                    {typeDetails.message}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Référence</p>
                <p className="font-mono font-medium">{dossierId}</p>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6 space-y-6">
            {/* Summary */}
           <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails de la fermeture</h3>
    <p className="text-gray-600"><strong>Entreprise :</strong> {dossier?.entreprise?.nom}</p>
    <p className="text-gray-600"><strong>SIRET :</strong> {dossier?.entreprise?.siret}</p>
    <p className="text-gray-600"><strong>Forme juridique :</strong> {dossier?.formeSociale}</p>
    <p className="text-gray-600"><strong>Date prévue :</strong> {dossier?.fermetureDate}</p>
    
    {/* Add this section for DEPOT_DE_BILAN details */}
    {(dossier?.typeFermeture === 'DEPOT_DE_BILAN' || dossier?.typeFermeture === 'Dépôt de bilan') && dossier?.depotBilan && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Détails du dépôt de bilan</h4>
        <p className="text-gray-600"><strong>Nom :</strong> {dossier.depotBilan.nom}</p>
        <p className="text-gray-600"><strong>Prénom :</strong> {dossier.depotBilan.prenom}</p>
        <p className="text-gray-600"><strong>Email :</strong> {dossier.depotBilan.email}</p>
        <p className="text-gray-600"><strong>Téléphone :</strong> {dossier.depotBilan.telephone}</p>
        <p className="text-gray-600"><strong>Rôle :</strong> {dossier.depotBilan.role}</p>
        <p className="text-gray-600"><strong>Souhait :</strong> {dossier.depotBilan.souhait}</p>
        <p className="text-gray-600"><strong>Situation :</strong> {dossier.depotBilan.situation}</p>
        {dossier.depotBilan.societe && (
          <p className="text-gray-600"><strong>Société :</strong> {dossier.depotBilan.societe}</p>
        )}
        {dossier.depotBilan.precisions && (
          <p className="text-gray-600"><strong>Précisions :</strong> {dossier.depotBilan.precisions}</p>
        )}
      </div>
    )}
  </div>
</div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Montant à régler</h2>
                  <p className="text-gray-500 text-sm">TVA incluse le cas échéant</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{montant} €</p>
                  {dossier.artisanale && (
                    <p className="text-sm text-gray-500">(inclut frais artisanaux)</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status Message */}
            <motion.div 
              key={paymentStatus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl p-4 border-l-4 ${
                paymentStatus === 'pending' 
                  ? 'bg-amber-50 border-amber-400'
                  : paymentStatus === 'succeeded'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
              }`}
            >
              <div className="flex items-start">
                {paymentStatus === 'pending' ? (
                  <FiAlertCircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                ) : paymentStatus === 'succeeded' ? (
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                ) : (
                  <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                )}
                <div>
                  <p className="font-medium">
                    {paymentStatus === 'pending' 
                      ? "Paiement en attente"
                      : paymentStatus === 'succeeded'
                        ? "Paiement confirmé"
                        : "Paiement échoué"}
                  </p>
                  <p className="text-sm mt-1">
                    {paymentStatus === 'pending' 
                      ? "Veuillez compléter votre paiement pour finaliser votre demande."
                      : paymentStatus === 'succeeded'
                        ? "Votre dossier est maintenant en cours de traitement."
                        : "Une erreur est survenue lors du traitement de votre paiement."}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Payment Action */}
            <div className="space-y-4">
              <motion.button
                onClick={lancerPaiement}
                disabled={paymentStatus === 'succeeded' || isProcessing}
                whileHover={paymentStatus !== 'succeeded' && !isProcessing ? { scale: 1.01 } : {}}
                whileTap={paymentStatus !== 'succeeded' && !isProcessing ? { scale: 0.99 } : {}}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center transition-all ${
                  paymentStatus === 'succeeded' 
                    ? 'bg-green-100 text-green-600 cursor-not-allowed'
                    : isProcessing
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md'
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin mr-3" size={18} />
                    Traitement en cours...
                  </>
                ) : paymentStatus === 'succeeded' ? (
                  <>
                    <FiCheckCircle className="mr-3" size={18} />
                    Paiement confirmé
                  </>
                ) : (
                  <>
                    <FiCreditCard className="mr-3" size={18} />
                    Procéder au paiement sécurisé
                  </>
                )}
              </motion.button>
              
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                <FiShield className="text-blue-500" size={16} />
                <span>Paiement 100% sécurisé</span>
                <span>•</span>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                  alt="Stripe" 
                  className="h-5 opacity-80"
                />
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <FiInfo className="mr-2 text-blue-500" size={16} />
                Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Processus de paiement crypté et sécurisé</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Aucun stockage de données bancaires</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Reçu envoyé par email immédiatement</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaiementFermeture;