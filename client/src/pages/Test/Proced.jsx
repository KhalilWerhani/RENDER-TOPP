import React from "react";
import ChartG from "./ChartG";
import { assets } from "../../assets/assets";
const Proced = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">Procédures Administratives</h1>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Chez <span className="font-semibold text-blue-600">Top-Juridique</span>, nous vous accompagnons dans toutes vos <strong className="text-blue-600">démarches administratives</strong> en garantissant un <strong className="text-blue-600">formalisme</strong> rigoureux et conforme aux exigences du <strong className="text-blue-600">Guichet Unique</strong> et de l'<strong className="text-blue-600">INPI</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nos principales démarches :</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Création d'entreprise via le Guichet Unique</li>
              <li>Modification administrative (adresse, activité, gérant)</li>
              <li>Radiation d'entreprise</li>
              <li>Gestion des formalités INPI</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <ChartG />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center bg-blue-50 p-8 rounded-xl mt-10">
  <div className="md:w-1/2">
    <h3 className="text-2xl font-bold text-blue-700 mb-4">Formaliste dédié à votre réussite</h3>
    <p className="text-gray-700">
      Nos formalistes s'occupent de toutes vos démarches auprès du Guichet Unique pour vous permettre de vous concentrer sur votre activité principale.
    </p>
  </div>
  <div className="md:w-1/2">
    <img src="/images/formaliste-dedie.svg" alt="Formaliste" className="w-full" />
  </div>
</div>


        <div className="mt-12">
          <img src={assets.header_img} alt="Démarches Illustration" className="w-50 rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default Proced;
