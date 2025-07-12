import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState , useContext } from "react";
import axios from "axios";
import {
  FaFolderOpen,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { RiFolderReceivedFill } from "react-icons/ri";
import { BsFolderCheck, BsFolderSymlink } from "react-icons/bs";
import { assets } from "../../assets/assets";

const ListeProjetsBo = () => {
  const { boId } = useParams();
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
     const { backendUrl } = useContext(AppContent);

  const [filters, setFilters] = useState({
    type: "",
    statut: "",
    dateDebut: "",
    dateFin: "",
    search: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [stats, setStats] = useState({
    total: 0,
    enTraitement: 0,
    aTraiter: 0,
    traite: 0,
    creation: 0,
    modification: 0,
    fermeture: 0,
  });

  useEffect(() => {
    fetchProjets();
  }, [boId]);

  useEffect(() => {
    if (projets.length > 0) {
      calculateStats();
    }
  }, [projets]);

  const calculateStats = () => {
  const newStats = {
    total: projets.length,
    enTraitement: projets.filter(
      (p) => p.statut && (p.statut.toLowerCase() === "en cours" || p.statut.toLowerCase() === "en traitement" || p.statut.toLowerCase() === "en_traitement")
    ).length,
    aTraiter: projets.filter(
      (p) => p.statut && (p.statut.toLowerCase() === "en attente" || p.statut.toLowerCase() === "a traité" || p.statut.toLowerCase() === "a_traiter")
    ).length,
    traite: projets.filter(
      (p) => p.statut && (p.statut.toLowerCase() === "terminé" || p.statut.toLowerCase() === "traité" || p.statut.toLowerCase() === "termine" || p.statut.toLowerCase() === "traite")
    ).length,
    creation: projets.filter((p) => p.type === "Création" || p.type === "Creation").length,
    modification: projets.filter((p) => p.type === "Modification").length,
    fermeture: projets.filter((p) => p.type === "Fermeture").length,
  };
  setStats(newStats);
};

  const fetchProjets = async () => {
    try {
      setLoading(true);
      console.log("Fetching projects for BO ID:", boId);
      const res = await axios.get(`${backendUrl}/api/admin/dossiers/bo/${boId}`, {
        withCredentials: true,
      });
      console.log("API Response:", res.data);
      setProjets(res.data.projets || []);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'ascending' 
      ? <FaSortUp className="text-blue-500" /> 
      : <FaSortDown className="text-blue-500" />;
  };

  const sortedProjets = [...projets].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const projetsFiltres = sortedProjets.filter((p) => {
  // Filter by status - make sure these match your actual data
  const statutMatch =
    !filters.statut ||
    (filters.statut === "en traitement" && 
      (p.statut?.toLowerCase() === "en cours" || p.statut?.toLowerCase() === "en traitement")) ||
    (filters.statut === "à traiter" && 
      (p.statut?.toLowerCase() === "en attente" || p.statut?.toLowerCase() === "à traiter")) ||
    (filters.statut === "traité" && 
      (p.statut?.toLowerCase() === "terminé" || p.statut?.toLowerCase() === "traité"));

  // Filter by type
  const typeMatch = !filters.type || p.type === filters.type;

  // Filter by date range
  const dateMatch =
    (!filters.dateDebut || new Date(p.createdAt) >= new Date(filters.dateDebut)) &&
    (!filters.dateFin || new Date(p.createdAt) <= new Date(filters.dateFin));

  // Filter by search term (client name, email, or reference)
  const searchMatch =
    !filters.search ||
    (p.client && p.client.toLowerCase().includes(filters.search.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(filters.search.toLowerCase())) ||
    (p.id && p.id.toLowerCase().includes(filters.search.toLowerCase()));

  return statutMatch && typeMatch && dateMatch && searchMatch;
});

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      statut: "",
      dateDebut: "",
      dateFin: "",
      search: "",
    });
  };

  const getStatusBadge = (statut) => {
  if (!statut) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inconnu</span>;
  
  const lowerStatut = statut.toLowerCase();
  switch (lowerStatut) {
    case "en cours":
    case "en traitement": // Adding alternative status name
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">En traitement</span>;
    case "terminé":
    case "traité": // Adding alternative status name
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Traité</span>;
    case "en attente":
    case "à traiter": // Adding alternative status name
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">À traiter</span>;
    default:
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{statut}</span>;
  }
};

  const getTypeBadge = (type) => {
    switch (type) {
      case "Création":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Création</span>;
      case "Modification":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Modification</span>;
      case "Fermeture":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Fermeture</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4">
            <img
              src={assets.illustrawcelebrate}
              alt="Doc"
              className="w-20 h-20 rounded-lg shadow-sm border border-blue-100"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-montserrat">
                Dossiers du collaborateur
              </h1>
              <p className="text-gray-500 mt-1">
                Gestion et suivi des dossiers clients
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-blue-300"
          >
            <FaFilter className="text-blue-500" />
            <span className="font-medium">Filtres Avancés</span>
          </button>
        </div>

        {/* Stats Cards */}
        
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  <div 
    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    onClick={() => resetFilters()}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">Total Dossiers</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        <div className="flex space-x-4 mt-2 text-xs">
          <span 
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setFilters({...filters, type: "Création"});
            }}
          >
            Création: {stats.creation}
          </span>
          <span 
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setFilters({...filters, type: "Modification"});
            }}
          >
            Modif: {stats.modification}
          </span>
          <span 
            className="text-red-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setFilters({...filters, type: "Fermeture"});
            }}
          >
            Ferm: {stats.fermeture}
          </span>
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <FaFolderOpen className="text-blue-500" size={20} />
      </div>
    </div>
  </div>

  <div 
    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    onClick={() => setFilters({...filters, statut: "à traiter"})}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">À Traiter</p>
        <p className="text-2xl font-bold text-orange-500 mt-1">{stats.aTraiter}</p>
      </div>
      <div className="p-3 bg-orange-50 rounded-lg">
        <RiFolderReceivedFill className="text-orange-500" size={20} />
      </div>
    </div>
  </div>

  <div 
    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    onClick={() => setFilters({...filters, statut: "en traitement"})}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">En Traitement</p>
        <p className="text-2xl font-bold text-blue-500 mt-1">{stats.enTraitement}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <BsFolderSymlink className="text-blue-500" size={20} />
      </div>
    </div>
  </div>

  <div 
    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    onClick={() => setFilters({...filters, statut: "traité"})}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">Traités</p>
        <p className="text-2xl font-bold text-green-500 mt-1">{stats.traite}</p>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <BsFolderCheck className="text-green-500" size={20} />
      </div>
    </div>
  </div>
