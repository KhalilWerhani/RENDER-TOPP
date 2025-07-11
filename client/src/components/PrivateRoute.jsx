import { useContext, useEffect } from 'react';
import { Outlet, useNavigate ,useLocation} from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import AccessDeniedMessage from './AccessDeniedMessage';

const PrivateRoute = ({ allowedRoles = [], deniedRoles = [] }) => {
  const { userData, isLoggedin, showLoginModal, setShowLoginModal,setRedirectAfterLogin } = useContext(AppContent);
  const navigate = useNavigate();


  // Chargement initial 
  /*
  if (userData === undefined && isLoggedin === undefined) {

  // Ouvre la popup dès qu'on détecte que l'utilisateur est non connecté
 /* useEffect(() => {
    if (isLoggedin === false && userData === false) {
      setShowLoginModal(true);
            setRedirectAfterLogin(location.pathname);

    }
  }, [isLoggedin, userData,location]);

  // Si la popup a été fermée sans login → rediriger useEffect(() => {
    if (isLoggedin === false && !showLoginModal) {
      navigate('/');
    }
  }, [isLoggedin, showLoginModal, navigate]);

  // En attente de données d'auth
  if (isLoggedin === undefined || userData === undefined) {

    return <div className="text-center mt-10">Chargement...</div>;
  }

  // Si rôle explicitement interdit
  if (deniedRoles.includes(userData?.role)) {
    return <AccessDeniedMessage />;
  }

  // Si rôle non autorisé
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role)) {
    return <AccessDeniedMessage />;
  }


  // Si allowedRoles est défini et que le rôle n'est pas dans la liste
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return <AccessDeniedMessage />;
  }

  // Accès autorisé*/

  // ✅ On affiche la page normalement (popup gère le blocage)

  return <Outlet />;
};

export default PrivateRoute;
