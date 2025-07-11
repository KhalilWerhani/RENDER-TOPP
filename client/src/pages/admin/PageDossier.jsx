import React, { useEffect, useState , useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiFile, FiUser, FiMail, FiBriefcase, FiDownload,
  FiClock, FiCheckCircle, FiAlertCircle, FiInfo
} from "react-icons/fi";
import { FaEnvelope } from 'react-icons/fa';
import { AppContent } from "../../context/AppContext";

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
  "TRANSFORMATION_SAS_EN_SARL": { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" }
};

const PageDossier = () => {
  const { backendUrl } = useContext(AppContent);
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boList, setBoList] = useState([]);
  const [selectedBo, setSelectedBo] = useState("");
  const [showReassignForm, setShowReassignForm] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("ID de dossier manquant dans l'URL.");
      toast.error("ID de dossier invalide");
      setLoading(false);
      return;
    }

    const fetchDossier = async () => {
      try {
        const res = await axios.get(`/api/admin/dossier/${id}`, { withCredentials: true });
        setDossier(res.data.dossier);
      } catch (error) {
        console.error("Erreur chargement dossier :", error);
        toast.error("Erreur lors du chargement du dossier");
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  useEffect(() => {
    const fetchBO = async () => {
      try {
        const res = await axios.get('/api/admin/liste-bo', { withCredentials: true });
        setBoList(res.data.data || []);
      } catch (error) {
        console.error("Erreur chargement BO :", error);
        toast.error("Impossible de charger les utilisateurs BO");
      }
    };
    fetchBO();
  }, []);

  const getDossierType = (dossier) => {
  if (!dossier) return "AUTRE";
  
  if (dossier.type === "Fermeture" || dossier.typeFermeture) return "Fermeture";
  if (dossier.modificationDate) return "Modification";
  return "Création";
};

  const handleAttribution = async () => {
    if (!selectedBo) return toast.error("Veuillez sélectionner un BO");
    const type = getDossierType(dossier);

    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/assign-dossier`,
        {
          dossierId: id,
          boId: selectedBo,
          type
        },
        { withCredentials: true }
      );

      toast.success("Dossier attribué avec succès");
      setDossier(res.data.dossier);
      setShowReassignForm(false);
    } catch (error) {
      console.error("Erreur attribution :", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'attribution");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900"> Dossier {dossier.codeDossier ? `#${dossier.codeDossier}` : `ID: ${dossier._id}`}</h1>
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
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
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      {dossier.user?.name || "N/A"}
                      {dossier.user && (
                        <a
                          href={`/admin/messages/${dossier.user?._id}`}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          title="Envoyer un message"
                        >
                          <FaEnvelope className="h-4 w-4" />
                        </a>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{dossier.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Forme juridique</p>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[dossier.type]?.bg} ${typeColors[dossier.type]?.text} ${typeColors[dossier.type]?.border}`}>
                        {dossier.type}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">BO Affecté</p>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      {dossier.boAffecte ? (
                        <>
                          {dossier.boAffecte.name}
                          <a
                            href={`/admin/messages/${dossier.boAffecte?._id}`}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            title="Envoyer un message"
                          >
                            <FaEnvelope className="h-4 w-4" />
                          </a>
                        </>
                      ) : (
                        <span className="text-gray-400">Non attribué</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Questionnaire Card - Modified for both modification and fermeture */}
{(dossier.questionnaire || dossier.typeFermeture || dossier.modificationDate) && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800">
        {dossier.typeFermeture ? 'Détails de fermeture' : 
         dossier.modificationDate ? 'Détails de modification' : 'Questionnaire'}
      </h2>
    </div>
    <div className="divide-y divide-gray-100">
      {/* For fermeture type */}
      {dossier.typeFermeture && (
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
        </div>
      )}

      {/* For modification type */}
      {dossier.modificationDate && (
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
      )}

      {/* Regular questionnaire */}
      {dossier.questionnaire && !dossier.typeFermeture && !dossier.modificationDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
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
      )}
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
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernière mise à jour</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(dossier.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questionnaire Card */}
            {dossier.questionnaire && Object.keys(dossier.questionnaire).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">Questionnaire</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {Object.entries(dossier.questionnaire).map(([key, value]) => {
                    const labels = {
                      entrepriseType: "Type d'entreprise",
                      nomEntreprise: "Nom de l'entreprise",
                      activite: "Activité principale",
                      adresseSiege: "Adresse du siège",
                      acquisitionStatut: "Statut d'acquisition",
                      typeBien: "Type de bien",
                      nbAssocies: "Nombre d'associés",
                      adresseCourrier: "Adresse courrier",
                    };

                    const label = labels[key] || key;

                    return (
                      <div key={key} className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-500">{label}</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value) : value || "N/A"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pièces jointes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Pièces jointes</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {dossier.fichiers?.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-2 text-left">Nom</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dossier.fichiers.map((piece, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-gray-700">{piece.filename}</td>
                          <td className="px-4 py-2">
                           <a
  href={piece.url}
    download={piece.filename}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline flex items-center gap-1"
  onClick={(e) => {
    // Optional: Add loading state or analytics
    console.log('Downloading:', piece.filename);
  }}
>
  <FiDownload className="text-sm" /> Télécharger
</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune pièce jointe</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucun document n'a été téléchargé pour ce dossier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* BO Assignment */}
            {(dossier.statut === "payé" || dossier.statut === "a traité") && (!dossier.boAffecte || dossier.boAffecte === null) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">Attribution à un BO</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner un BO</label>
                    <select
                      value={selectedBo}
                      onChange={(e) => setSelectedBo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">-- Sélectionner un BO --</option>
                      {boList.map((bo) => (
                        <option key={bo._id} value={bo._id}>
                          {bo.name} ({bo.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAttribution}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                  >
                    Attribuer ce dossier
                  </button>
                </div>
              </div>
            )}

            {/* Current BO Info avec option de réattribution */}
            {dossier.boAffecte && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">BO Affecté</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{dossier.boAffecte.name}</p>
                      <p className="text-sm text-gray-600">{dossier.boAffecte.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReassignForm(true)}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    Réattribuer à un autre BO
                  </button>

                  {showReassignForm && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau BO</label>
                        <select
                          value={selectedBo}
                          onChange={(e) => setSelectedBo(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">-- Sélectionner un BO --</option>
                          {boList.map((bo) => (
                            <option key={bo._id} value={bo._id}>
                              {bo.name} ({bo.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleAttribution}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                      >
                        Réattribuer ce dossier
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Historique</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flow-root">
                  <ul className="-mb-8">
                    <li className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-white">
                            <FiCheckCircle className="h-5 w-5 text-blue-500" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-800">Dossier créé</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={dossier.createdAt}>{formatDate(dossier.createdAt)}</time>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                            <FiInfo className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-800">Statut mis à jour</p>
                            <p className="text-sm text-gray-500">{dossier.statut}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDossier;