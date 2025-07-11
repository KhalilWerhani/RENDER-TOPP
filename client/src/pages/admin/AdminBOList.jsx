import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiTrash2, FiRefreshCw, FiSearch, FiUser } from 'react-icons/fi';
import { MdOutlineVerified, MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import ModalAddBO from './ModalAddBO';

const AdminBOList = () => {
  const [boList, setBoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchBOs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/liste-bo', { withCredentials: true });
      const bos = res.data.data || [];
      setBoList(bos);
      applyFilters(bos, search);
    } catch (err) {
      setError("Erreur lors du chargement des collaborateurs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce collaborateur ?")) return;
    try {
      await axios.delete(`/api/admin/delete-bo/${id}`, { withCredentials: true });
      const updated = boList.filter((bo) => bo._id !== id);
      setBoList(updated);
      applyFilters(updated, search);
      toast.success("Collaborateur supprimé.");
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    applyFilters(boList, value);
  };

  const applyFilters = (list, searchTerm) => {
    const lower = searchTerm.toLowerCase();
    const filtered = list.filter((bo) =>
      bo.name?.toLowerCase().includes(lower) || bo.email?.toLowerCase().includes(lower)
    );
    setFilteredList(filtered);
  };

  useEffect(() => {
    fetchBOs();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header personnalisé */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#f4d47c] to-[#f4d47c] rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl text-blue-800 font-bold mb-1">Gestion des Collaborateurs</h1>
              <p className="text-sm text-blue-700">
                {filteredList.length} {filteredList.length === 1 ? 'collaborateur trouvé' : 'collaborateurs trouvés'}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                Ajouter un collaborateur
              </button>

              <div className="relative flex-1 md:w-64 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher collaborateur..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                />
              </div>

              <button
                onClick={fetchBOs}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                title="Rafraîchir"
              >
                <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun collaborateur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? "Essayez une autre recherche" : "Aucun collaborateur disponible pour le moment"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredList.map((bo) => (
                <motion.div
                  key={bo._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white cursor-pointer"
                        onClick={() => navigate(`/admin/bo/${bo._id}`)}
                      >
                        {bo.name ? bo.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : "?"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => navigate(`/admin/bo/${bo._id}`)}
                            className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {bo.name || "-"}
                          </h3>
                          {bo.isAccountVerified && (
                            <MdOutlineVerified className="text-green-500 w-5 h-5" title="Compte vérifié" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MdOutlineEmail className="mr-1 text-gray-400" />
                            <span className="truncate max-w-xs">{bo.email}</span>
                          </div>

                          {bo.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MdOutlinePhone className="mr-1 text-gray-400" />
                              <span>{bo.phone}</span>
                            </div>
                          )}
                        </div>

                        {bo.state && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {bo.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/admin/bo/${bo._id}/dossiers`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-colors"
                        title="Voir dossiers"
                      >
                        <Folder className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(bo._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {showModal && (
          <ModalAddBO
            onClose={() => setShowModal(false)}
            onAddSuccess={() => {
              fetchBOs();
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminBOList;
