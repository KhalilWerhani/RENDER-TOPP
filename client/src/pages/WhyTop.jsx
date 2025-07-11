import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { assets } from '../assets/assets';

const WhyTop = () => {
  const reasons = [
    {
      title: "Soyez bien accompagné",
      description:
        "Nos experts sont à votre écoute à chaque étape pour garantir le succès de toutes vos démarches juridiques.",
      icon: assets.casque_bg, // image path
      bg: "bg-lime-50",
      
    },
    {
      title: "Gagnez du temps",
      description:
        "Notre plateforme simplifie toutes les formalités pour vous permettre d’avancer efficacement, sans délai inutiles.",
      icon: assets.chrono_bg,
      bg: "bg-blue-50",
     
    },
    {
      title: "Développez votre entreprise",
      description:
        "Accédez à des services juridiques qui vous aident à structurer et à faire prospérer votre entreprise.",
      icon: assets.lampe_bg,
      bg: "bg-yellow-50",
      
    }
  ];

  return (
    <>
      <section className="bg-white py-20 px-6 sm:px-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Pourquoi choisir <span className="text-blue-700">TOP-JURIDIQUE</span> ?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`${reason.bg} rounded-2xl p-8 shadow-md flex flex-col justify-between hover:shadow-lg transition-all`}
            >
              <div className="flex flex-col items-center">
                <img src={reason.icon} alt={reason.title} className="w-25 h-25 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{reason.title}</h3>
                <p className="text-gray-700 text-base text-center">{reason.description}</p>
              </div>
              
            </div>
          ))}
        </div>
      </section>
        <section className="bg-yellow-50 w-full mt-20 py-24 px-6 sm:px-12">
  <h2 className="text-4xl font-bold mb-6 text-center text-gray-900">
    Lancez-vous simplement, à votre rythme,
    <br className="hidden sm:block" /> avec un vrai soutien.
  </h2>
  <p className="text-center text-gray-700 mb-12 text-lg max-w-4xl mx-auto">
    En toute sérénité et au rythme qui vous convient, bénéficiez d’un accompagnement efficace
    dans toutes vos procédures et démarches administratives.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {/* Offre 1 */}
    <div className="bg-blue-50 rounded-2xl p-8 shadow-md text-center flex flex-col">
      <div className="flex justify-center mb-4">
        <span className="bg-blue-600 text-white px-4 py-1  rounded-full text-sm font-semibold">
          Offre du moment
        </span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">790€</div>
      <p className="text-lg font-bold text-gray-900 mb-4">Créer votre entreprise</p>
      <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Interview et conseils</li>
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Rédaction et siège social des statuts</li>
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Déclaration et vérification des dossiers</li>
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Déclaration auprès des services légaux</li>
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Publication aux Annonces Légales</li>
        <li className="flex gap-2"><HiCheckCircle className="text-blue-600 mt-1" /> Accès à un outil de suivi</li>
      </ul>
      <button className="bg-blue-600 text-white py-2 rounded-full font-semibold mt-2 hover:bg-blue-700 transition">
        JE ME LANCE
      </button>
    </div>

    {/* Offre 2 */}
    <div className="bg-yellow-50 rounded-2xl p-8 shadow-md text-center flex flex-col">
      <div className="flex justify-center mb-4">
        <span className="bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Offre du moment
        </span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">950€</div>
      <p className="text-lg font-bold text-gray-900 mb-4">Modification administrative</p>
      <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
        <li className="flex gap-2"><HiCheckCircle className="text-yellow-500 mt-1" /> Définition des modifications souhaitées</li>
        <li className="flex gap-2"><HiCheckCircle className="text-yellow-500 mt-1" /> Réduction et vérification des dossiers</li>
        <li className="flex gap-2"><HiCheckCircle className="text-yellow-500 mt-1" /> Déclaration auprès des services légaux</li>
        <li className="flex gap-2"><HiCheckCircle className="text-yellow-500 mt-1" /> Publication aux Annonces Légales</li>
        <li className="flex gap-2"><HiCheckCircle className="text-yellow-500 mt-1" /> Accès à un outil de suivi</li>
      </ul>
      <button className="bg-yellow-400 text-white py-2 rounded-full mt-8 font-semibold hover:bg-yellow-500 transition">
        JE ME LANCE
      </button>
    </div>

    {/* Offre 3 */}
    <div className="bg-cyan-50 rounded-2xl p-8 shadow-md text-center flex flex-col">
      <div className="flex justify-center mb-4">
        <span className="bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Offre du moment
        </span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">750€</div>
      <p className="text-lg font-bold text-gray-900 mb-4">Fermer votre entreprise</p>
      <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Étude de vos options</li>
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Déclaration de cessation légale</li>
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Rédaction et vérification des dossiers</li>
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Constat de liquidation partagé</li>
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Publication aux Annonces Légales</li>
        <li className="flex gap-2"><HiCheckCircle className="text-cyan-600 mt-1" /> Prise à un outil de suivi</li>
      </ul>
      <button className="bg-cyan-600 text-white py-2 rounded-full font-semibold hover:bg-cyan-700 transition">
        JE ME LANCE
      </button>
    </div>
  </div>
</section>
    </>
  );
};

export default WhyTop;
