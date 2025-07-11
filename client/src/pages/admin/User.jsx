import { useEffect, useState, useContext } from 'react';
import { AppContent } from "../../context/AppContext";
import axios from 'axios';
import { FiTrash2, FiRefreshCw, FiSearch, FiUser } from 'react-icons/fi';
import { MdOutlineVerified, MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Folder } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const AdminUserList = () => {
  const { backendUrl } = useContext(AppContent);
  const [userList, setUserList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/user/all`, { withCredentials: true });
      const users = (res.data.users || []).filter((u) => u.role === 'user');
      setUserList(users);
      applyFilters(users, search, showVerifiedOnly);
    } catch (err) {
      setError("Erreur lors du chargement des clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce client ?")) return;
    try {
      await axios.delete(`${backendUrl}/api/user/delete/${id}`, { withCredentials: true });
      const updated = userList.filter((u) => u._id !== id);
      setUserList(updated);
      applyFilters(updated, search, showVerifiedOnly);
      toast.success("Client supprimé.");
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    applyFilters(userList, value, showVerifiedOnly);
  };

  const applyFilters = (list, searchTerm, verifiedOnly) => {
    const lower = searchTerm.toLowerCase();
    const filtered = list.filter((u) => {
      const match = u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower);
      const verified = !verifiedOnly || u.isAccountVerified === true;
      return match && verified;
    });
    setFilteredList(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters(userList, search, showVerifiedOnly);
  }, [showVerifiedOnly]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#f4d47c] to-[#f4d47c] rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl text-blue-800 font-bold mb-1">Gestion des Clients</h1>
              <p className="text-sm text-blue-700">
                {filteredList.length} {filteredList.length === 1 ? 'client trouvé' : 'clients trouvés'}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher client..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                />
              </div>

              <button
                onClick={fetchUsers}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                title="Rafraîchir"
              >
                <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Comptes vérifiés uniquement</span>
          </label>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-200 rounded w-48" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun client trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? "Essayez une autre recherche" : "Aucun client disponible pour le moment"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredList.map((user) => (
                <motion.div
                  key={user._id}
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
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        {user.name ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : "?"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => navigate(`/admin/user/${user._id}`)}
                            className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {user.name || "-"}
                          </h3>
                          {user.isAccountVerified && (
                            <MdOutlineVerified className="text-green-500 w-5 h-5" title="Compte vérifié" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MdOutlineEmail className="mr-1 text-gray-400" />
                            <span className="truncate max-w-xs">{user.email}</span>
                          </div>

                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MdOutlinePhone className="mr-1 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>

                        {user.state && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/admin/dossiers/${user._id}`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-colors"
                        title="Voir dossiers"
                      >
                        <Folder className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(user._id)}
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
      </div>
    </div>
  );
};

export default AdminUserList;
