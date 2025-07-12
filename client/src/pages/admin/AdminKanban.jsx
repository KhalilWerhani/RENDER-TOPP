import React, { useEffect, useState , useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiEdit,
  FiCheckCircle,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCreditCard,
  FiInbox,
  FiSettings,
  FiCheck,
  FiPlus,
  FiUser,
  FiDownload,
  FiPrinter
} from "react-icons/fi";

// Enhanced status config with refined color palette
const statusConfig = {
  a_traité: {
    label: "À traiter",
    icon: <FiInbox className="text-blue-500" />,
    color: "bg-blue-50",
    border: "border-blue-100",
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    progression: 10 // Added progression percentage
  },
  en_traitement: {
    label: "En traitement",
    icon: <FiSettings className="text-amber-500" />,
    color: "bg-amber-50",
    border: "border-amber-100",
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    progression: 50 // Added progression percentage
  },
  traité: {
    label: "Traité",
    icon: <FiCheck className="text-emerald-500" />,
    color: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    progression: 100 // Added progression percentage
  }
};

const dossierTypes = [
  { id: "creation", label: "Création", icon: <FiCalendar className="mr-1" /> },
  { id: "modification", label: "Modification", icon: <FiEdit className="mr-1" /> },
  { id: "fermeture", label: "Fermeture", icon: <FiCheckCircle className="mr-1" /> }
];

const dateFilters = [
  { id: "all", label: "Tous" },
  { id: "today", label: "Aujourd'hui" },
  { id: "week", label: "Cette semaine" },
  { id: "month", label: "Ce mois" }
];

const TableView = ({ dossiers, status }) => {
  const config = statusConfig[status];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={config.bg}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Code dossier
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Progression
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dossiers.map((dossier) => (
            <tr key={dossier.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href={`/admin/dossier/${dossier.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {dossier.codeDossier || 'N/A'}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${config.bg} ${config.accent}`}>
                    {config.icon}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{dossier.client}</div>
                    <div className="text-sm text-gray-500">{dossier.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dossier.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-full mr-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${config.progression}%`,
                          backgroundColor: config.accent.replace('text-', '')
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{config.progression}%</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href={`/admin/dossier/${dossier.id}`}
                  className={`${config.accent} hover:text-${config.accent.replace('text-', '')}-700 mr-3`}
                >
                  Voir
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <FiDownload className="inline" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminKanban = () => {
  const [dossiers, setDossiers] = useState({
    a_traité: [],
    en_traitement: [],
    traité: []
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' or 'table'
   const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/admin/kanban`);
        const allDossiers = res.data.projets || [];

        const groups = {
          a_traité: [],
          en_traitement: [],
          traité: []
        };

        allDossiers.forEach(d => {
          const statusKey = d.statut?.replace(/\s/g, "_") || "a_traité";
          if (groups[statusKey]) {
            // Set progression based on status
            const dossierWithProgression = {
              ...d,
              avancement: statusConfig[statusKey]?.progression || 0
            };
            groups[statusKey].push(dossierWithProgression);
          } else {
            groups["a_traité"].push({
              ...d,
              avancement: statusConfig["a_traité"].progression
            });
          }
        });

        setDossiers(groups);
      } catch (error) {
        console.error("Error loading dossiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  const filterDossiers = (status) => {
    return dossiers[status]
      .filter(dossier => {
        const matchesSearch =
          dossier.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dossier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dossier.type?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          !selectedType || dossier.type?.toLowerCase() === selectedType.toLowerCase();

        const now = new Date();
        const dossierDate = new Date(dossier.createdAt);

        const matchesDate =
          dateFilter === "all" ||
          (dateFilter === "today" && dossierDate.toDateString() === now.toDateString()) ||
          (dateFilter === "week" && dossierDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
          (dateFilter === "month" && dossierDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

        return matchesSearch && matchesType && matchesDate;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // tri décroissant par date
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Dossiers</h1>
            <p className="text-sm text-gray-500">Tableau de bord administratif</p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === "kanban" ? "table" : "kanban")}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {viewMode === "kanban" ? "Vue Tableau" : "Vue Kanban"}
            </button>
            <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              <FiPlus className="mr-2" />
              Nouveau Dossier
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher clients, emails, types..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <FiFilter className="mr-2" />
                Filtres
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50">
                <FiDownload className="mr-2" />
                Exporter
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50">
                <FiPrinter className="mr-2" />
                Imprimer
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de dossier</label>
                    <div className="flex flex-wrap gap-2">
                      {dossierTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(selectedType === type.id ? "" : type.id)}
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${selectedType === type.id
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                          {type.icon}
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par date</label>
                    <div className="flex flex-wrap gap-2">
                      {dateFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setDateFilter(filter.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${dateFilter === filter.id
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : viewMode === "kanban" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.keys(statusConfig).map((status) => (
              <div key={status} className="lg:col-span-1">
                <div className={`rounded-xl p-5 ${statusConfig[status].color} ${statusConfig[status].border} mb-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${statusConfig[status].bg} mr-3`}>
                        {statusConfig[status].icon}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">{statusConfig[status].label}</h2>
                    </div>
                    <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200">
                      {filterDossiers(status).length} {filterDossiers(status).length === 1 ? 'dossier' : 'dossiers'}
                    </span>
                  </div>

                  {filterDossiers(status).length > 0 ? (
                    <div className="space-y-4">
                      {filterDossiers(status).map(dossier => (
                        <motion.div
                          key={dossier.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs font-mono text-gray-500 mb-1">#{dossier.codeDossier || 'N/A'}</p>
                                <h3 className="font-medium text-gray-900">{dossier.client}</h3>
                                <p className="text-sm text-gray-500 mt-1">{dossier.type}</p>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[status].bg} ${statusConfig[status].accent}`}>
                                {statusConfig[status].progression}%
                              </span>
                            </div>

                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progression</span>
                                <span>{statusConfig[status].progression}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    backgroundColor: statusConfig[status].accent.replace('text-', ''),
                                    width: `${statusConfig[status].progression}%`
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center">
                                <FiCalendar className="mr-1" />
                                <span>{new Date(dossier.createdAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <a
                                href={`/admin/dossier/${dossier.id}`}
                                className={`${statusConfig[status].accent} hover:underline`}
                              >
                                Voir le dossier
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                        <FiInbox className="text-gray-400" size={20} />
                      </div>
                      <p className="text-gray-500">Aucun dossier</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(statusConfig).map((status) => {
              const filteredDossiers = filterDossiers(status);
              if (filteredDossiers.length === 0) return null;

              return (
                <div key={status}>
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${statusConfig[status].bg} mr-3`}>
                      {statusConfig[status].icon}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{statusConfig[status].label}</h2>
                    <span className="ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full bg-gray-100">
                      {filteredDossiers.length}
                    </span>
                  </div>
                  <TableView dossiers={filteredDossiers} status={status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKanban;