import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { CheckCircle, Loader, FileText, ArrowRight, Home } from 'react-feather';

const PaiementSuccess = () => {
  const { backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [paiement, setPaiement] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [dossierType, setDossierType] = useState(null); // 'creation', 'modification', or 'fermeture'
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (!sessionId) {
      toast.error("Session ID manquant");
      setLoading(false);
      return;
    }

   const fetchPaiementAndDossier = async () => {
  try {
    const { data: paiementData } = await axios.get(
      `${backendUrl}/api/paiement/verify-session/${sessionId}`,
      { withCredentials: true }
    );
    setPaiement(paiementData);

    // Determine dossier type
    let type = 'creation';
    let endpoint = `${backendUrl}/api/dossiers/${paiementData.dossier}`;
    
    const modificationTypes = [
      "TRANSFERT_SIEGE",
      "CHANGEMENT_DENOMINATION",
      "CHANGEMENT_PRESIDENT",
      "CHANGEMENT_ACTIVITE",
      "TRANSFORMATION_SARL_EN_SAS",
      "TRANSFORMATION_SAS_EN_SARL"
    ];

    if (paiementData.dossierModel === 'dossierModification' || 
        modificationTypes.includes(paiementData.modificationType)) {
      type = 'modification';
      endpoint = `${backendUrl}/api/dossiers/modifications/${paiementData.dossier}`;
    } else if (paiementData.modificationType === 'FERMETURE') {
      type = 'fermeture';
      endpoint = `${backendUrl}/api/fermeture/${paiementData.dossier}`; // Fixed this line
    }

    setDossierType(type);

    const { data: dossierData } = await axios.get(endpoint, {
      withCredentials: true
    });
    setDossier(dossierData);

  } catch (err) {
    console.error("Fetch error:", err);
    toast.error(err.response?.data?.message || "Erreur lors de la récupération des données");
  } finally {
    setLoading(false);
  }
};

    fetchPaiementAndDossier();
  }, [backendUrl, location]);

  const handleNavigateToDocuments = () => {
  if (!dossier?._id) {
    toast.error("Dossier non disponible");
    return;
  }
  
  if (dossierType === 'fermeture') {
    navigate(`/form-entreprise/${dossier._id}?type=fermeture`);
  } else {
    navigate(`/form-entreprise/${dossier._id}?type=${dossierType}`);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-10 max-w-md w-full">
            <div className="animate-spin mx-auto text-blue-600 mb-4">
              <Loader size={48} />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Vérification de votre paiement...</h2>
            <p className="text-gray-500 mt-2">Veuillez patienter pendant que nous confirmons votre transaction.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-2xl">
          {/* Header */}
          <div className="bg-white p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Paiement Réussi</h1>
            <p className="text-green-400">Votre transaction a été effectuée avec succès</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Récapitulatif</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Montant payé</span>
                  <span className="font-semibold">{paiement?.montant} €</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Statut du dossier</span>
                  <span className="font-semibold text-green-600 capitalize">
                    {dossier?.statut || 'payé'}
                  </span>
                </div>
                
                {(dossierType === 'modification' || dossierType === 'fermeture') && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">
                      {dossierType === 'modification' ? 'Type de modification' : 'Type de fermeture'}
                    </span>
                    <span className="font-semibold text-right">
                      {dossierType === 'modification' 
                        ? paiement?.modificationType?.replace(/_/g, ' ')
                        : dossier?.typeFermeture?.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Référence</span>
                  <span className="font-mono text-blue-600">
                    {paiement?.sessionId?.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleNavigateToDocuments}
                className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                <FileText size={18} className="mr-2" />
                {dossierType === 'fermeture' 
                  ? 'Compléter la fermeture' 
                  : dossierType === 'modification' 
                    ? 'Compléter la modification' 
                    : 'Déposer les documents'}
                <ArrowRight size={18} className="ml-2" />
              </button>
              
              <button
                onClick={() => navigate(dossierType === 'creation' ? '/dashboard/projets' : '/dashboarduser')}
                className="w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition duration-200"
              >
                Voir dans mon espace
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition duration-200 flex items-center justify-center"
              >
                <Home size={16} className="mr-2" />
                Retour à l'accueil
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-gray-500 text-sm">
                Un email de confirmation vous a été envoyé. Pour toute question, contactez notre support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaiementSuccess;