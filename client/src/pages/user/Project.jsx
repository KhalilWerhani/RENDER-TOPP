import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  FiFile, FiUser, FiClock, FiCheckCircle, FiDollarSign,
  FiRefreshCw, FiSearch, FiFilter, FiChevronDown, FiChevronUp,
  FiDownload, FiEye, FiEdit, FiMoreVertical, FiCalendar , FiCreditCard 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import fileDownload from "js-file-download";

const statusConfig = {
  "en attente": {
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: <FiClock className="mr-1.5" />,
    label: "En Attente",
    bgColor: "bg-amber-500/80"
  },
  "payé": {
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: <FiDollarSign className="mr-1.5" />,
    label: "Payé",
    bgColor: "bg-emerald-500/80"
  },
  "a traité": {
    color: "bg-gray-50 text-gray-800 border-gray-200",
    icon: <FiFile className="mr-1.5" />,
    label: "À Traiter",
    bgColor: "bg-gray-500/80"
  },
  "en traitement": {
    color: "bg-blue-50 text-blue-800 border-blue-200",
    icon: <FiRefreshCw className="mr-1.5 animate-spin" />,
    label: "En Traitement",
    bgColor: "bg-blue-500/80"
  },
  "traité": {
    color: "bg-purple-50 text-purple-800 border-purple-200",
    icon: <FiCheckCircle className="mr-1.5" />,
    label: "Traité",
    bgColor: "bg-purple-500/80"
  }
};

const typeColors = {
  "SAS": "bg-indigo-100 text-indigo-800",
  "SASU": "bg-indigo-100 text-indigo-800",
  "SARL": "bg-blue-100 text-blue-800",
  "EURL": "bg-blue-100 text-blue-800",
  "SCI": "bg-teal-100 text-teal-800",
  "AUTO-ENTREPRENEUR": "bg-amber-100 text-amber-800",
  "Entreprise individuelle": "bg-amber-100 text-amber-800",
  "Association": "bg-rose-100 text-rose-800",
  "TRANSFERT_SIEGE": "bg-violet-100 text-violet-800",
  "CHANGEMENT_DENOMINATION": "bg-fuchsia-100 text-fuchsia-800",
  "CHANGEMENT_PRESIDENT": "bg-pink-100 text-pink-800",
  "CHANGEMENT_ACTIVITE": "bg-cyan-100 text-cyan-800",
  "TRANSFORMATION_SARL_EN_SAS": "bg-sky-100 text-sky-800",
  "TRANSFORMATION_SAS_EN_SARL": "bg-sky-100 text-sky-800",
  // Fermeture dossier types
  "DISSOLUTION_LIQUIDATION": "bg-red-100 text-red-800",
  "MISE_EN_SOMMEIL": "bg-orange-100 text-orange-800",
  "Radiation auto-entrepreneur": "bg-yellow-100 text-yellow-800",
  "Dépôt de bilan": "bg-purple-100 text-purple-800",
  "Dépôt de marque": "bg-green-100 text-green-800",
  // Generic fallback
  "FERMETURE": "bg-gray-100 text-gray-800"
};
const typeDisplayNames = {
  "DISSOLUTION_LIQUIDATION": "Dissolution & Liquidation",
  "MISE_EN_SOMMEIL": "Mise en sommeil",
  "Radiation auto-entrepreneur": "Radiation auto-entrepreneur",
  "Dépôt de bilan": "Dépôt de bilan",
  "Dépôt de marque": "Dépôt de marque"
};

