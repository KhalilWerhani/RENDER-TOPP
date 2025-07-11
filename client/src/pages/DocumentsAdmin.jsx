import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Folder, FileText, Eye } from 'lucide-react';
import { AppContent } from '../context/AppContext';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { assets } from '../assets/assets';

const DocumentsAdmin = () => {
  const { backendUrl } = useContext(AppContent);
  const [documentsByUser, setDocumentsByUser] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/upload/admin/all-documents`);
        setDocumentsByUser(response.data.documentsByUser);
      } catch (err) {
        console.error('Error fetching admin documents:', err);
      }
    };

    fetchAllDocuments();
  }, [backendUrl]);

  const filteredDocs = activeUser
    ? documentsByUser[activeUser].filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 text-black font-sans">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 flex flex-col items-center gap-4 animate-slide-in">
          <span className="relative">
            
            Documents des utilisateurs
          </span>
          <img
            src={assets.document_img}
            alt="Doc"
            className="w-32 h-32 sm:w-24 sm:h-24 rounded-2xl shadow-xl border-4 border-blue-300 hover:scale-105 transition-transform"
          />
        </h1>
      </div>

      {!activeUser ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Object.keys(documentsByUser).map((username) => (
            <div
              key={username}
              onClick={() => {
                setActiveUser(username);
                setSearchTerm('');
              }}
              className="bg-white hover:bg-yellow-50 cursor-pointer text-blue-900 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center transition duration-300 hover:scale-105"
            >
              <Folder size={40} className="text-blue-600" />
              <p className="mt-3 text-lg font-bold">{username}</p>
              <span className="text-sm text-gray-500">
                {documentsByUser[username].length} fichiers
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="mb-6 bg-white hover:bg-yellow-100 text-blue-800 px-4 py-2 rounded-full shadow flex items-center gap-2 transition"
            onClick={() => {
              setActiveUser(null);
              setSearchTerm('');
            }}
          >
            <FaArrowLeft size={17} /> Retour
          </button>

          <div className="flex items-center mb-6 max-w-md mx-auto bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 text-blue-600">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 outline-none text-gray-700"
            />
          </div>

          <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            Documents de <span className="underline decoration-yellow-300">{activeUser}</span>
          </h2>

          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white border border-gray-200 hover:shadow-xl hover:border-yellow-200 text-black rounded-2xl p-5 flex flex-col justify-between transition duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <FileText className="text-blue-500 mt-1" size={28} />
                    <div>
                      <p className="text-lg font-semibold break-words text-blue-900">
                        {doc.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Envoyé le {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`${backendUrl}/${doc.filePath.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl mt-auto transition"
                  >
                    <Eye className="mr-2" size={18} /> Voir
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6 text-lg italic">Aucun document trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsAdmin;