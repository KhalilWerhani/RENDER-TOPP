import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const modifications = [
  {
    title: "Transfert de siège",
    description: "Changer l’adresse du siège social",
    route: "/formulaire/transfert-siege-sociale",
  },
  {
    title: "Changement de dénomination",
    description: "Modifier le nom de l’entreprise",
    route: "/formulaire/changement-denomination",
  },
  {
    title: "Changement de président",
    description: "Nommer un nouveau représentant légal",
    route: "/formulaire/changement-president",
  },
  {
    title: "Changement d’activité",
    description: "Mettre à jour l’objet social",
    route: "/formulaire/changement-activite",
  },
  {
    title: "SARL vers SAS",
    description: "Transformer votre SARL en SAS",
    route: "/formulaire/transformation-sarl-en-sas",
  },
  {
    title: "SAS vers SARL",
    description: "Transformer votre SAS en SARL",
    route: "/formulaire/transformation-sas-en-sarl",
  },
];

const GererEntreprise = () => {
  const navigate = useNavigate();

  return (
   <div className="min-h-screen bg-gray-50">
      <Navbar /> 
    <div className="max-w-5xl mx-auto mt-30 p-6 bg-container mx-auto px-4 py-8 white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Choisir le type de modification 
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modifications.map((modif, index) => (
          <button
            key={index}
            onClick={() => navigate(modif.route)}
            className="border border-gray-200 hover:shadow-md rounded-lg p-6 text-left transition duration-300 bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {modif.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{modif.description}</p>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default GererEntreprise;