const Project = () => {
  const { backendUrl , userData } = useContext(AppContent);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDossier, setExpandedDossier] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const fileInputsRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDossiers = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/dossier/user/all`, { withCredentials: true });
       setDossiers(Array.isArray(data.dossiers) ? data.dossiers : []);
      } catch (err) {
        toast.error("Erreur lors du chargement des projets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const filteredDossiers = (Array.isArray(dossiers) ? dossiers : []).filter(dossier => {
  const matchesStatus = selectedStatus === "all" || dossier.statut === selectedStatus;

  const dossierType = dossier.type ? dossier.type.toLowerCase() : '';
  const boName = dossier.boAffecte?.name ? dossier.boAffecte.name.toLowerCase() : '';
  const searchTermLower = searchTerm.toLowerCase();

  const matchesSearch = dossierType.includes(searchTermLower) ||
                        boName.includes(searchTermLower);

  return matchesStatus && matchesSearch;
});

    fetchAllDossiers();
  }, [backendUrl]);

  const handleFileUpload = async (dossier, files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("documents", file);
    }

    formData.append("username", dossier.user?.name || "client");
    formData.append("title", "ajout_document");

    let url;
    if (dossier.isModification) {
      url = `${backendUrl}/api/modification/upload-documents/${dossier._id}`;
    } else if (dossier.isFermeture) {
      url = `${backendUrl}/api/fermeturedossier/upload-documents/${dossier._id}`;
    } else {
      url = `${backendUrl}/api/dossier/upload-documents/${dossier._id}`;
    }

    try {
      const res = await axios.put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Document(s) ajouté(s) avec succès");
      setDossiers((prev) =>
        prev.map((d) =>
          d._id === dossier._id ? { ...d, pieces: res.data.dossier?.fichiers || res.data.modification?.fichiers || res.data.fermeturedossier?.fichiers } : d
        )
      );
    } catch (err) {
      console.error("Erreur upload :", err);
      toast.error("Erreur lors de l'envoi du document");
    }
  };

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesStatus = selectedStatus === "all" || dossier.statut === selectedStatus;
    
    // Safely handle dossier.type and boAffecte.name
    const dossierType = dossier.type ? dossier.type.toLowerCase() : '';
    const boName = dossier.boAffecte?.name ? dossier.boAffecte.name.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = dossierType.includes(searchTermLower) || 
                         boName.includes(searchTermLower);
    
    return matchesStatus && matchesSearch;
  });

  const sortedDossiers = [...filteredDossiers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleExpandDossier = (id) => {
    setExpandedDossier(expandedDossier === id ? null : id);
  };

 const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob"
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };


  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Enhanced Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-lg p-6 text-white"
        >
          <div className="mb-6">
            <h1 className="text-3xl text-gray-800 font-bold mb-2">Gestion des Dossiers</h1>
            <p className="text-gray-500">Suivez l'avancement de tous vos dossiers en temps réel</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/700 backdrop-blur-sm rounded-lg p-4 border border-black">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-500 mr-3">
                  <FiFile className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Total</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {dossiers.length}
                  </p>
                </div>
              </div>
            </div>

            {Object.entries(statusConfig).map(([key, { label, bgColor, icon }]) => (
              <div key={key} className={`${bgColor} backdrop-blur-sm rounded-lg p-4 border border-white/90`}>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-white/20 mr-3">
                    {React.cloneElement(icon, { className: "text-white" })}
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{label}</p>
                    <p className="text-xl font-semibold text-white">
                      {dossiers.filter(d => d.statut === key).length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Improved Filters Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par type, BO..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <FiFilter className="text-gray-500" />
                <select
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-700"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  {Object.keys(statusConfig).map((key) => (
                    <option key={key} value={key}>{statusConfig[key].label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dossiers List */}
        <div className="space-y-4">
          {sortedDossiers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
            >
              <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiFile className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Aucun dossier trouvé</h3>
              <p className="text-gray-500">Essayez d'ajuster vos filtres de recherche</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {sortedDossiers.map((dossier) => (
                <motion.div
                  key={dossier._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${statusConfig[dossier.statut]?.color.replace('bg', 'border')} border border-gray-100`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColors[dossier.type] || 'bg-gray-100 text-gray-800'}`}>
                            {dossier.type}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[dossier.statut.toLowerCase()]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig[dossier.statut.toLowerCase()]?.icon}
                            {statusConfig[dossier.statut.toLowerCase()]?.label || dossier.statut}
                          </span>
                          {dossier.boAffecte?.name && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              <FiUser className="mr-1.5" />
                              {dossier.boAffecte.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
  {dossier.isModification ? "Modification" : 
   dossier.isFermeture ? (typeDisplayNames[dossier.type] || "Fermeture") : 
   "Création d'entreprise"}
</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="text-gray-400 mr-2 flex-shrink-0" />
                            <span>
                              Créé le {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <FiFile className="text-gray-400 mr-2 flex-shrink-0" />
                            <span>
                              {dossier.fichiers?.length || 0} pièce(s) jointe(s)
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${statusConfig[dossier.statut]?.color.replace('bg', 'bg').split(' ')[0]}`}
                                style={{
                                  width: `${(dossier.etatAvancement === 'formulaire' ? 20 :
                                    dossier.etatAvancement === 'paiement' ? 40 :
                                      dossier.etatAvancement === 'documents' ? 60 :
                                        dossier.etatAvancement === 'traitement' ? 80 : 100)}%`
                                }}
                              />
                            </div>
                            <span className="ml-2 text-xs font-medium">
                              {dossier.etatAvancement || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleExpandDossier(dossier._id)}
                          className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-50 transition-colors"
                        >
                          {expandedDossier === dossier._id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                          Actions
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedDossier === dossier._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 overflow-hidden"
                      >
                        <div className="p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-3">Détails du dossier: {dossier.codeDossier}</h4>
                              <div className="space-y-3">
                                <div className="flex">
                                  <span className="text-gray-500 w-32 flex-shrink-0">Type:</span>
                                  <span className="text-gray-800 font-medium">{dossier.type}</span>
                                </div>
                                <div className="flex">
                                  <span className="text-gray-500 w-32 flex-shrink-0">Statut:</span>
                                  <span className={`text-sm font-medium ${statusConfig[dossier.statut]?.color.split(' ')[2]}`}>
                                    {statusConfig[dossier.statut]?.label || dossier.statut}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="text-gray-500 w-32 flex-shrink-0">BO Affecté:</span>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    <FiUser className="mr-1.5" />
                                    {dossier.boAffecte?.name
                                      ? `${dossier.boAffecte.name} (${dossier.boAffecte.email})`
                                      : "Non affecté"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="text-gray-500 w-32 flex-shrink-0">Date création:</span>
                                  <span className="text-gray-800">
                                    {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-3">Pièces jointes</h4>
                              {dossier.fichiers?.length > 0 ? (
                                <div className="space-y-2">
                                  {dossier.fichiers.map((piece, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                      <div className="flex items-center">
                                        <FiFile className="text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-700 truncate max-w-xs">{piece.filename}</span>
                                      </div>
                                      <a
                                        href={piece.url}
                                        download={piece.filename}
                                        target="_blank"
                                        title="Télécharger"
                                        className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
                                      >
                                        <FiDownload size={16} />
                                      </a>

                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">Aucune pièce jointe</p>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                            <button
                              disabled={["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)}
                              onClick={() => {
                                if (!["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)) {
                                  if (dossier.isModification) {
                                    navigate(`/paiement?modificationId=${dossier._id}`, { state: { dossier } });
                                  } else if (dossier.isFermeture) {
                                    navigate(`/paiement-fermeture/${dossier._id}`, { state: { dossier } }); // Changed to navigate to paiement-fermeture
                                  } else {
                                    navigate(`/paiement?dossierId=${dossier._id}`, { state: { dossier } });
                                  }
                                }
                              }}
                              className={`px-4 py-2 border rounded-lg flex items-center transition-colors 
                                ${["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)
                                  ? "border-gray-300 text-gray-900 bg-gray-200 cursor-not-allowed"
                                  : "border-gray-300 text-gray-900 hover:bg-gray-50"}`}
                            >
                              <FiCreditCard  className="mr-2" /> Payé
                    
                            </button>
                            <input
                              type="file"
                              multiple
                              hidden
                              ref={(ref) => (fileInputsRef.current[dossier._id] = ref)}
                              onChange={(e) => handleFileUpload(dossier, e.target.files)}
                            />
                            <button
                              disabled={dossier.statut === 'en attente'}
                              onClick={() => {
                                if (dossier.statut !== 'en attente') {
                                  let type;
                                  if (dossier.isModification) {
                                    type = 'modification';
                                  } else if (dossier.isFermeture) {
                                    type = 'fermeture';
                                  } else {
                                    type = 'dossier';
                                  }
                                  navigate(`/form-entreprise/${dossier._id}?type=${type}`);
                                }
                              }}
                              className={`px-4 py-2 border text-sm rounded-lg flex items-center transition-colors
                                ${dossier.statut === 'en attente'
                                  ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                              <FiEdit className="mr-2" /> Ajouter des documents
                            </button>

                            <button className="px-4 py-2 bg-primary text-gray-800 rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex items-center">
                              <FiEye className="mr-2" /> Voir
                              
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;