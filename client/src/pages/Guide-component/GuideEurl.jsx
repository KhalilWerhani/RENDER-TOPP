import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";

const faqsEURL = [
  {
    question: "Qu’est-ce qu’une EURL ?",
    answer: "L'EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est une forme juridique d'entreprise individuelle, où l'associé unique bénéficie d'une responsabilité limitée."
  },
  {
    question: "Quels sont les avantages et inconvénients d'une EURL ?",
    answer: "Avantages : Responsabilité limitée, gestion simplifiée, fiscalité flexible. Inconvénients : L'associé unique doit gérer seul l'entreprise, cotisations sociales élevées sur la rémunération du dirigeant."
  },
  {
    question: "Comment créer une EURL ?",
    answer: "La création de l'EURL nécessite la rédaction des statuts, le dépôt du capital social et l'immatriculation de l'entreprise au registre du commerce et des sociétés."
  },
  {
    question: "Comment fonctionne une EURL ?",
    answer: "L'EURL est gérée par un gérant, qui est aussi l'associé unique dans la plupart des cas. L'entreprise a une grande autonomie de gestion."
  },
  {
    question: "Quelle fiscalité pour une EURL ?",
    answer: "L'EURL est soumise par défaut à l'impôt sur les sociétés (IS), mais l'associé unique peut choisir l'impôt sur le revenu (IR) sous certaines conditions."
  },
  {
    question: "Quels sont les frais de gestion d'une EURL ?",
    answer: "Les frais de gestion sont relativement simples, bien que l'EURL nécessite la déclaration de la rémunération du gérant et de ses cotisations sociales."
  },
  {
    question: "Les aides à la création",
    answer: "Les aides pour la création d'une EURL incluent l'ACRE, NACRE, et d'autres financements publics pour les entrepreneurs individuels."
  },
  {
    question: "L'offre Top-Juridique",
    answer: "Top-Juridique vous accompagne dans la création de votre EURL, en vous fournissant un accompagnement juridique complet pour respecter les formalités."
  }
];

const GuideEurl = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [fade, setFade] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-36 px-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center animate__animated animate__fadeIn animate__delay-1s">
          Tout ce que vous devez savoir sur l'EURL
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: FAQ Section */}
          <div className="flex-1 space-y-6">
            {faqsEURL.map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-lg shadow-md p-5 bg-white transition-all hover:shadow-lg animate__animated animate__fadeIn animate__delay-${index + 1}s`}
              >
                <button
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800"
                  onClick={() => toggle(index)}
                >
                  {faq.question}
                  <span
                    className={`text-blue-600 font-bold transform transition-all duration-300 ${
                      openIndex === index ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Illustration Image */}
          <div className="flex-1 flex justify-center items-start">
            <img
              src={assets.Guide_Picture5}
              alt="Guide EURL Illustration"
              className="rounded-2xl shadow-xl object-cover w-full h-[600px] transform transition-all duration-1000 ease-in-out animate__animated animate__fadeIn animate__delay-2s animate__zoomIn"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="mb-20 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105 duration-300">
            Commencer mes démarches
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideEurl;
