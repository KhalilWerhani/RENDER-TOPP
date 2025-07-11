import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client"; // ← ajouter cette ligne

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setuserData] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [socket, setSocket] = useState(null); // ← socket state


  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.succes) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(data?.message || "Erreur d'authentification");
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.succes) {
        setuserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur lors du chargement de l'utilisateur");
    }
  };
 useEffect(() => {
  if (userData && (userData._id || userData.id)) {
    const userId = userData._id || userData.id;

    const newSocket = io(backendUrl, {
      withCredentials: true
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }
}, [userData]);

// Ce useEffect enregistre l'utilisateur auprès du serveur
useEffect(() => {
  if (socket && userData && (userData._id || userData.id)) {
    const userId = userData._id || userData.id;
    socket.emit("register", userId);
    console.log("✅ Socket enregistré pour l'utilisateur :", userId);
  }
}, [socket, userData]);
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setuserData,
    getUserData,
    showLoginModal,
    setShowLoginModal,
    redirectAfterLogin,
    setRedirectAfterLogin,
    socket

  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
