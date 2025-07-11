import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import { AppContent } from '../context/AppContext';

const LoginModal = () => {
  const {
    showLoginModal,
    setShowLoginModal,
    lastRequestedPath,
    setLastRequestedPath
  } = useContext(AppContent);

  const navigate = useNavigate();

  if (!showLoginModal) return null;

  const handleClose = () => {
    setShowLoginModal(false);
    setLastRequestedPath(null);
    navigate('/'); // Redirection vers Home si fermeture sans login
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate(lastRequestedPath || '/');
    setLastRequestedPath(null);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-32">
      {/* Overlay flou */}
      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
        onClick={handleClose}
      ></div>

      {/* Contenu modal */}
      <div className="relative z-50 bg-white rounded-xl shadow-lg p-1 w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-w-3xl">
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginModal;
