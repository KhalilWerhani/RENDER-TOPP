import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CheckCircleIcon, ArrowRightIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";

const Validation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dossierId = new URLSearchParams(location.search).get("dossierId");
  const modificationId = new URLSearchParams(location.search).get("modificationId");
  const reference = dossierId || modificationId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto py-12 mt-19 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">Dossier enregistré avec succès</h2>
          <p className="mt-2 text-sm text-gray-500">
            Référence: <span className="font-medium">{reference}</span>
          </p>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <ClockIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Prochaines étapes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Notre équipe juridique traite votre dossier avec la plus grande attention.
              </p>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Analyse des documents par un expert juridique
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Notification par email à chaque étape importante
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <ArrowRightIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Accès au suivi en temps réel dans votre espace client
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/dashboarduser")}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Accéder à mon espace client
            <ArrowRightIcon className="ml-2 -mr-1 w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Pour toute question, contactez notre service client.</p>
        </div>
      </div>
    </div>
  );
};

export default Validation;