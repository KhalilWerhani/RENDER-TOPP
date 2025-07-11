// src/pages/PaiementCancelled.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PaiementCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-6">
      <div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Paiement annulé</h1>
        <p className="text-gray-600 mb-6">
          Votre paiement a été annulé. Aucune transaction n’a été effectuée.
        </p>
        <Link
          to="/paiement"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
        >
          Réessayer le paiement
        </Link>
      </div>
    </div>
  );
};

export default PaiementCancelled;
