import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Folder, ChevronRight, Clock, CheckCircle, AlertCircle, Loader2, Search } from "lucide-react";
import { AppContent } from "../../context/AppContext";
const ListeProjetsClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [selectedType, setSelectedType] = useState("Création");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/admin/dossiers/${clientId}`, {
          withCredentials: true,
        });
        setProjets(res.data.projets);
      } catch (error) {
        console.error("Erreur chargement projets client :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, [clientId]);

  const filteredProjects = projets.filter(p => 
    p.type === selectedType &&
    (p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.sousType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatSousType = (valeur) => {
    if (!valeur) return "-";
    const dictionnaire = {
      TRANSFERT_SIEGE: "Transfert de siège social",
      CHANGEMENT_DENOMINATION: "Changement de dénomination",
      CHANGEMENT_PRESIDENT: "Changement de président",
      CHANGEMENT_ACTIVITE: "Changement d'activité",
      TRANSFORMATION_SARL_EN_SAS: "Transformation SARL → SAS",
      TRANSFORMATION_SAS_EN_SARL: "Transformation SAS → SARL",
      "AUTO-ENTREPRENEUR": "Auto-entrepreneur",
      "Entreprise individuelle": "Entreprise individuelle"
    };
    return dictionnaire[valeur] || (
      valeur
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/^\w/, c => c.toUpperCase())
    );
  };

  const getStatusColor = (statut) => {
    switch(statut.toLowerCase()) {
      case 'en cours': return 'bg-amber-100 text-amber-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      case 'en attente': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut) => {
    switch(statut.toLowerCase()) {
      case 'en cours': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'terminé': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'en attente': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-blue-700">Dossiers du client</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un dossier..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {["Création", "Modification", "Fermeture"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedType === type
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center">
          <Folder className="w-12 h-12 mx-auto text-blue-700 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun dossier trouvé</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Aucun dossier ne correspond à votre recherche."
              : `Aucun dossier de type ${selectedType.toLowerCase()} n'a été trouvé pour ce client.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    onClick={() => navigate(`/admin/dossier/${p.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatSousType(p.sousType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(p.statut)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(p.statut)}`}>
                          {p.statut.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="w-5 h-5 text-gray-400 hover:text-blue-700 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeProjetsClient;