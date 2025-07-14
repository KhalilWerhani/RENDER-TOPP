import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  FiFile, FiUser, FiClock, FiCheckCircle, FiDollarSign,
  FiRefreshCw, FiSearch, FiFilter, FiChevronDown, FiChevronUp,
  FiDownload, FiEye, FiEdit, FiMoreVertical, FiCalendar, FiCreditCard,
  FiPlus, FiX
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
  "DISSOLUTION_LIQUIDATION": "bg-red-100 text-red-800",
  "MISE_EN_SOMMEIL": "bg-orange-100 text-orange-800",
  "Radiation auto-entrepreneur": "bg-yellow-100 text-yellow-800",
  "Dépôt de bilan": "bg-purple-100 text-purple-800",
  "Dépôt de marque": "bg-green-100 text-green-800",
  "FERMETURE": "bg-gray-100 text-gray-800"
};

const typeDisplayNames = {
  "DISSOLUTION_LIQUIDATION": "Dissolution & Liquidation",
  "MISE_EN_SOMMEIL": "Mise en sommeil",
  "Radiation auto-entrepreneur": "Radiation auto-entrepreneur",
  "Dépôt de bilan": "Dépôt de bilan",
  "Dépôt de marque": "Dépôt de marque"
};

// Document preview component
const DocumentPreview = ({ documents, title, countColor = "bg-gray-100 text-gray-800", maxVisible = 3 }) => {
  const [showAll, setShowAll] = useState(false);

  if (!documents || documents.length === 0) {
    return <p className="text-gray-500 text-sm">Aucun document</p>;
  }

  const visibleDocs = showAll ? documents : documents.slice(0, maxVisible);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-500 flex items-center">
          {title}
          <span className={`ml-2 ${countColor} text-xs px-2 py-0.5 rounded-full`}>
            {documents.length}
          </span>
        </h4>
        {documents.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:underline"
          >
            {showAll ? 'Voir moins' : 'Voir tout'}
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {visibleDocs.map((doc, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center min-w-0">
              <FiFile className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {doc.filename || doc.titre}
              </span>
            </div>
            <div className="flex items-center space-x-2 ml-2">
              {doc.createdAt && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                </span>
              )}
              <a
                href={doc.url || doc.fichier}
                download={doc.filename || doc.titre}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
                title="Télécharger"
              >
                <FiDownload size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Project = () => {
  const { backendUrl, userData } = useContext(AppContent);
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
    const dossierType = dossier.type ? dossier.type.toLowerCase() : '';
    const boName = dossier.boAffecte?.name ? dossier.boAffecte.name.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return matchesStatus && (
      dossierType.includes(searchTermLower) || 
      boName.includes(searchTermLower)
    );
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
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleExpandDossier = (id) => {
    setExpandedDossier(prev => prev === id ? null : id);
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Gestion des Dossiers</h1>
            <p className="text-gray-500">Suivez l'avancement de vos dossiers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-500 mr-3">
                  <FiFile className="text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-800">
                    {dossiers.length}
                  </p>
                </div>
              </div>
            </div>

            {Object.entries(statusConfig).map(([key, { label, bgColor, icon }]) => (
              <div key={key} className={`${bgColor} rounded-lg p-3 border border-gray-200`}>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-white/20 mr-3">
                    {React.cloneElement(icon, { className: "text-white" })}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-700">{label}</p>
                    <p className="text-lg md:text-xl font-semibold text-gray-800">
                      {dossiers.filter(d => d.statut === key).length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par type, BO..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
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
        <div className="space-y-3">
          {sortedDossiers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
            >
              <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiFile className="text-gray-400 text-2xl" />
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
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[dossier.type] || 'bg-gray-100 text-gray-800'}`}>
                            {dossier.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[dossier.statut.toLowerCase()]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig[dossier.statut.toLowerCase()]?.icon}
                            {statusConfig[dossier.statut.toLowerCase()]?.label || dossier.statut}
                          </span>
                          {dossier.boAffecte?.name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              <FiUser className="mr-1" size={12} />
                              {dossier.boAffecte.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                          {dossier.isModification ? "Modification" : 
                           dossier.isFermeture ? (typeDisplayNames[dossier.type] || "Fermeture") : 
                           "Création d'entreprise"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiCalendar className="text-gray-400 mr-2 flex-shrink-0" size={14} />
                            <span>
                              {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 text-sm">
                            <FiFile className="text-gray-400 mr-2 flex-shrink-0" size={14} />
                            <span>
                              {dossier.fichiers?.length || 0} fichiers • {dossier.fichiersbo?.length || 0} BO
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 text-sm">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${statusConfig[dossier.statut]?.color.replace('bg', 'bg').split(' ')[0]}`}
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

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpandDossier(dossier._id)}
                          className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-50 transition-colors"
                        >
                          {expandedDossier === dossier._id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <button 
                          onClick={() => {
                            if (dossier.isModification) {
                              navigate(`/modification/${dossier._id}`);
                            } else if (dossier.isFermeture) {
                              navigate(`/fermeture/${dossier._id}`);
                            } else {
                              navigate(`/dossier/${dossier._id}`);
                            }
                          }}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm"
                        >
                          Voir
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
                        <div className="p-4 md:p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Détails du dossier</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex">
                                    <span className="text-gray-500 w-24 flex-shrink-0">Type:</span>
                                    <span className="text-gray-800 font-medium">{dossier.type}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-24 flex-shrink-0">Statut:</span>
                                    <span className={`font-medium ${statusConfig[dossier.statut]?.color.split(' ')[2]}`}>
                                      {statusConfig[dossier.statut]?.label || dossier.statut}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-24 flex-shrink-0">BO Affecté:</span>
                                    <span className="text-gray-800">
                                      {dossier.boAffecte?.name || "Non affecté"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-24 flex-shrink-0">Code:</span>
                                    <span className="text-gray-800 font-mono">{dossier.codeDossier}</span>
                                  </div>
                                </div>
                              </div>

                              <DocumentPreview 
                                documents={dossier.fichiers || []} 
                                title="Vos documents" 
                                countColor="bg-gray-100 text-gray-800"
                              />
                            </div>

                            <div className="space-y-4">
                              <DocumentPreview 
                                documents={dossier.fichiersbo || []} 
                                title="Documents du BO" 
                                countColor="bg-blue-100 text-blue-800"
                              />

                              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                                <button
                                  disabled={["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)}
                                  onClick={() => {
                                    if (!["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)) {
                                      if (dossier.isModification) {
                                        navigate(`/paiement?modificationId=${dossier._id}`, { state: { dossier } });
                                      } else if (dossier.isFermeture) {
                                        navigate(`/paiement-fermeture/${dossier._id}`, { state: { dossier } });
                                      } else {
                                        navigate(`/paiement?dossierId=${dossier._id}`, { state: { dossier } });
                                      }
                                    }
                                  }}
                                  className={`px-3 py-1.5 border rounded-lg flex items-center text-sm transition-colors 
                                    ${["payé", "a traité", "en traitement", "traité"].includes(dossier.statut)
                                      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                >
                                  <FiCreditCard className="mr-1.5" size={14} /> Paiement
                                </button>

                                <input
                                  type="file"
                                  multiple
                                  hidden
                                  ref={(ref) => (fileInputsRef.current[dossier._id] = ref)}
                                  onChange={(e) => handleFileUpload(dossier, e.target.files)}
                                />
                               <button
  onClick={() => fileInputsRef.current[dossier._id]?.click()}
  disabled={["traité", "en attente"].includes(dossier.statut)}
  className={`px-3 py-1.5 border rounded-lg flex items-center text-sm transition-colors 
    ${["traité", "en attente"].includes(dossier.statut)
      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
      : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
>
  <FiPlus className="mr-1.5" size={14} /> Ajouter fichier
</button>

                                <button
                                  onClick={() => {
                                    if (dossier.isModification) {
                                      navigate(`/modification/${dossier._id}`);
                                    } else if (dossier.isFermeture) {
                                      navigate(`/fermeture/${dossier._id}`);
                                    } else {
                                      navigate(`/dossier/${dossier._id}`);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex items-center text-sm"
                                >
                                  <FiEye className="mr-1.5" size={14} /> Détails
                                </button>
                              </div>
                            </div>
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