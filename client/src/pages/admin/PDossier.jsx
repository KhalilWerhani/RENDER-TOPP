import React from "react";

const PDossier = () => {
  const utilisateur = {
    email: "jean.dupont@mail.com",
    statut: "Payé",
    type: "SARL",
    cible: "Client PME",
    date: "mer., juin 19, 2025 16:00",
    titre: "Dossier création SARL",
    cta: "Accéder au dossier",
    contenu: "Merci pour votre confiance, votre dossier est en cours de traitement.",
    image: "/images/avatar.png"
  };

  const questionnaire = [
    { question: "Nom de l'entreprise", reponse: "Tech Solutions SARL" },
    { question: "Activité principale", reponse: "Développement logiciel" },
    { question: "Adresse du siège", reponse: "12 rue de Paris, 75001 Paris" },
    { question: "Nombre d'associés", reponse: "2" },
    { question: "Statut d'acquisition", reponse: "Création" },
  ];

  const piecesJointes = [
    { nom: "K-bis.pdf", lien: "/docs/kbis.pdf", image: "/icons/pdf-icon.png" },
    { nom: "Pièce Identité.jpg", lien: "/docs/cni.jpg", image: "/icons/img-icon.png" },
    { nom: "Justif Domicile.pdf", lien: "/docs/domicile.pdf", image: "/icons/pdf-icon.png" },
  ];

  const badgeColor = "bg-emerald-100 text-emerald-800";
  const typeColor = "bg-blue-100 text-blue-800";

  return (
    <div className="p-6 bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">E-Mail</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Cible</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Titre</th>
            <th className="px-4 py-3 text-left">CTA</th>
            <th className="px-4 py-3 text-left">Contenu</th>
            <th className="px-4 py-3 text-left">Image</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-4 py-3">{utilisateur.email}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                {utilisateur.statut}
              </span>
            </td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                {utilisateur.type}
              </span>
            </td>
            <td className="px-4 py-3">{utilisateur.cible}</td>
            <td className="px-4 py-3">{utilisateur.date}</td>
            <td className="px-4 py-3 font-semibold text-gray-800">{utilisateur.titre}</td>
            <td className="px-4 py-3 text-blue-600 underline cursor-pointer">{utilisateur.cta}</td>
            <td className="px-4 py-3 text-gray-500 truncate">{utilisateur.contenu}</td>
            <td className="px-4 py-3">
              <img src={utilisateur.image} alt="avatar" className="w-8 h-8 rounded object-cover" />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Questionnaire */}
      <h3 className="mt-8 mb-2 text-gray-800 font-semibold text-lg">Réponses au Questionnaire</h3>
      <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Question</th>
            <th className="px-4 py-2 text-left">Réponse</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {questionnaire.map((q, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-gray-600">{q.question}</td>
              <td className="px-4 py-2 text-gray-800">{q.reponse}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pièces jointes */}
      <h3 className="mt-8 mb-2 text-gray-800 font-semibold text-lg">Pièces jointes</h3>
      <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Aperçu</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {piecesJointes.map((p, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-gray-700">{p.nom}</td>
              <td className="px-4 py-2">
                <img src={p.image} alt="icone" className="w-6 h-6" />
              </td>
              <td className="px-4 py-2">
                <a
                  href={p.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Télécharger
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PDossier;
