import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";

const faqs = [
  {
    question: "Qu’est-ce qu’un Auto-Entrepreneur ?",
    answer: "L'auto-entrepreneur est une forme de statut simplifié qui permet à une personne physique de créer et gérer son entreprise facilement."
  },
  {
    question: "Quels sont les avantages et inconvénients d'un Auto-Entrepreneur ?",
    answer: "Avantages : Simplification des démarches, exonération de TVA. Inconvénients : Plafond de chiffre d'affaires, responsabilité personnelle."
  },
  {
    question: "Comment devenir Auto-Entrepreneur ?",
    answer: "Les démarches sont simples : inscription en ligne sur le site officiel, puis obtenir un numéro SIRET pour commencer son activité."
  },
  {
    question: "Quels sont les plafonds de chiffre d'affaires pour un Auto-Entrepreneur ?",
    answer: "Le plafond de chiffre d'affaires pour un Auto-Entrepreneur est de 72 600 € pour les prestations de services et 176 200 € pour la vente de marchandises."
  },
  {
    question: "Quel régime fiscal pour l'Auto-Entrepreneur ?",
    answer: "L'auto-entrepreneur bénéficie du régime micro-fiscal, avec des cotisations sociales calculées en fonction du chiffre d'affaires."
  },
  {
    question: "Quels sont les formalités à accomplir pour devenir Auto-Entrepreneur ?",
    answer: "Il faut déclarer son activité, obtenir un numéro SIRET, et payer ses cotisations sociales mensuellement ou trimestriellement."
  },
  {
    question: "Les aides à la création pour les Auto-Entrepreneurs",
    answer: "Des aides comme l'ACRE, NACRE et les prêts d'honneur peuvent être demandées lors de la création d'une activité en tant qu'auto-entrepreneur."
  },
  {
    question: "L'offre Top-Juridique",
    answer: "Top-Juridique vous accompagne dans la création de votre statut d'auto-entrepreneur, en vous simplifiant toutes les démarches administratives."
  }
];

const GuideAutoEntrepreneur = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [fade, setFade] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Fade-in effect on page load
  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-36 px-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center animate__animated animate__fadeIn animate__delay-1s">
          Tout ce que vous devez savoir sur l'Auto-Entrepreneur
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
               src={assets.Guide_Picture3}
              alt="Guide Auto-Entrepreneur Illustration"
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

export default GuideAutoEntrepreneur;
