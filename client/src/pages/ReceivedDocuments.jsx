import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import {
  Download as DownloadIcon,
  InsertDriveFile as DocumentIcon,
  Person as PersonIcon,
  Schedule as TimeIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  TableChart as ExcelIcon,
  Slideshow as PptIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReceivedDocuments = () => {
  const { backendUrl } = useContext(AppContent);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/documents/received`, {
          withCredentials: true,
        });

        let docs = [];
        if (Array.isArray(res.data)) {
          docs = res.data;
        } else if (res.data && res.data.length) {
          docs = res.data;
        } else if (res.data.success && res.data.documents) {
          docs = res.data.documents;
        }

        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement documents reçus:', err);
        setError('Erreur lors du chargement des documents. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [backendUrl]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedDocuments = [...documents].sort((a, b) => {
      if (property === 'createdAt') {
        return isAsc 
          ? new Date(a[property]) - new Date(b[property])
          : new Date(b[property]) - new Date(a[property]);
      } else {
        return isAsc 
          ? a[property]?.localeCompare(b[property])
          : b[property]?.localeCompare(a[property]);
      }
    });
    
    setDocuments(sortedDocuments);
  };

  const getFileType = (filename) => {
    const extension = filename?.split('.').pop().toLowerCase();
    const fileTypes = {
      pdf: 'PDF',
      doc: 'DOC',
      docx: 'DOCX',
      xls: 'XLS',
      xlsx: 'XLSX',
      ppt: 'PPT',
      pptx: 'PPTX',
      jpg: 'JPG',
      jpeg: 'JPEG',
      png: 'PNG',
      txt: 'TXT'
    };
    return fileTypes[extension] || extension?.toUpperCase();
  };

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return <PdfIcon className="text-white" />;
      case 'doc':
      case 'docx': return <DocIcon className="text-white" />;
      case 'xls':
      case 'xlsx': return <ExcelIcon className="text-white" />;
      case 'ppt':
      case 'pptx': return <PptIcon className="text-white" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <ImageIcon className="text-white" />;
      default: return <DocumentIcon className="text-white" />;
    }
  };

  const getFileIconColor = (filename) => {
    const extension = filename?.split('.').pop().toLowerCase();
    const colors = {
      pdf: 'bg-red-500',
      doc: 'bg-blue-500',
      docx: 'bg-blue-500',
      xls: 'bg-green-500',
      xlsx: 'bg-green-500',
      ppt: 'bg-orange-500',
      pptx: 'bg-orange-500',
      jpg: 'bg-pink-500',
      jpeg: 'bg-pink-500',
      png: 'bg-cyan-500',
      txt: 'bg-gray-500'
    };
    return colors[extension] || 'bg-purple-500';
  };

  const handleDownload = async (fileUrl) => {
    try {
      const downloadUrl = fileUrl.startsWith('http') 
        ? fileUrl 
        : `${backendUrl}/${fileUrl.replace(/\\/g, '/')}`;
      
      if (fileUrl.toLowerCase().endsWith('.pdf')) {
        window.open(downloadUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setSnackbar({
        open: true,
        message: 'Téléchargement démarré',
        severity: 'success'
      });
    } catch (err) {
      console.error('Download error:', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors du téléchargement',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <div className="p-4 md:p-6 max-w-8xl   min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-6 mb-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-4">
              <DocumentIcon className="text-blue-500 text-3xl" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Documents Reçus</h1>
            </div>
            <p className="mt-2 text-gray-600">Liste de tous les documents que vous avez reçus</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${documents.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 mb-4 bg-gray-100 rounded-lg animate-pulse last:mb-0"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 text-center rounded-xl shadow-sm">
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl shadow-sm max-w-md mx-auto">
          <DocumentIcon className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun document reçu</h2>
          <p className="text-gray-500 mb-6">Les documents partagés avec vous apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">
                      <button 
                        onClick={() => handleRequestSort('titre')}
                        className="flex items-center hover:underline focus:outline-none"
                      >
                        Document
                        {orderBy === 'titre' && (
                          <span className="ml-1">
                            {order === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      <button 
                        onClick={() => handleRequestSort('uploader.email')}
                        className="flex items-center hover:underline focus:outline-none"
                      >
                        Expéditeur
                        {orderBy === 'uploader.email' && (
                          <span className="ml-1">
                            {order === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      <button 
                        onClick={() => handleRequestSort('createdAt')}
                        className="flex items-center hover:underline focus:outline-none"
                      >
                        Date de réception
                        {orderBy === 'createdAt' && (
                          <span className="ml-1">
                            {order === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={`${getFileIconColor(doc.fichier)} w-10 h-10 rounded-full flex items-center justify-center shadow-sm`}>
                            {getFileIcon(doc.fichier)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-xs">{doc.titre}</p>
                            <p className="text-xs text-gray-500">{doc.fichier?.split('/').pop()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <PersonIcon className="mr-1 text-gray-500" fontSize="small" />
                          {doc.uploader?.email ? doc.uploader.email.split('@')[0] : 'Inconnu'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <TimeIcon className="mr-1 text-gray-500" fontSize="small" />
                          {formatDistanceToNow(new Date(doc.createdAt), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800`}>
                          {getFileType(doc.fichier)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDownload(doc.fichier)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                        >
                          <DownloadIcon fontSize="small" />
                          Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {documents.map((doc) => (
              <div key={doc._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`${getFileIconColor(doc.fichier)} w-12 h-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
                    {getFileIcon(doc.fichier)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.titre}</h3>
                    <p className="text-xs text-gray-500 truncate">{doc.fichier?.split('/').pop()}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <PersonIcon className="mr-1 text-gray-500" fontSize="small" />
                        {doc.uploader?.email ? doc.uploader.email.split('@')[0] : 'Inconnu'}
                      </div>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <TimeIcon className="mr-1 text-gray-500" fontSize="small" />
                        {formatDistanceToNow(new Date(doc.createdAt), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800`}>
                        {getFileType(doc.fichier)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDownload(doc.fichier)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm"
                  >
                    <DownloadIcon fontSize="small" />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${snackbar.severity === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center justify-between min-w-[250px]`}>
          <span>{snackbar.message}</span>
          <button onClick={handleCloseSnackbar} className="ml-4">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceivedDocuments;