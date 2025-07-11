import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaFolderOpen,
  FaFolderPlus,
  FaFileAlt,
  FaUserTie,
} from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';

const SidebarBO = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const baseClass = "flex items-center gap-3 font-medium cursor-pointer px-4 py-3 rounded-lg transition-all duration-150 text-blue-800";
  const activeClass = "bg-[#f4d47c] shadow font-semibold";
  const hoverClass = "hover:bg-[#f4d47c]/60 hover:text-blue-900";
  const inactiveClass = `bg-white ${hoverClass}`;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 left-0 z-50 transform -translate-y-1/2 bg-[#f4d47c] text-blue-900 p-3 rounded-r-full shadow-xl transition-all hover:bg-blue-100"
      >
        <span className="text-xl font-bold">☰</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed pt-15 top-0 left-0 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-72 h-screen bg-white rounded-r-3xl shadow-2xl border-r border-blue-100 px-6 py-10 flex flex-col justify-start">
          <h1 className="text-2xl font-bold text-blue-800 mb-10 text-center">Espace collaborateur</h1>
          <ul className="flex flex-col gap-4">
            <li onClick={() => navigate("/bo/dashboard")} className={`${baseClass} ${isActive("/bo/dashboard") ? activeClass : inactiveClass}`}>
              <FaChartBar size={18} /> Tableau de bord
            </li>
            <li onClick={() => navigate("/bo/entreprise")} className={`${baseClass} ${isActive("/bo/entreprise") ? activeClass : inactiveClass}`}>
              <IoIosBusiness size={18} /> Entreprise
            </li>
            <li onClick={() => navigate("/bo/dossiers")} className={`${baseClass} ${isActive("/bo/dossiers") ? activeClass : inactiveClass}`}>
              <FaFolderOpen size={18} /> Tous mes Projets
            </li>
            
            <li onClick={() => navigate("/bo/documents")} className={`${baseClass} ${isActive("/bo/documents") ? activeClass : inactiveClass}`}>
              <FaFileAlt size={18} /> Documents
            </li>
             <li onClick={() => navigate("/bo/envoyer-document")} className={`${baseClass} ${isActive("/bo/envoyer-document") ? activeClass : inactiveClass}`}>
              <FaFileAlt size={18} /> Model
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarBO;
