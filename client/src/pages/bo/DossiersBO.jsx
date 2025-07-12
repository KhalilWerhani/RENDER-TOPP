import { useEffect, useState , useContext } from 'react';
import axios from 'axios';
import { FaFolderOpen, FaSearch, FaFilter, FaCalendarAlt, FaSpinner, FaChartBar } from "react-icons/fa";
import { RiFolderReceivedFill } from "react-icons/ri";
import { BsFolderCheck, BsFolderSymlink } from "react-icons/bs";
import { assets } from '../../assets/assets';
import { AppContent } from '../../context/AppContext';

const DossiersBO = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    statut: '',
    dateDebut: '',
    dateFin: '',
    search: ''
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
   const { backendUrl} = useContext(AppContent);
  const [stats, setStats] = useState({
    total: 0,
    enTraitement: 0,
    aTraiter: 0,
    traite: 0,
    creation: 0,
    modification: 0
  });

  useEffect(() => {
    fetchDossiers();
  }, [filters, pagination.page]);

  useEffect(() => {
    if (dossiers.length > 0) {
      calculateStats();
    }
  }, [dossiers]);

  const calculateStats = () => {
    const newStats = {
      total: dossiers.length,
      enTraitement: dossiers.filter(d => d.statut === 'en traitement').length,
      aTraiter: dossiers.filter(d => d.statut === 'a traité').length,
      traite: dossiers.filter(d => d.statut === 'traité').length,
      creation: dossiers.filter(d => d.type === 'création').length,
      modification: dossiers.filter(d => d.type === 'modification').length,
      fermeture: dossiers.filter(d => d.type === 'fermeture').length
    };
    setStats(newStats);
  };

  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      for (const key in filters) {
        if (filters[key]) params.append(key, filters[key]);
      }
      params.append("page", pagination.page);
      params.append("limit", 12);

      const res = await axios.get( `${backendUrl}/api/bo/dossiers?${params.toString()}`, {
        withCredentials: true
      });

      setDossiers(res.data.dossiers);
      if (res.data.pagination) {
        setPagination(prev => ({
          ...prev,
          pages: res.data.pagination.pages
        }));
      }
    } catch (err) {
      console.error("Erreur chargement dossiers BO :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      statut: '',
      dateDebut: '',
      dateFin: '',
      search: ''
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'en traitement':
        return <BsFolderSymlink className="text-blue-500" size={24} />;
      case 'à traiter':
        return <RiFolderReceivedFill className="text-orange-500" size={24} />;
      case 'traité':
        return <BsFolderCheck className="text-green-500" size={24} />;
      default:
        return <FaFolderOpen className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className='flex items-center gap-4'>
            <img
                        src={assets.illustrawcelebrate}
                        alt="Doc"
                        className="w-28 h-28 rounded-lg shadow-sm border-1 border-blue-100"
                      />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-montserrat">Tableau de Bord des Dossiers</h1>
            
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-300"
          >
            <FaFilter className="text-blue-500" />
            <span className="font-medium">Filtres Avancés</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Dossiers</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                <div className="flex space-x-4 mt-2 text-xs">
                  <span className="text-blue-600">Création: {stats.creation}</span>
                  <span className="text-purple-600">Modif: {stats.modification}</span>
                  <span className="text-red-600">Ferm: {stats.fermeture}</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaFolderOpen className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
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

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
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

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
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
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaFilter className="text-blue-500" />
            Filtres de Recherche
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de dossier</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tous les types</option>
                <option value="création">Création</option>
                <option value="modification">Modification</option>
                <option value="fermeture">Fermeture</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select 
                name="statut" 
                value={filters.statut} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tous les statuts</option>
                <option value="à traiter">À traiter</option>
                <option value="en traitement">En traitement</option>
                <option value="traité">Traité</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="dateDebut" 
                  value={filters.dateDebut} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="dateFin" 
                  value={filters.dateFin} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche par client</label>
            <div className="relative">
              <input 
                type="text" 
                name="search" 
                placeholder="Nom, email ou référence..." 
                value={filters.search} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button 
              onClick={resetFilters}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Réinitialiser
            </button>
            <button 
              onClick={() => {
                setIsFilterOpen(false);
                fetchDossiers();
              }}
              className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-md"
            >
              Appliquer les Filtres
            </button>
          </div>
        </div>

        {/* Dossiers Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
              <span className="ml-3 text-gray-600">Chargement des dossiers...</span>
            </div>
          ) : dossiers.length === 0 ? (
            <div className="text-center p-12">
              <FaFolderOpen className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Aucun dossier correspondant</h3>
              <p className="text-gray-500 mt-2">Essayez d'ajuster vos critères de recherche</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
                {dossiers.map((dossier, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-300 transform hover:-translate-y-1"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        {getStatusIcon(dossier.statut)}
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          dossier.statut === 'à traiter' ? 'bg-orange-100 text-orange-800' :
                          dossier.statut === 'en traitement' ? 'bg-blue-100 text-blue-800' :
                          dossier.statut === 'traité' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dossier.statut}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{dossier.user?.name || 'Non spécifié'}</h3>
                        <p className="text-sm text-gray-500 truncate">{dossier.user?.email || 'Email non disponible'}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-3">
                          <span className={`capitalize ${
                            dossier.type === 'création' ? 'text-blue-600' : 
                            dossier.type === 'modification' ? 'text-purple-600' : 
                            dossier.type === 'fermeture' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {dossier.type}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{new Date(dossier.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`/bo/dossiers/${dossier._id}?type=${dossier.type}`}
                      className="absolute inset-0"
                      title="Voir le dossier"
                    />
                    
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-mono">REF: {dossier._id.substring(0, 6)}</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Ouvrir →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                    Affichage des dossiers {((pagination.page - 1) * 12) + 1}-{Math.min(pagination.page * 12, stats.total)} sur {stats.total}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className={`px-4 py-2 rounded-lg border ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`px-4 py-2 rounded-lg border ${pagination.page === pageNum ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.pages}
                      className={`px-4 py-2 rounded-lg border ${pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DossiersBO;