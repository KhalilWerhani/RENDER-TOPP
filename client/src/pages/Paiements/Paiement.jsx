import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import LoadingPage from '../../components/LoadingPage';
import Stepper from '../Stepper';
import { FiCheckCircle, FiAlertCircle, FiLoader, FiCreditCard, FiInfo, FiLock, FiShield } from 'react-icons/fi';

const Paiement = () => {
  const { backendUrl } = useContext(AppContent);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState(null);
  const [montant, setMontant] = useState(10);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isProcessing, setIsProcessing] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const dossierId = queryParams.get('dossierId');
  const modificationId = queryParams.get('modificationId');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const endpoint = modificationId 
          ? `${backendUrl}/api/dossiers/modifications/${modificationId}`
          : `${backendUrl}/api/dossier/${dossierId}`;
        
        const { data } = await axios.get(endpoint, {
          withCredentials: true
        });
        
        setDossier(data);
        
        if (data.paymentStatus) {
          setPaymentStatus(data.paymentStatus);
        }
      } catch (err) {
        console.error('Error fetching dossier:', err);
        toast.error("Impossible de charger le dossier. Redirection...");
        navigate("/paiement-cancelled");
      } finally {
        setLoading(false);
      }
    };

    if (dossierId || modificationId) {
      fetchDossier();
    } else {
      toast.error("Dossier introuvable.");
      navigate("/paiement-cancelled");
    }
  }, [dossierId, modificationId, backendUrl, navigate]);

  const getTypeDetails = () => {
  switch (dossier?.type) {
    // Création
    case "SAS":
    case "SASU":
      return {
        message: "Société par actions simplifiée",
        icon: "🏢",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };
    case "SCI":
      return {
        message: "Société civile immobilière",
        icon: "🏠",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };
    case "EURL":
    case "SARL":
      return {
        message: "Société à responsabilité limitée",
        icon: "🏛️",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };
    case "AUTO-ENTREPRENEUR":
      return {
        message: "Auto-entrepreneur",
        icon: "👤",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };
    case "Entreprise individuelle":
      return {
        message: "Entreprise individuelle",
        icon: "👔",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };
    case "Association":
      return {
        message: "Association",
        icon: "🤝",
        color: "from-[#f4d47c] to-[#f4d47c]",
        badgeColor: "bg-gray-100 text-gray-800"
      };

    // Modifications
    case "CHANGEMENT_PRESIDENT":
      return {
        message: "Changement de président",
        icon: "🧑‍💼",
        color: "from-blue-100 to-blue-200",
        badgeColor: "bg-blue-100 text-blue-800"
      };
    case "TRANSFERT_SIEGE":
      return {
        message: "Transfert de siège social",
        icon: "🏢",
        color: "from-violet-100 to-violet-200",
        badgeColor: "bg-violet-100 text-violet-800"
      };
    case "CHANGEMENT_DENOMINATION":
      return {
        message: "Changement de dénomination",
        icon: "📝",
        color: "from-pink-100 to-pink-200",
        badgeColor: "bg-pink-100 text-pink-800"
      };
    case "CHANGEMENT_ACTIVITE":
      return {
        message: "Changement d'activité",
        icon: "⚙️",
        color: "from-cyan-100 to-cyan-200",
        badgeColor: "bg-cyan-100 text-cyan-800"
      };
    case "TRANSFORMATION_SARL_EN_SAS":
      return {
        message: "Transformation SARL en SAS",
        icon: "🔁",
        color: "from-sky-100 to-sky-200",
        badgeColor: "bg-sky-100 text-sky-800"
      };
    case "TRANSFORMATION_SAS_EN_SARL":
      return {
        message: "Transformation SAS en SARL",
        icon: "🔄",
        color: "from-sky-100 to-sky-200",
        badgeColor: "bg-sky-100 text-sky-800"
      };

    // Par défaut
    default:
      return {
        message: "Type inconnu",
        icon: "❓",
        color: "from-gray-50 to-gray-100",
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
      if (!dossier?._id || !dossier?.type) {
        throw new Error("Données du dossier incomplètes.");
      }

      const payload = {
        userId,
        dossierId: dossierId || modificationId,
        isModification: !!modificationId,
        modificationType: dossier.type,
        modificationId: dossier._id,
        amount: montant,
      };

    const updateUrl = modificationId 
  ? `${backendUrl}/api/dossiers/modifications/${modificationId}/update-status` 
  : `${backendUrl}/api/dossier/update-statut/${dossierId}`;


await axios.put(
  updateUrl,
  { 
    etatAvancement: "paiement",
    paymentStatus: "pending" 
  },
  { withCredentials: true }
);


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
      console.error("Payment error:", err.response?.data || err.message);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingPage />;

  const typeDetails = getTypeDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mt-14 mx-auto px-4 pt-6 pb-12">
        {/* Stepper - Compact Version */}
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
                  <h1 className="text-2xl font-bold text-gray-800">Finalisation de votre dossier</h1>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${typeDetails.badgeColor}`}>
                    {typeDetails.message}
                  </div>
                </div>
              </div>
              <div className="text-right">
  <p className="text-sm text-gray-600">Référence</p>
  <p className="font-mono font-medium">{dossier?.codeDossier || dossierId || modificationId}</p>
</div>
            </div>
          </div>
          
          {/* Compact Content Area */}
          <div className="p-6 space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Montant à régler</h2>
                  <p className="text-gray-500 text-sm">TVA incluse le cas échéant</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{montant} €</p>
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
            
            {/* Additional Info (Compact) */}
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

export default Paiement;