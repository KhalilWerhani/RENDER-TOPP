import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {  useNavigate } from 'react-router-dom'


const MentionsLegales = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto mt-20 px-4 py-8 md:py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">Mentions Légales</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Introduction */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
          <p className="text-gray-700 leading-relaxed text-center">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, 
            voici les informations légales concernant le site top-juridique.
          </p>
        </section>

        {/* Édition du site */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Édition du site</h2>
          <p className="text-gray-800 leading-relaxed">
            Le site <strong className="text-blue-600">top-juridique.com</strong> est édité par :<br />
            [NOM DE VOTRE ENTREPRISE], société immatriculée au Registre du commerce et des sociétés de [VILLE] 
            sous le numéro [NUMERO SIRET], et dont le siège social est situé à :<br />
            [ADRESSE COMPLÈTE DU SIÈGE SOCIAL]<br />
            Numéro de TVA intracommunautaire : [NUMERO TVA]
          </p>
        </section>

        {/* Responsable de publication */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Responsable de publication</h2>
          <p className="text-gray-800 leading-relaxed">[NOM DU RESPONSABLE], [POSITION DANS L'ENTREPRISE]</p>
        </section>

        {/* Hébergeur */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Hébergeur</h2>
          <p className="text-gray-800 leading-relaxed">
            Le site top-juridique.com est hébergé par :<br />
            [NOM DE VOTRE HÉBERGEUR]<br />
            [ADRESSE COMPLÈTE DE L'HÉBERGEUR]<br />
            [TÉLÉPHONE DE CONTACT]<br /><br />
            Les données sont stockées sur des serveurs situés en [PRÉCISER LA LOCALISATION].
          </p>
        </section>

        {/* Contact Section - Dark Blue */}
        <section className="mb-10 bg-blue-900 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-5">Nous contacter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl mt-1">📞</div>
              <div>
                <h3 className="font-medium text-blue-200">Téléphone</h3>
                <p className="text-white">[VOTRE NUMÉRO]</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl mt-1">✉️</div>
              <div>
                <h3 className="font-medium text-blue-200">Email</h3>
                <p className="text-white">[VOTRE EMAIL]</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl mt-1">📮</div>
              <div>
                <h3 className="font-medium text-blue-200">Adresse</h3>
                <p className="text-white">[VOTRE ADRESSE POSTALE]</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            <em>Dernière mise à jour : [DATE]</em><br />
            © {new Date().getFullYear()} top-juridique.com - Tous droits réservés.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;