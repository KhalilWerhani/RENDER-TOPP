import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AppContent } from '../context/AppContext';
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import { useParams } from "react-router-dom";


const FormEntreprise = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
const type = new URLSearchParams(location.search).get("type"); // 'modification', 'dossier', or 'fermeture'
const isModification = type === 'modification';
const isFermeture = type === 'fermeture';  // <-- Add this line

  const [downloadInProgress, setDownloadInProgress] = useState(false);

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDocumentTypes = (type, isModification, modificationType,  isFermeture) => {
     if (isFermeture) {  // <-- Add Fermeture case first
    return [
      "Décision de dissolution",
      "Procès-verbal de liquidation",
      /* "Attestation de parution JAL",
      "Justificatif de radiation",
      "Extrait Kbis final",
      "Fiche renseignement fermeture",
      "Attestation de règlement des dettes" */
    ];
  } else if (isModification) {
      switch(modificationType) {
        case 'changement-activite':
          return [
            "Nouvelle déclaration d'activité",
            "Extrait Kbis mis à jour",
            "Décision de changement d'activité",
            "Fiche renseignement modification activité",
            "Justificatifs nouveaux métiers",
            "Attestation de parution JAL"
          ];
        
        case 'transfert-siege':
          return [
            "Nouveau bail ou contrat de domiciliation",
            "Décision de transfert du siège",
            "Justificatif nouveau domicile",
            "Fiche renseignement changement siège",
            "Attestation de parution JAL",
            "Extrait Kbis actuel",
            "Plan du nouveau local (si applicable)"
          ];
        
        case 'changement-denomination':
          return [
            "Décision de changement de dénomination",
            "Nouveaux statuts mis à jour",
            "Attestation de parution JAL",
            "Extrait Kbis actuel",
            "Fiche renseignement changement dénomination",
            "Certificat de disponibilité du nom"
          ];
        
        case 'changement-president':
          return [
            "CNI/Passeport nouveau président",
            "Procès-verbal de nomination",
            "Déclaration de conformité",
            "Extrait Kbis actuel",
            "Fiche renseignement changement président",
            "Attestation de non-condamnation nouveau président"
          ];
        
        case 'transformation-SARL-SAS':
          return [
            "Décision de transformation",
            "Nouveaux statuts SAS",
            "Procès-verbal d'assemblée générale extraordinaire",
            "Attestation de parution JAL",
            "Fiche renseignement transformation SARL vers SAS",
            "Extrait Kbis actuel",
            "Pacte d'actionnaires (si applicable)",
            "Attestation de dépôt des fonds"
          ];
        
        case 'transformation-SAS-SARL':
          return [
            "Décision de transformation",
            "Nouveaux statuts SARL",
            "Procès-verbal d'assemblée générale extraordinaire",
            "Attestation de parution JAL",
            "Fiche renseignement transformation SAS vers SARL",
            "Extrait Kbis actuel",
            "Acte de nomination du gérant",
            "Attestation de dépôt des fonds"
          ];
        
        default:
          return [
            "Document justificatif de la modification",
            "Extrait Kbis mis à jour",
           /* "Décision modificative",
            "Fiche renseignement modification standard",
            "Attestation de parution JAL (si nécessaire)"*/
          ];
      }
    } else {
      switch(type) {
        case 'EI':
          return [
            "CNI/Passeport du gérant",
            "Justificatif de domicile (moins de 3 mois)",
            "Attestation de non-condamnation",
            "Déclaration sur l'honneur de filiation",
            "Fiche renseignement création EI",
            "Formulaire M0 signé",
            "Attestation de dépôt des fonds (si capital)"
          ];
        
        case 'SARL':
          return [
            "CNI/Passeport des associés",
            "Justificatif de domicile du gérant",
            "Statuts signés et datés",
            "Attestation de dépôt de capital",
            "Extrait Kbis du siège social",
            "Fiche renseignement création SARL",
            "Acte de nomination du gérant",
            "Formulaire M0 signé",
            "Attestation de parution JAL"
          ];
        
        case 'SA':
          return [
            "CNI/Passeport des administrateurs",
            "Justificatif de domicile du président",
            "Statuts signés et datés",
            "Attestation de dépôt de capital",
            "Liste des actionnaires",
            "Procès-verbal de constitution",
            "Fiche renseignement création SA",
            "Formulaire M0 signé",
            "Attestation de parution JAL"
          ];
        
        case 'SAS':
          return [
            "CNI/Passeport du président",
            "Justificatif de domicile du siège",
          ];
        
        default:
          return [
            "Mandataires_associes_actionnaires",
            "Justificatif de domicile du siège",
            "Attestation de parution JAL",
          ];
      }
    }
  };

  const documentTypes = getDocumentTypes(
    dossier?.type, 
    isModification, 
    dossier?.modificationType,
    isFermeture
  );

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        let endpoint;
if (isModification) {
  endpoint = `${backendUrl}/api/modification/${id}`;
} else if (isFermeture) {
  endpoint = `${backendUrl}/api/fermeture/${id}`;  // <-- Fermeture endpoint
} else {
  endpoint = `${backendUrl}/api/dossiers/${id}`;
}


        const { data } = await axios.get(endpoint, {
          withCredentials: true
        });

        setDossier(data);
        setUploadedFiles(data.fichiers || []);
      } catch (err) {
        toast.error("Erreur de chargement du dossier");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDossier();
    } else {
      toast.error("ID introuvable");
      navigate("/");
    }
  }, [id, backendUrl, isModification, navigate, downloadInProgress]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


// upload files
const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) {
    toast.error("Veuillez fournir le fichier");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userData?.id);
  formData.append('dossierId', id);
  let typeDossier = isFermeture ? 'fermeture' : isModification ? 'modification' : 'standard';
  formData.append('typeDossier', typeDossier); // 'standard', 'fermeture', 'modification'

  const toastId = toast.loading("Téléversement du document en cours...");
  try {
    setDownloadInProgress(true);
    const res = await axios.post(`${backendUrl}/api/files/upload`, formData);

    toast.update(toastId, {
      render: "Document téléversé avec succès!",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });
    setDownloadInProgress(false);
   setFile(null);
 // Update status after first document
    if (uploadedFiles.length === 0) {
      let updateEndpoint;
      if (isModification) {
        updateEndpoint = `${backendUrl}/api/modification/${id}/update-status`;
      } else if (isFermeture) {
        updateEndpoint = `${backendUrl}/api/fermeture/${id}/update-status`;
      } else {
        updateEndpoint = `${backendUrl}/api/dossiers/${id}/status`;
      }

      await axios.put(
        updateEndpoint,
        {
          etatAvancement: "documents",
          statut: "a traité",
        },
        { withCredentials: true }
      );
      toast.success("Statut mis à jour: à traiter");
   
    }

    // Move to next document or finish
    if (currentFileIndex < documentTypes.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      toast.info(`Prêt pour le document suivant: ${documentTypes[currentFileIndex + 1]}`);
    } else {
      toast.success("Tous les documents ont été téléchargés!");
      let queryParam;
      if (isModification) {
        queryParam = 'modificationId';
      } else if (isFermeture) {
        queryParam = 'fermetureId';
      } else {
        queryParam = 'dossierId';
      }
      navigate(`/validation?${queryParam}=${id}`);
    }




  } catch (err) {
    toast.update(toastId, {
      render: err.response?.data?.message || "Erreur lors du téléversement",
      type: "error",
      isLoading: false,
      autoClose: 3000
    });
    setDownloadInProgress(false);
    console.error(err);
  }

  
};

  
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Chargement du dossier...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Simple Stepper */}
      <div className="max-w-4xl mt-20 mx-auto px-4 pt-6 ">
        <Stepper currentStep={3} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#f4d47c] px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-700">
  {isFermeture ? 'Dépôt des documents pour la fermeture' : `Dépôt des documents pour votre ${dossier?.type}`}
</h1>
            <p className="text-gray-600 mt-1">
              Étape {currentFileIndex + 1} sur {documentTypes.length}
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Current Document */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Document requis:
                </h2>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    {documentTypes[currentFileIndex]}
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléverser le document
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>{file ? file.name : "Choisir un fichier"}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => setFile(e.target.files[0])} 
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG jusqu'à 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                  disabled={currentFileIndex === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>

                <button
                  type="submit"
                  disabled={!file || downloadInProgress}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentFileIndex < documentTypes.length - 1 ? (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      Enregistrer et continuer
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Terminer le dépôt
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Documents déposés</h3>
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {uploadedFiles.map((doc, index) => (
                    <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.filename}</span>
                      </div>
                      <span className="text-xs text-gray-500">✓ Validé</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEntreprise;