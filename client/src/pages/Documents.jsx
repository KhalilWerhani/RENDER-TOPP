import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FileText, Eye, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { AppContent } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const Documents = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [allDossiers, setAllDossiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});

  useEffect(() => {
    if (!userData?.id) return;

    const fetchDocuments = async () => {
      setIsLoading(true);

      try {
        const [classicRes, modifRes] = await Promise.all([
          axios.get(`${backendUrl}/upload/all-documents/${userData.id}`),
          axios.get(`${backendUrl}/upload/all-modificationdocuments/${userData.id}`)
        ]);

        const classicDossiers = classicRes.data.dossiers || [];
        const modifDossiers = modifRes.data.dossiers || [];

        const combined = [...classicDossiers, ...modifDossiers];
        setAllDossiers(combined);

        const expanded = {};
        combined.forEach(d => expanded[d.dossierId] = true);
        setExpandedFolders(expanded);
      } catch (err) {
        console.error('Erreur lors du chargement des documents :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [userData, backendUrl]);

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-white">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={assets.illustrawbook}
            alt="Doc"
            className="w-24 h-24 rounded-lg shadow-sm border-1 border-blue-100"
          />
          <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : allDossiers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucun document trouvé</h3>
            <p className="text-gray-500 mt-1">Aucun dossier trouvé pour cet utilisateur</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allDossiers.map((dossier) => {
              const filteredDocs = dossier.documents.filter((doc) =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (filteredDocs.length === 0) return null;

              return (
                <div key={dossier.dossierId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFolder(dossier.dossierId)}
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <span>Dossier {dossier.type}</span>
                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {filteredDocs.length} document{filteredDocs.length > 1 ? 's' : ''}
                        </span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Créé le {new Date(dossier.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                      {expandedFolders[dossier.dossierId] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedFolders[dossier.dossierId] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 pt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredDocs.map((doc, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                              >
                                <div className="p-5">
                                  <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <FileText className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900 line-clamp-2">{doc.title}</h3>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="px-5 pb-4">
                                  <a
  href={`${backendUrl.replace(/\/$/, '')}${doc.filePath}`}

                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg border border-blue-200 transition-colors"
                                  >
                                    <Eye size={18} /> Voir le document
                                  </a>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Documents;
