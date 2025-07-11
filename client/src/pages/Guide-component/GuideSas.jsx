import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";

const faqs = [
  {
    question: "Qu’est-ce qu’une SAS ?",
    answer: "La SAS (Société par Actions Simplifiée) est une structure juridique souple et adaptée aux projets à plusieurs associés ou aux levées de fonds."
  },
  {
    question: "Quels sont les avantages et inconvénients d'une SAS ?",
    answer: "Avantages : Flexibilité de fonctionnement, responsabilité limitée. Inconvénients : Coûts de création et de gestion plus élevés."
  },
  {
    question: "Comment créer une SAS ?",
    answer: "La création passe par la rédaction de statuts personnalisés, le dépôt du capital social et l'immatriculation auprès du Guichet Unique."
  },
  {
    question: "Comment fonctionne une SAS ?",
    answer: "Elle est dirigée par un Président (obligatoire) et éventuellement d'autres organes de direction selon les statuts définis."
  },
  {
    question: "Quelle fiscalité pour une SAS ?",
    answer: "La SAS est en principe soumise à l’impôt sur les sociétés (IS). Sous certaines conditions, elle peut opter temporairement pour l'impôt sur le revenu (IR)."
  },
  {
    question: "Comment se passe la cession d'actions en SAS ?",
    answer: "La cession est plus souple qu’en SARL, mais il est possible de prévoir des clauses d'agrément dans les statuts."
  },
  {
    question: "Les aides à la création",
    answer: "Comme pour la SARL, des aides sont disponibles : ACRE, NACRE, BPI France, prêt d'honneur, etc."
  },
  {
    question: "L'offre Top-Juridique",
    answer: "Top-Juridique vous accompagne dans toutes vos démarches de création de SAS avec un formalisme irréprochable."
  }
];

const GuideSas = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [fade, setFade] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-36 px-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center animate__animated animate__fadeIn animate__delay-1s">
          Tout ce que vous devez savoir sur la SAS
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: FAQ Section */}
          <div className="flex-1 space-y-6">
            {faqs.map((faq, index) => (
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
              src={assets.Guide_Picture1}
              alt="Guide SAS Illustration"
              className="rounded-2xl shadow-xl object-cover w-full h-[600px] transform transition-all duration-1000 ease-in-out animate__animated animate__fadeIn animate__delay-2s animate__zoomIn"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="mb-15 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105 duration-300">
            Commencer mes démarches
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideSas;
