// Nouveau composant AsideBarUser.jsx avec design identique à l'admin
import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard
} from 'react-icons/md';
import {
  FaUser,
  FaFileAlt,
  FaCreditCard,
  FaChartLine,
  FaBuilding,
  FaEnvelopeOpenText,
  FaUserCircle
} from 'react-icons/fa';
import { AppContent } from '../../context/AppContext';

const AsideBarUser = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(AppContent);

  const menuItems = [
    { icon: <MdDashboard size={18} />, label: 'Tableau de bord', path: '/dashboarduser' },
    { icon: <FaUser size={18} />, label: 'Mon profil', path: '/dashboard/profil' },
    { icon: <FaBuilding size={18} />, label: 'Mes entreprises', path: '/dashboard/userentreprise' },
    { icon: <FaFileAlt size={18} />, label: 'Documents', path: '/dashboard/documents' },
    { icon: <FaCreditCard size={18} />, label: 'Paiements', path: '/dashboard/paiement/:id' },
   // { icon: <FaChartLine size={18} />, label: 'Comptabilité', path: '/dashboard/comptabilite' },
    { icon: <FaEnvelopeOpenText size={18} />, label: 'Projets', path: '/dashboard/projets' },
    { icon: <FaFileAlt size={18} />, label: 'Documents Reçus', path: '/dashboard/documentsrece' },
    { icon: <FaFileAlt size={18} />, label: "Centre d'aide", path: '/dashboard/documentsrece' },

    
   // { icon: <FaFileAlt size={18} />, label: 'Messagerie', path: '/dashboard/documentsrece' },
   // { icon: <FaFileAlt size={18} />, label: 'Verifier votre mail', path: '/email-verify' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);
  const baseClass = 'flex items-center gap-3 font-medium cursor-pointer px-4 py-3 rounded-lg transition-all duration-150 text-blue-800';
  const activeClass = 'bg-[#f4d47c] shadow font-semibold';
  const hoverClass = 'hover:bg-[#f4d47c]/60 hover:text-blue-900';
  const inactiveClass = `bg-white ${hoverClass}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 left-0 z-50 transform -translate-y-1/2 bg-[#f4d47c] text-blue-900 p-3 rounded-r-full shadow-xl transition-all hover:bg-blue-100"
      >
        <span className="text-xl font-bold">☰</span>
      </button>

      <div
        className={`fixed pt-15 top-0 left-0 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-72 h-screen bg-white rounded-r-3xl shadow-2xl border-r border-blue-100 px-6 py-10 flex flex-col justify-start">
          <h1 className="text-2xl font-bold text-blue-800 mb-10 text-center">Mon espace</h1>
          <ul className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.path)}
                className={`${baseClass} ${isActive(item.path) ? activeClass : inactiveClass}`}
              >
                {item.icon} {item.label}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 border-t border-gray-200 flex items-center gap-3 text-sm text-gray-600">
            <FaUserCircle className="text-lg" />
            <span>{userData?.name || 'Utilisateur'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AsideBarUser;
