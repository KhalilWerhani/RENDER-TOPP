import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiFile, FiUser, FiMail, FiBriefcase, FiDownload,
  FiClock, FiCheckCircle, FiAlertCircle, FiInfo
} from 'react-icons/fi';
import Modal from 'react-modal';
import './DossierDetailBO.css';
import { FaEnvelope } from 'react-icons/fa';
import { AppContent } from '../../context/AppContext';

Modal.setAppElement('#root');

const statusColors = {
  "en attente": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: <FiClock className="text-amber-500" />
  },
  "payé": {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: <FiCheckCircle className="text-emerald-500" />
  },
  "a traité": {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    icon: <FiInfo className="text-gray-500" />
  },
  "en traitement": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: <FiClock className="text-blue-500" />
  },
  "traité": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    icon: <FiCheckCircle className="text-purple-500" />
  }
};

const typeColors = {
  "SAS": { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  "SASU": { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  "SARL": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "EURL": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "SCI": { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  "AUTO-ENTREPRENEUR": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "Entreprise individuelle": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  "Association": { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  "TRANSFERT_SIEGE": { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  "CHANGEMENT_DENOMINATION": { bg: "bg-fuchsia-50", text: "text-fuchsia-600", border: "border-fuchsia-200" },
  "CHANGEMENT_PRESIDENT": { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  "CHANGEMENT_ACTIVITE": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
  "TRANSFORMATION_SARL_EN_SAS": { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
  "TRANSFORMATION_SAS_EN_SARL": { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
  "DISSOLUTION_LIQUIDATION": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  "MISE_EN_SOMMEIL": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "RADIATION_AUTO_ENTREPRENEUR": { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  "DEPOT_DE_BILAN": { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
};

const renderDossierSpecificDetails = (dossier, type) => {
  if (type === 'fermeture') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Détails de fermeture</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entreprise Info */}
            {dossier.entreprise && (
              <div>
                <p className="text-sm font-medium text-gray-500">Entreprise</p>
                <div className="mt-1 text-sm text-gray-900">
                  {dossier.entreprise.nom && <p>Nom: {dossier.entreprise.nom}</p>}
                  {dossier.entreprise.siret && <p>SIRET: {dossier.entreprise.siret}</p>}
                  {dossier.entreprise.adresse && <p>Adresse: {dossier.entreprise.adresse}</p>}
                </div>
              </div>
            )}

            {/* Common fields */}
            <div>
              {dossier.formeSociale && (
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Forme sociale: </span>
                  {dossier.formeSociale}
                </p>
              )}
              {dossier.observations && (
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Observations: </span>
                  {dossier.observations}
                </p>
              )}
            </div>

            {/* Type-specific fields */}
            {dossier.typeFermeture === 'MISE_EN_SOMMEIL' && (
              <>
                {dossier.artisanale !== undefined && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Artisanale: </span>
                    {dossier.artisanale ? 'Oui' : 'Non'}
                  </p>
                )}
                {dossier.timing && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Timing: </span>
                    {dossier.timing}
                  </p>
                )}
              </>
            )}

            {dossier.typeFermeture === 'DEPOT_DE_BILAN' && dossier.depotBilan && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Dépôt de bilan</p>
                <div className="mt-1 text-sm text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dossier.depotBilan.nom && <p>Nom: {dossier.depotBilan.nom}</p>}
                  {dossier.depotBilan.prenom && <p>Prénom: {dossier.depotBilan.prenom}</p>}
                  {dossier.depotBilan.role && <p>Rôle: {dossier.depotBilan.role}</p>}
                  {dossier.depotBilan.email && <p>Email: {dossier.depotBilan.email}</p>}
                  {dossier.depotBilan.telephone && <p>Téléphone: {dossier.depotBilan.telephone}</p>}
                  {dossier.depotBilan.situation && <p>Situation: {dossier.depotBilan.situation}</p>}
                  {dossier.depotBilan.societe && <p>Société: {dossier.depotBilan.societe}</p>}
                  {dossier.depotBilan.precisions && <p>Précisions: {dossier.depotBilan.precisions}</p>}
                </div>
              </div>
            )}

            {dossier.typeFermeture === 'DISSOLUTION_LIQUIDATION' && (
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Type de fermeture: </span>
                  Dissolution et liquidation
                </p>
              </div>
            )}

            {dossier.typeFermeture === 'RADIATION_AUTO_ENTREPRENEUR' && (
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Type de fermeture: </span>
                  Radiation auto-entrepreneur
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'modification') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Détails de modification</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entreprise Info */}
            {dossier.entreprise && (
              <div>
                <p className="text-sm font-medium text-gray-500">Entreprise</p>
                <div className="mt-1 text-sm text-gray-900">
                  {dossier.entreprise.nom && <p>Nom: {dossier.entreprise.nom}</p>}
                  {dossier.entreprise.siret && <p>SIRET: {dossier.entreprise.siret}</p>}
                  {dossier.entreprise.adresse && <p>Adresse: {dossier.entreprise.adresse}</p>}
                </div>
              </div>
            )}

            {/* Common fields */}
            <div>
              {dossier.formeSociale && (
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Forme sociale: </span>
                  {dossier.formeSociale}
                </p>
              )}
              {dossier.artisanale !== undefined && (
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-500">Artisanale: </span>
                  {dossier.artisanale ? 'Oui' : 'Non'}
                </p>
              )}
            </div>

            {/* Type-specific fields */}
            {dossier.type === 'CHANGEMENT_DENOMINATION' && dossier.nouveauNom && (
              <p className="text-sm text-gray-900">
                <span className="font-medium text-gray-500">Nouveau nom: </span>
                {dossier.nouveauNom}
              </p>
            )}

            {dossier.type === 'CHANGEMENT_PRESIDENT' && dossier.nouveauPresident && (
              <div>
                <p className="text-sm font-medium text-gray-500">Nouveau président</p>
                <div className="text-sm text-gray-900">
                  <p>Prénom: {dossier.nouveauPresident.prenom}</p>
                  <p>Nom: {dossier.nouveauPresident.nom}</p>
                </div>
              </div>
            )}

            {dossier.type === 'TRANSFERT_SIEGE' && (
              <>
                {dossier.adresseActuelle && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Adresse actuelle: </span>
                    {dossier.adresseActuelle}
                  </p>
                )}
                {dossier.adresseNouvelle && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Nouvelle adresse: </span>
                    {dossier.adresseNouvelle}
                  </p>
                )}
              </>
            )}

            {dossier.type === 'CHANGEMENT_ACTIVITE' && (
              <>
                {dossier.typeChangement && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Type de changement: </span>
                    {dossier.typeChangement}
                  </p>
                )}
                {dossier.nouvelleActivite && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium text-gray-500">Nouvelle activité: </span>
                    {dossier.nouvelleActivite}
                  </p>
                )}
              </>
            )}

            {dossier.type === 'TRANSFORMATION_SARL_EN_SAS' && (
              <p className="text-sm text-gray-900">
                <span className="font-medium text-gray-500">Transformation: </span>
                SARL vers SAS
              </p>
            )}

            {dossier.type === 'TRANSFORMATION_SAS_EN_SARL' && (
              <p className="text-sm text-gray-900">
                <span className="font-medium text-gray-500">Transformation: </span>
                SAS vers SARL
              </p>
            )}

            {dossier.vendeurs && dossier.vendeurs.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Vendeurs</p>
                <div className="mt-1 text-sm text-gray-900 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dossier.vendeurs.map((vendeur, index) => (
                    <div key={index}>
                      <p>Prénom: {vendeur.prenom}</p>
                      <p>Nom: {vendeur.nom}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const DossierDetailBO = () => {
  const { backendUrl } = useContext(AppContent);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [hasShownDownloadWarning, setHasShownDownloadWarning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        let url = '';
        if (type === 'modification') {
          url =  `${backendUrl}/api/modification/dossier/${id}`;
        } else if (type === 'fermeture') {
          url =  `${backendUrl}/api/fermeture/${id}`;
        } else {
          url =  `${backendUrl}/api/dossier/${id}`;
        }

        const res = await axios.get(url, { withCredentials: true });
        setDossier(res.data);

        // Check if any files have been downloaded before
        const downloadHistory = localStorage.getItem(`downloads_${id}`);
        if (downloadHistory) {
          setDownloadedFiles(JSON.parse(downloadHistory));
        }
      } catch (err) {
        console.error("Erreur chargement détail dossier :", err);
        toast.error("Erreur lors du chargement du dossier");
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id, type]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (filePath, fileName) => {
    // Show download confirmation modal if it's the first download
    if (downloadedFiles.length === 0) {
      setShowDownloadModal(true);
      return;
    }

    // Proceed with download
    window.open( `${backendUrl}/uploads/${filePath}`, '_blank');
    
    // Track downloaded files if not already tracked
    if (!downloadedFiles.includes(fileName)) {
      const newDownloadedFiles = [...downloadedFiles, fileName];
      setDownloadedFiles(newDownloadedFiles);
      localStorage.setItem(`downloads_${id}`, JSON.stringify(newDownloadedFiles));

      // Check if all files have been downloaded
      if (dossier.fichiers && newDownloadedFiles.length === dossier.fichiers.length) {
        await updateDossierStatus('en traitement');
        setShowCompletionModal(true);
      }
    }
  };

  const confirmDownload = (filePath, fileName) => {
    setShowDownloadModal(false);
    // Start the download after confirmation
    window.open( `${backendUrl}/uploads/${filePath}`, '_blank');
    
    // Track the first download
    const newDownloadedFiles = [fileName];
    setDownloadedFiles(newDownloadedFiles);
    localStorage.setItem(`downloads_${id}`, JSON.stringify(newDownloadedFiles));

    // If there's only one file, update status immediately
    if (dossier.fichiers && dossier.fichiers.length === 1) {
      updateDossierStatus('en traitement');
      setShowCompletionModal(true);
    }
  };

  const updateDossierStatus = async (newStatus) => {
    try {
      let url = '';
      if (type === 'modification') {
        url =  `${backendUrl}/api/modification/${id}/update-status`;
      } else if (type === 'fermeture') {
        url =  `${backendUrl}/api/fermeture/${id}/update-status`;
      } else {
        url =  `${backendUrl}/api/dossier/${id}/status`;
      }

      const res = await axios.put(
        url,
        { statut: newStatus },
        { withCredentials: true }
      );

      setDossier({ ...dossier, statut: newStatus });
      toast.success(`Statut mis à jour: ${newStatus}`);

      // Send email to client
      await axios.post(
         `${backendUrl}/api/send-status-email`,
        {
          dossierId: id,
          dossierType: type,
          newStatus,
          clientEmail: dossier.user?.email,
          clientName: dossier.user?.name
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Erreur mise à jour statut :", err);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement du dossier...</p>
      </div>
    </div>
  );

  if (!dossier) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-400 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Dossier introuvable</h3>
          <p className="text-gray-500">Le dossier demandé n'existe pas ou vous n'y avez pas accès</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Download Confirmation Modal */}
      <Modal
        isOpen={showDownloadModal}
        onRequestClose={() => setShowDownloadModal(false)}
        contentLabel="Download Confirmation"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <FiDownload className="text-blue-500 text-2xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Confirmation de téléchargement</h2>
          <p className="mb-4 text-center text-gray-600">
            En téléchargeant les documents, le statut du dossier passera automatiquement à "en traitement" une fois tous les documents téléchargés.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => confirmDownload(dossier.fichiers[0].url, dossier.fichiers[0].filename)}
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>

      {/* Download Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onRequestClose={() => setShowCompletionModal(false)}
        contentLabel="Download Complete"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Téléchargement terminé</h2>
          <p className="mb-4 text-center text-gray-600">
            Vous avez téléchargé tous les documents. Le statut du dossier a été mis à jour à "en traitement".
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowCompletionModal(false)}
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Compris
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dossier {dossier.codeDossier ? `#${dossier.codeDossier}` : `ID: ${dossier._id}`}</h1>
        <div className="mt-2 flex items-center space-x-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[dossier.statut?.toLowerCase()]?.bg} ${statusColors[dossier.statut?.toLowerCase()]?.text} ${statusColors[dossier.statut?.toLowerCase()]?.border}`}>
            {statusColors[dossier.statut?.toLowerCase()]?.icon}
            <span className="ml-1">{dossier.statut}</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeColors[dossier.type]?.bg} ${typeColors[dossier.type]?.text} ${typeColors[dossier.type]?.border}`}>
            {dossier.type}
          </div>
          <div className="text-sm text-gray-500">
            Créé le {formatDate(dossier.createdAt)}
          </div>
        </div>
      </div>

      {/* Status Update Button */}
      {dossier.statut === 'a traité' && (
        <div className="mb-6">
          <button
            onClick={() => updateDossierStatus('en traitement')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Passer en "en traitement"
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 bg-white rounded-xl shadow overflow-x-auto">
        {/* Render specific details based on dossier type */}
        {renderDossierSpecificDetails(dossier, type)}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  Informations client
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom complet</p>
                    <p className="mt-1 text-sm text-gray-900">{dossier.user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{dossier.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Forme juridique</p>
                    <p className="mt-1 text-sm text-gray-900">{dossier.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">BO Affecté</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {dossier.boAffecte ? (
                        <span className="text-gray-800">{dossier.boAffecte.name}</span>
                      ) : (
                        <span className="text-gray-400">Non attribué</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Add this section where you want to show the questionnaire */}
{dossier?.questionnaire && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
    <h2 className="text-lg font-semibold mb-4">Questionnaire</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(dossier.questionnaire).map(([key, value]) => (
        <div key={key}>
          <p className="text-sm font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </p>
          <p className="text-sm text-gray-900">
            {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value || 'N/A'}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

            {/* Dossier Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FiFile className="mr-2 text-gray-500" />
                  Détails du dossier
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[dossier.statut?.toLowerCase()]?.bg} ${statusColors[dossier.statut?.toLowerCase()]?.text} ${statusColors[dossier.statut?.toLowerCase()]?.border}`}>
                        {statusColors[dossier.statut?.toLowerCase()]?.icon}
                        <span className="ml-1">{dossier.statut}</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avancement</p>
                    <p className="mt-1 text-sm text-gray-900">{dossier.etatAvancement || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(dossier.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          

          {/* Right Column */}
          {/* Attachments Card */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
      <FiDownload className="mr-2 text-gray-500" />
      Pièces jointes
    </h2>
  </div>
  <div className="divide-y divide-gray-100">
    {/* Client Uploaded Documents */}
    {dossier.fichiers?.length > 0 && (
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Documents client</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dossier.fichiers.map((piece, index) => (
              <tr key={`client-${index}`}>
                <td className="px-4 py-2 text-gray-700">{piece.filename}</td>
                <td className="px-4 py-2">
                  <a
                    href={piece.url}
                    download={piece.filename}  
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center text-blue-600 hover:text-blue-800 ${downloadedFiles.includes(piece.filename) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Télécharger"
                    onClick={(e) => downloadedFiles.includes(piece.filename) && e.preventDefault()}
                  >
                    <FiDownload className="mr-1" />
                    {downloadedFiles.includes(piece.filename) ? 'Téléchargé' : 'Télécharger'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* BO Uploaded Documents */}
    {dossier.fichiersbo?.length > 0 && (
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Documents backoffice</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dossier.fichiersbo.map((piece, index) => (
              <tr key={`bo-${index}`}>
                <td className="px-4 py-2 text-gray-700">
                  {piece.filename || piece.titre}
                </td>
                <td className="px-4 py-2">
                  <a
                    href={piece.url || piece.fichier}
                    download={piece.filename || piece.titre}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    title="Télécharger"
                  >
                    <FiDownload className="mr-1" />
                    Télécharger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* No documents message */}
    {(!dossier.fichiers?.length && !dossier.fichiersbo?.length) && (
      <div className="px-6 py-8 text-center">
        <FiFile className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune pièce jointe</h3>
        <p className="mt-1 text-sm text-gray-500">Aucun document n'a été téléchargé pour ce dossier.</p>
      </div>
    )}
  </div>
</div>
          
        </div>
      </div>
    </div>
  );
};

export default DossierDetailBO;