import React, { useContext } from 'react';
import Navbar from "../../components/Navbar"
import { useNavigate } from 'react-router-dom';


const FermerEntreprise = () => {
  const navigate = useNavigate();
  

  const fermetureOptions = [
    {
      label: "Radiation auto-entrepreneur",
      value: "RADIATION_AUTO_ENTREPRENEUR",
      description: "Cessation définitive d'activité pour auto-entrepreneur",
      route: "/formulaire/radiationautoentrepreneur",
    },
    {
      label: "Mise en sommeil",
      value: "MISE_EN_SOMMEIL",
      description: "Suspension temporaire de l’activité (max 2 ans)",
      route: "/formulaire/miseensomeil",
    },
    {
      label: "Dissolution & liquidation",
      value: "DISSOLUTION_LIQUIDATION",
      description: "Fermeture volontaire avec liquidation amiable",
      route: "/formulaire/fermer-societe",
    },
    {
      label: "Dépôt de bilan",
      value: "DEPOT_DE_BILAN",
      description: "Déclaration de cessation de paiement (tribunal)",
      route: "/formulaire/bilan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 bg-container mx-auto white rounded-lg shadow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-10">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Fermeture d’entreprise</h1>
            <p className="text-gray-600 text-sm">
              Sélectionnez la démarche qui correspond à votre situation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fermetureOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => navigate(option.route)}
                className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{option.label}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FermerEntreprise;
