import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FiCreditCard, FiCheckCircle, FiClock, FiDollarSign, FiCalendar, FiFileText, FiType } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MesPaiements = () => {
  const { backendUrl } = useContext(AppContent);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/paiement/mes-paiements`, {
          withCredentials: true,
        });
        setPaiements(data.paiements);
      } catch (err) {
        toast.error("Erreur chargement paiements");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, [backendUrl]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'payé':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Erreur Stripe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'payé':
        return <FiCheckCircle className="text-green-500" />;
      case 'en attente':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiCreditCard />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!paiements.length) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-blue-50 p-6 rounded-lg inline-block">
          <FiCreditCard className="mx-auto text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Aucun paiement trouvé</h2>
          <p className="text-gray-600 mt-2">Vous n'avez effectué aucun paiement pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiCreditCard className="mr-2" /> Historique des Paiements
          </h1>
          <p className="text-gray-600 mt-1">Vos transactions récentes et leur statut</p>
        </div>

        <div className="divide-y divide-gray-200">
          {paiements.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className={`p-3 rounded-full ${getStatusColor(p.stripe?.statut || p.statut)} mr-4`}>
                    {getStatusIcon(p.stripe?.statut || p.statut)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Paiement #{index + 1} - {p.dossier?.type || 'Dossier'}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <FiCalendar className="mr-1" /> 
                      {new Date(p.stripe?.date || p.date).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-900 mr-4">
                    {p.stripe?.montant || p.montant} {p.stripe?.devise || 'EUR'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(p.stripe?.statut || p.statut)}`}>
                    {p.stripe?.statut || p.statut}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FiFileText className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">
                    {p.dossierModel === 'DossierModification' ? 'Modification' : 'Création'}
                  </span>
                </div>

                {p.modificationType && (
                  <div className="flex items-center">
                    <FiType className="text-gray-400 mr-2" />
                    <span className="text-gray-600">Modification:</span>
                    <span className="ml-2 font-medium">
                      {p.modificationType.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <FiDollarSign className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Méthode:</span>
                  <span className="ml-2 font-medium capitalize">
                    {p.stripe?.methode || p.méthode || 'Non spécifiée'}
                  </span>
                </div>

                <div className="flex items-center">
                  <FiCreditCard className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Référence:</span>
                  <span className="ml-2 font-mono text-sm">
                    {p.sessionId ? p.sessionId.slice(0, 8) + '...' : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-medium">{paiements.length}</span> paiements
          </p>
        </div>
      </div>
    </div>
  );
};

export default MesPaiements;