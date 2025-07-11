import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#f4d47c] p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div>
          <img src={assets.logotopjuridique} alt="Logo" className="w-36 mb-4" />
          <p className="text-gray-900 text-sm">
            Plateforme spécialisée dans la création, modification et gestion juridique des entreprises en France.
            <br className="mt-5" /> Simplifiez vos démarches avec nous.
          </p>
          <button className="bg-[#002855] hover:bg-[#1b3f73] text-white text-sm font-semibold px-4 py-2 mt-4 rounded-full transition">
            Parler à un conseiller
          </button>
        </div>

        {/* Liens utiles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liens utiles</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-blue-600">Accueil</a></li>
            <li><a href="#" className="hover:text-blue-600">Nos Services</a></li>
            <li><a href="#" className="hover:text-blue-600">Créer une entreprise</a></li>
            <li><a href="#" className="hover:text-blue-600">Nous contacter</a></li>
          </ul>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <p className="text-sm text-gray-900">Email : contact@top-juridique.fr</p>
          <p className="text-sm text-gray-900 mt-2">Téléphone : +33 07 58 42 11 38</p>
          <p className="text-sm text-gray-900 mt-2">SIRET : 940 849 987 00026</p>
          <p className="text-sm text-gray-900 mt-2">Activité : Conseil - 7022Z</p>
          <p className="text-sm text-gray-900 mt-2">Adresse : 30 Boulevard de Sébastopol, 75004 Paris</p>
        </div>

        {/* Mentions légales + Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
          <p onClick={() => navigate('/mentionslegales')} className="cursor-pointer hover:text-blue-600 text-sm">Mentions légales</p>
          <p onClick={() => navigate('/conditionsenerales')} className="cursor-pointer hover:text-blue-600 text-sm mt-2">Conditions générales</p>
          <p className="cursor-pointer hover:text-blue-600 text-sm mt-2">CGU avocats</p>
          <p className="cursor-pointer hover:text-blue-600 text-sm mt-2">CGV</p>
          <p className="cursor-pointer hover:text-blue-600 text-sm mt-2">Charte vie privée</p>

          {/* Réseaux sociaux directement sous charte */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-900 hover:text-blue-600"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-900 hover:text-blue-600"><FaLinkedin size={25} /></a>
              <a href="#" className="text-gray-900 hover:text-blue-600"><FaYoutube size={26} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="mt-8 text-center text-sm text-gray-900">
        © 2025 TOP-JURIDIQUE — Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
