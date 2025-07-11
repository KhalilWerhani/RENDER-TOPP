import { useContext } from 'react';
import { MdDashboard } from "react-icons/md";
import {
  FaUser, FaTasks, FaCreditCard,
  FaEnvelopeOpenText, FaPlus, FaUserCircle, FaFileAlt
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl } = useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🎯 Fonctions d'affichage selon le rôle
  const adminMenu = (
    <>
      <li onClick={() => navigate("/dashbord")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <MdDashboard /> Admin Dashboard
      </li>
      <li onClick={() => navigate("/dashbord/clients")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaUser /> Liste des utilisateurs
      </li>
      <li onClick={() => navigate("/dashbord/documentsadmin")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaFileAlt /> Liste des Projets 
      </li>
    </>
  );

  const userMenu = (
    <>
      <li onClick={() => navigate("/dashbord")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <MdDashboard /> Tableau de bord
      </li>
      <li onClick={() => navigate("/dashbord/entreprise")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaUser /> Entreprise/Clients
      </li>
      <li onClick={() => navigate("/profil", { state: userData })} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaUserCircle /> Profil
      </li>
      <li className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaTasks /> Projets
      </li>
      <li onClick={() => navigate("/dashbord/documents")} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaFileAlt /> Documents
      </li>
      <li className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaCreditCard /> Paiement
      </li>
      {!userData?.isAccountVerified && (
        <li onClick={sendVerificationOtp} className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
          <FaEnvelopeOpenText /> Vérifier l'e-mail
        </li>
      )}
      <li className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-blue-600">
        <FaPlus /> Ajouter un projet
      </li>
    </>
  );

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md pt-40 p-6 flex flex-col">
      <h1 className="text-xl font-bold text-blue-600 mb-8">Dashboard</h1>
      <ul className="space-y-4">
        {userData?.role === 'admin' ? adminMenu : userMenu}
      </ul>
    </aside>
  );
};

export default Sidebar;
