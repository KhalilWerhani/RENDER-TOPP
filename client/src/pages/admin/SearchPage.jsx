import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get("q");

        if (!query) {
            navigate("/admin");
            return;
        }

        const fetchResults = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/admin/search?q=${query}`);

                if (data.success) {
                    setResults(data.results);
                } else {
                    toast.error(data.message || "Erreur lors de la recherche");
                }
            } catch (error) {
                toast.error("Erreur serveur lors de la recherche");
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [location.search, navigate, backendUrl]);

    return (
        <div className="container mx-auto px-4 py-24">
            <h1 className="text-2xl font-bold mb-6">Résultats de recherche</h1>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d9b945]"></div>
                </div>
            ) : results.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#f8f0d0]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((dossier) => (
                                <tr
                                    key={dossier._id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/admin/dossier/${dossier._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {dossier.codeDossier || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {dossier.user?.name || 'Client inconnu'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {dossier.user?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {dossier.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${dossier.statut === 'traité' ? 'bg-green-100 text-green-800' :
                                                dossier.statut === 'en traitement' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {dossier.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Aucun résultat trouvé pour votre recherche</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;