import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { assets } from "../../assets/assets";

const faqs = [
  {
    question: "Qu’est-ce qu’une SARL ?",
    answer:
      "La SARL (Société à Responsabilité Limitée) est une forme de société courante en France, particulièrement adaptée aux petites et moyennes entreprises.",
  },
  {
    question: "Quels sont les avantages et inconvénients d'une SARL ?",
    answer:
      "Avantages : Responsabilité limitée des associés, cadre juridique sécurisant. Inconvénients : Moins de flexibilité que la SAS, formalisme plus rigide.",
  },
  {
    question: "Comment créer une SARL ?",
    answer:
      "La création d’une SARL nécessite la rédaction de statuts, la constitution du capital social, la publication d'une annonce légale et l'immatriculation.",
  },
  {
    question: "Comment fonctionne une SARL ?",
    answer:
      "Elle est dirigée par un ou plusieurs gérants, associés ou non. Les décisions importantes sont prises en assemblée générale.",
  },
  {
    question: "Quelle fiscalité pour une SARL ?",
    answer:
      "La SARL est soumise par défaut à l’impôt sur les sociétés (IS), mais peut, sous conditions, opter pour l’impôt sur le revenu (IR).",
  },
  {
    question: "Comment céder des parts sociales en SARL ?",
    answer:
      "La cession est encadrée : elle nécessite l'accord de la majorité des associés représentant au moins la moitié des parts sociales.",
  },
  {
    question: "Quelles aides à la création pour une SARL ?",
    answer:
      "Les créateurs peuvent bénéficier de dispositifs comme l’ACRE, le NACRE, les aides BPI, ou encore le prêt d’honneur.",
  },
  {
    question: "L'offre Top-Juridique",
    answer:
      "Top-Juridique vous accompagne dans toutes vos démarches de création de SARL avec rigueur et efficacité.",
  },
];

const GuideSarl = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // Optional: you could add animations or track page visit here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-36 px-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center animate__animated animate__fadeIn animate__delay-1s">
          Tout ce que vous devez savoir sur la SARL
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* FAQ Section */}
          <div className="flex-1 space-y-6">
            {faqs.map((faq, index) => (
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
              src={assets.Guide_Picture1}
              alt="Guide SARL"
              className="rounded-2xl shadow-xl object-cover w-full h-[600px] transform transition-all duration-1000 ease-in-out animate__animated animate__zoomIn animate__delay-2s"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105 duration-300">
            Commencer mes démarches
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideSarl;