</div>

        {/* Filtres Section */}
        <div
          className={`bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 ${
            isFilterOpen ? "block" : "hidden"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaFilter className="text-blue-500" />
            Filtres de Recherche
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de dossier
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tous les types</option>
                <option value="Création">Création</option>
                <option value="Modification">Modification</option>
                <option value="Fermeture">Fermeture</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="statut"
                value={filters.statut}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tous les statuts</option>
                <option value="à traiter">À traiter</option>
                <option value="en traitement">En traitement</option>
                <option value="traité">Traité</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateDebut"
                  value={filters.dateDebut}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateFin"
                  value={filters.dateFin}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche par client, email ou référence
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Appliquer les Filtres
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
              <span className="ml-3 text-gray-600">Chargement des dossiers...</span>
            </div>
          ) : projetsFiltres.length === 0 ? (
            <div className="text-center p-12">
              <FaFolderOpen className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                Aucun dossier correspondant aux critères
              </h3>
              <p className="text-gray-500 mt-2">
                Essayez de modifier vos filtres de recherche
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center">
                        Référence
                        {getSortIcon('id')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {getSortIcon('type')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('statut')}
                    >
                      <div className="flex items-center">
                        Statut
                        {getSortIcon('statut')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('client')}
                    >
                      <div className="flex items-center">
                        Client
                        {getSortIcon('client')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date création
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projetsFiltres.map((projet) => (
                    <tr 
                      key={projet.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/dossier/${projet.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {projet.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(projet.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(projet.statut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          {projet.client}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          {projet.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(projet.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/dossier/${projet.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeProjetsBo;