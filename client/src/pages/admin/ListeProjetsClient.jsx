import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState , useContext } from "react";
import axios from "axios";
import { Folder, ChevronRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ListeProjetsClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [selectedType, setSelectedType] = useState("Création");
  const [loading, setLoading] = useState(true);
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

  const projetsFiltres = projets.filter(p => p.type === selectedType);

  const DossierSelector = ({ label }) => (
    <button
      onClick={() => setSelectedType(label)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        selectedType === label
          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
      }`}
    >
      {label}
    </button>
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

  const getStatusIcon = (statut) => {
    switch(statut.toLowerCase()) {
      case 'en cours':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'terminé':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'en attente':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dossiers du client</h2>
      </div>

      <div className="flex gap-4 mb-8">
        <DossierSelector label="Création" />
        <DossierSelector label="Modification" />
        <DossierSelector label="Fermeture" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : projetsFiltres.length === 0 ? (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 text-center">
          <Folder className="w-12 h-12 mx-auto text-amber-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun dossier trouvé</h3>
          <p className="text-gray-500">Aucun dossier de type {selectedType.toLowerCase()} n'a été trouvé pour ce client.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetsFiltres.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/admin/dossier/${p.id}`)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-amber-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-amber-100 mr-4">
                      <Folder className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{p.type}</h3>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                        {p.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {p.type === "Création"
                        ? "Forme juridique"
                        : p.type === "Modification"
                        ? "Type de modification"
                        : "Type"}
                    </p>
                    <p className="font-medium text-gray-700">{formatSousType(p.sousType)}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                        Statut
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(p.statut)}
                        <span className="font-medium text-gray-700 capitalize">{p.statut.toLowerCase()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                        Créé le
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(p.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeProjetsClient;