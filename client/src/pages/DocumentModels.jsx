import React from "react";
import { FileText, Download } from "lucide-react"; // icon library

const documentModels = [
  {
    title: "Statuts de société (SARL, SAS, SASU)",
    description: "Téléchargez des modèles à jour pour vos formalités de création d'entreprise.",
    link: "/documents/statuts-societe.pdf"
  },
  {
    title: "Procès-verbal d'assemblée",
    description: "Modèle prêt à l’emploi pour vos démarches administratives.",
    link: "/documents/proces-verbal.pdf"
  },
  {
    title: "Contrat de cession de parts",
    description: "Formalisme respecté pour la transmission de titres.",
    link: "/documents/cession-parts.pdf"
  }
];

const DocumentModels = () => {
    return (
      <section id="document-models" className="bg-white py-20 px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
          Modèles de documents utiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {documentModels.map((doc, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="text-blue-600" size={32} />
                <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <a
                href={doc.link}
                download
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
              >
                <Download size={20} /> Télécharger
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  };
  

export default DocumentModels;
