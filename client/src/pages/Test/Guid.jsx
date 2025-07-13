import React, { useState } from "react";

const faqs = [
  {
    question: "Qu’est-ce qu’une SARL ?",
    answer: "La SARL (Société à Responsabilité Limitée) est une forme juridique très répandue adaptée aux projets entrepreneuriaux nécessitant une structure stable et encadrée."
  },
  {
    question: "Quels sont les avantages et inconvénients d'une SARL ?",
    answer: "Avantages : Responsabilité limitée des associés, régime social protecteur. Inconvénients : Formalisme plus lourd que pour d'autres statuts."
  },
  {
    question: "Qu'est-ce qu'une SARL de famille ?",
    answer: "C'est une SARL constituée exclusivement entre membres d'une même famille, permettant d'opter pour l'imposition sur le revenu."
  },
  {
    question: "Comment créer une SARL ?",
    answer: "La création d'une SARL passe par la rédaction des statuts, le dépôt du capital social et l'enregistrement auprès du Guichet Unique."
  },
  {
    question: "Comment fonctionne une SARL ?",
    answer: "Elle est dirigée par un ou plusieurs gérants. Les décisions importantes sont prises en assemblée générale."
  },
  {
    question: "Quelle fiscalité en SARL ?",
    answer: "Par défaut, une SARL est soumise à l'impôt sur les sociétés (IS), mais certaines peuvent opter pour l'impôt sur le revenu (IR) dans des cas précis."
  },
  {
    question: "Comment se passe la cession de parts sociales en SARL ?",
    answer: "La cession nécessite l'agrément des autres associés selon des formalités précises inscrites dans les statuts."
  },
  {
    question: "Les aides à la création",
    answer: "Diverses aides existent, comme l'ACRE, le NACRE ou les dispositifs de financement par la BPI France."
  },
  {
    question: "L'offre Top-Juridique",
    answer: "Top-Juridique vous accompagne dans toutes vos démarches administratives de création, modification ou radiation de SARL, avec un formalisme rigoureux."
  }
];

const Guid = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">Tout ce que vous devez savoir sur la SARL</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-yellow-100 rounded-lg shadow p-5 bg-white">
              <button
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800"
                onClick={() => toggle(index)}
              >
                {faq.question}
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="mt-4 text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guid;
