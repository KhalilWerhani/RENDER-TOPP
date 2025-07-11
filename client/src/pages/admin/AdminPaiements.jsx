import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FiRefreshCw, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    paid: "bg-emerald-100 text-emerald-800",
    failed: "bg-rose-100 text-rose-800",
    pending: "bg-amber-100 text-amber-800",
    refunded: "bg-blue-100 text-blue-800"
  };

  const statusText = {
    paid: 'Réussi',
    failed: 'Échoué',
    pending: 'En attente',
    refunded: 'Remboursé'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusText[status] || status}
    </span>
  );
};

const PaymentMethodIcon = ({ method }) => {
  const icons = {
    card: '💳',
    paypal: '🔵',
    bank: '🏦',
    crypto: '₿'
  };

  return (
    <span className="flex items-center">
      <span className="mr-2 text-lg">{icons[method] || '💸'}</span>
      {method || 'Inconnue'}
    </span>
  );
};

const AdminPaiements = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
   const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/paiement/stripe-payments`, {
          withCredentials: true
        });
        const formattedPayments = res.data.paiements.map(payment => ({
          ...payment,
          amount: parseFloat(payment.montant)
        }));


        setPayments(formattedPayments);
        setFilteredPayments(formattedPayments);
      } catch (err) {
        console.error("Erreur chargement paiements :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let results = payments;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(payment =>
        payment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(payment => payment.statut === statusFilter);
    }

    setFilteredPayments(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, payments]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);

  const refreshPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/paiement/stripe-payments`, {
        withCredentials: true
      });
      const formattedPayments = res.data.paiements.map(payment => ({
        ...payment,
        date: format(new Date(payment.date), 'dd/MM/yyyy HH:mm'),
        amount: parseFloat(payment.montant)
      }));
      setPayments(formattedPayments);
      setFilteredPayments(formattedPayments);
    } catch (err) {
      console.error("Erreur chargement paiements :", err);
    } finally {
      setLoading(false);
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Historique des Paiements</h1>
          <p className="text-gray-500 mt-1">
            {filteredPayments.length} paiement{filteredPayments.length !== 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher client ou ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Réussi</option>
            <option value="failed">Échoué</option>
            <option value="pending">En attente</option>
            <option value="refunded">Remboursé</option>
          </select>

          <button
            onClick={refreshPayments}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date & Heure
                      <span className="ml-1">{getSortIndicator('date')}</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center">
                      Client
                      <span className="ml-1">{getSortIndicator('client')}</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('montant')}
                  >
                    <div className="flex items-center">
                      Montant
                      <span className="ml-1">{getSortIndicator('montant')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('statut')}
                  >
                    <div className="flex items-center">
                      Statut
                      <span className="ml-1">{getSortIndicator('statut')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{payment.client || "Anonyme"}</div>
                        <div className="text-xs text-gray-500">{payment.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.amount.toFixed(2)} {payment.devise || '€'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentMethodIcon method={payment.methode} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.statut} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Détails</button>
                        {payment.statut === 'paid' && (
                          <button className="text-rose-600 hover:text-rose-900">Rembourser</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredPayments.length)}
                    </span>{' '}
                    sur <span className="font-medium">{filteredPayments.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPaiements;