import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ConditionsGenerales = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mt-20 mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">Conditions Générales d'Utilisation</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 italic">Date de dernière mise à jour : 2 septembre 2024</p>
        </div>

        {/* Introduction */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Bienvenue sur top-juridique.com !</h2>
          <p className="text-gray-700 leading-relaxed">
            TOP-JURIDIQUE SAS (« TOP-JURIDIQUE ») fournit, sur le site Internet top-juridique.com (le « Site »), les services suivants (les « Services ») :
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
            <li>Mise à disposition de modèles d'actes juridiques et administratifs</li>
            <li>Accomplissement de formalités administratives</li>
            <li>Service d'information juridique documentaire</li>
            <li>Mise en relation avec des professionnels du droit</li>
            <li>Services de gestion de propriété intellectuelle</li>
          </ul>
        </section>

        {/* Article 1 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 1. Objet</h2>
          <p className="text-gray-800 leading-relaxed">
            Les présentes conditions générales d'utilisation (les « CGU ») ont pour objet de définir les modalités de mise à disposition des Services et leurs conditions d'utilisation par l'Utilisateur.
          </p>
        </section>

        {/* Article 2 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 2. Acceptation des CGU</h2>
          <p className="text-gray-800 leading-relaxed">
            L'accès aux Services par l'Utilisateur vaut acceptation sans réserve des présentes CGU. L'Utilisateur reconnaît avoir pris connaissance des CGU et les accepter en cochant la case prévue à cet effet avant la validation de sa commande.
          </p>
        </section>

        {/* Article 3 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 3. Accès aux Services</h2>
          <p className="text-gray-800 leading-relaxed">
            Les Services sont accessibles gratuitement pour la simple consultation du Site. L'accès à certains Services nécessite la création d'un compte et peut être payant.
          </p>
        </section>

        {/* Article 4 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 4. Création du compte</h2>
          <p className="text-gray-800 leading-relaxed">
            Pour accéder à certains Services, l'Utilisateur doit créer un compte en renseignant les informations demandées. L'Utilisateur garantit l'exactitude des informations fournies.
          </p>
        </section>

        {/* Article 5 - Highlighted */}
        <section className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 5. Description des Services</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium text-blue-800">5.1 Modèles juridiques</h3>
              <p className="text-gray-700 mt-2">
                TOP-JURIDIQUE met à disposition des modèles d'actes juridiques que l'Utilisateur peut personnaliser via des questionnaires dynamiques.
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium text-blue-800">5.2 Formalités administratives</h3>
              <p className="text-gray-700 mt-2">
                TOP-JURIDIQUE peut accomplir pour le compte de l'Utilisateur des formalités auprès des administrations compétentes.
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium text-blue-800">5.3 Information juridique</h3>
              <p className="text-gray-700 mt-2">
                Service documentaire fournissant des informations juridiques générales, ne constituant pas un conseil juridique personnalisé.
              </p>
            </div>
          </div>
        </section>

        {/* Article 6 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 6. Prix et paiement</h2>
          <p className="text-gray-800 leading-relaxed">
            Les prix des Services sont indiqués en euros toutes taxes comprises. Le paiement s'effectue en ligne par carte bancaire ou virement.
          </p>
        </section>

        {/* Article 7 - Important Note */}
        <section className="mb-8 bg-blue-900 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Article 7. Limitations de responsabilité</h2>
          <p className="mb-4">
            TOP-JURIDIQUE n'est pas un cabinet d'avocats et ne fournit pas de conseil juridique. Les Services ne sauraient se substituer à une consultation avec un professionnel du droit.
          </p>
          <p>
            TOP-JURIDIQUE met en œuvre tous les moyens pour assurer la qualité de ses Services mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations fournies.
          </p>
        </section>

        {/* Article 8 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 8. Propriété intellectuelle</h2>
          <p className="text-gray-800 leading-relaxed">
            Tous les éléments du Site (textes, images, logiciels, etc.) sont la propriété exclusive de TOP-JURIDIQUE ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.
          </p>
        </section>

        {/* Article 9 */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 9. Données personnelles</h2>
          <p className="text-gray-800 leading-relaxed">
            Les données personnelles collectées sont traitées conformément à notre Politique de Confidentialité. L'Utilisateur dispose d'un droit d'accès, de rectification et d'opposition.
          </p>
        </section>

        {/* Article 10 */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Article 10. Modifications</h2>
          <p className="text-gray-800 leading-relaxed">
            TOP-JURIDIQUE se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront applicables dès leur mise en ligne sur le Site.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mb-10 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Pour toute question</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">✉️</div>
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">contact@top-juridique.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">📞</div>
              <div>
                <h3 className="font-medium text-gray-700">Téléphone</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm border-t pt-6">
          <p>© {new Date().getFullYear()} top-juridique.com - Tous droits réservés</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConditionsGenerales;