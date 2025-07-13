import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import {
  FaUser,
  FaTasks,
  FaCreditCard,
  FaUserTie,
  FaBuilding,
  FaFileAlt
} from 'react-icons/fa';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const SidebarAdmin = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl } = useContext(AppContent);

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
          <h1 className="text-2xl font-bold text-blue-800 mb-10 text-center">Tableau de Bord</h1>
          <ul className="flex flex-col gap-4">
            <li onClick={() => navigate("/admin/dashboard1")} className={`${baseClass} ${isActive("/admin/dashboard1") ? activeClass : inactiveClass}`}>
              <MdDashboard size={20} /> Tableau de Bord
            </li>
            <li onClick={() => navigate("/admin/users")} className={`${baseClass} ${isActive("/admin/users") ? activeClass : inactiveClass}`}>
              <FaUser size={18} /> Liste Clients
            </li>
            <li onClick={() => navigate("/admin/bo/liste")} className={`${baseClass} ${isActive("/admin/bo/liste") ? activeClass : inactiveClass}`}>
              <FaUserTie size={18} /> Liste Back Office
            </li>
            
             <li onClick={() => navigate("/admin/entreprises")} className={`${baseClass} ${isActive("/admin/dossiers") ? activeClass : inactiveClass}`}>
              <FaBuilding size={18} /> Entreprises
            </li>
            <li onClick={() => navigate("/admin/dossiers")} className={`${baseClass} ${isActive("/admin/dossiers") ? activeClass : inactiveClass}`}>
              <FaTasks size={18} /> Projets
            </li>
            <li onClick={() => navigate("/admin/paiements")} className={`${baseClass} ${isActive("/admin/paiement") ? activeClass : inactiveClass}`}>
              <FaCreditCard size={18} /> Paiement
            </li>
            <li onClick={() => navigate("/admin/envoyer-document")} className={`${baseClass} ${isActive("/admin/envoyer-document") ? activeClass : inactiveClass}`}>
              <FaFileAlt size={18} /> Model
            </li>
            
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
