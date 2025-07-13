import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";

const faqsSASU = [
  {
    question: "Qu’est-ce qu’une SASU ?",
    answer:
      "La SASU (Société par Actions Simplifiée Unipersonnelle) est une variante de la SAS, mais avec un seul associé, offrant la même souplesse de gestion.",
  },
  {
    question: "Quels sont les avantages et inconvénients d'une SASU ?",
    answer:
      "Avantages : Responsabilité limitée, gestion flexible. Inconvénients : Cotisations sociales sur la rémunération du dirigeant, plus de formalités qu'une entreprise individuelle.",
  },
  {
    question: "Comment créer une SASU ?",
    answer:
      "La création de la SASU suit le même processus que la SAS, mais avec un seul associé. Il faut rédiger les statuts, déposer le capital social et s'immatriculer.",
  },
  {
    question: "Comment fonctionne une SASU ?",
    answer:
      "La SASU est dirigée par un Président, qui est souvent aussi l’associé unique. Le fonctionnement est très flexible et adapté aux besoins de l'associé.",
  },
  {
    question: "Quelle fiscalité pour une SASU ?",
    answer:
      "La SASU est soumise à l'impôt sur les sociétés (IS) par défaut, mais l'associé unique peut opter pour l'impôt sur le revenu (IR) sous certaines conditions.",
  },
  {
    question: "Quels sont les frais de gestion d'une SASU ?",
    answer:
      "Les frais de gestion sont similaires à ceux d'une SAS, mais en tant qu'associé unique, vous serez seul à prendre les décisions et à assumer la gestion.",
  },
  {
    question: "Les aides à la création",
    answer:
      "Les aides à la création sont aussi disponibles pour une SASU, incluant l'ACRE, NACRE, et les prêts d'honneur.",
  },
  {
    question: "L'offre Top-Juridique",
    answer:
      "Top-Juridique vous accompagne dans toutes vos démarches de création de SASU avec le même niveau d'excellence que pour la SAS.",
  },
];

const GuideSasu = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Fade-in or any animation effects can be triggered here
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-36 px-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center animate__animated animate__fadeIn animate__delay-1s">
          Tout ce que vous devez savoir sur la SASU
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* FAQ Section */}
          <div className="flex-1 space-y-6">
            {faqsSASU.map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-lg shadow-md p-5 bg-white transition-all hover:shadow-lg animate__animated animate__fadeIn animate__delay-${index + 1}s`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800"
                >
                  {faq.question}
                  <span
                    className={`text-blue-600 font-bold transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div className="flex-1 flex justify-center items-start">
            <img
              src={assets.Guide_Picture2}
              alt="Guide SASU Illustration"
              className="rounded-2xl shadow-xl object-cover w-full h-[600px] transform transition-all duration-1000 ease-in-out animate__animated animate__zoomIn animate__delay-2s"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="mb-20 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105 duration-300">
            Commencer mes démarches
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideSasu;
