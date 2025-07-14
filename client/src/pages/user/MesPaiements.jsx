import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { 
  FiCreditCard, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiCalendar, 
  FiFileText, 
  FiUser,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
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
        toast.error("Erreur lors du chargement des paiements");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, [backendUrl]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'payé':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en attente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Erreur Stripe':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'payé':
        return <FiCheckCircle className="text-emerald-500" size={16} />;
      case 'en attente':
        return <FiClock className="text-amber-500" size={16} />;
      case 'Erreur Stripe':
        return <FiAlertCircle className="text-red-500" size={16} />;
      default:
        return <FiLoader className="text-gray-500" size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm inline-block">
          <div className="bg-white p-4 rounded-full inline-flex items-center justify-center shadow-xs mb-4">
            <FiCreditCard className="text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Aucun paiement trouvé</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Vous n'avez effectué aucun paiement pour le moment. Tous vos futurs paiements apparaîtront ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiCreditCard className="mr-3 text-indigo-600" /> 
                Historique des Paiements
              </h1>
              <p className="text-gray-600 mt-1">Vos transactions et leur statut actuel</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-sm font-medium text-gray-800 border border-gray-200 shadow-xs">
                {paiements.length} {paiements.length > 1 ? 'paiements' : 'paiement'}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paiements.map((p, index) => (
                <motion.tr 
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getStatusColor(p.stripe?.statut || p.statut)} mr-3`}>
                        {getStatusIcon(p.stripe?.statut || p.statut)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Paiement #{index + 1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.dossier?.type || 'Dossier'} • {p.dossierModel === 'DossierModification' ? 'Modification' : 'Création'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold text-gray-900">
                      {p.stripe?.montant || p.montant} {p.stripe?.devise || 'EUR'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiDollarSign className="mr-1" />
                      {p.stripe?.methode || p.méthode || 'Non spécifiée'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center rounded-full text-sm font-medium ${getStatusColor(p.stripe?.statut || p.statut)}`}>
                      {getStatusIcon(p.stripe?.statut || p.statut)}
                      <span className="ml-1.5 capitalize">{p.stripe?.statut || p.statut}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(p.stripe?.date || p.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      {p.user && (
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-gray-400" />
                          {p.user.name}
                        </div>
                      )}
                      {p.sessionId && (
                        <div className="flex items-center">
                          <FiCreditCard className="mr-2 text-gray-400" />
                          <span className="font-mono">ID: {p.sessionId.slice(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-medium">{paiements.length}</span> paiements
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesPaiements;