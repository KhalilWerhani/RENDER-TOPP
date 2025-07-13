import { useContext, useState, useEffect, useRef } from "react";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
} from "react-icons/hi";
import {
  FaUserTie,
  FaRegBell,
  FaPowerOff,
  FaBars,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { io } from "socket.io-client"; // socket temps réel

const NavbarBO = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setIsLoggedin, setuserData } = useContext(AppContent);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const searchRef = useRef();

  const mockSearchResults = [
    "Créer une entreprise individuelle",
    "Fermer une entreprise en ligne",
    "Modèle statuts SASU 2025",
    "Coût création auto-entreprise",
    "Mettre en sommeil une société",
    "Transfert de siège social"
  ];

  const navLinks = [
    {
      label: "Entreprises",
      icon: <FaBars />,
      subMenu: [
        { label: "Créer une entreprise", path: "/admin/entreprises/creer" },
        { label: "Fermer une entreprise", path: "/admin/entreprises/fermer" },
        { label: "Autres", path: "/admin/entreprises/autres" },
      ],
    },
    //{ label: "Créer BO", path: "/admin/bo/creer", icon: <FaUserTie /> },
  ];

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setuserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };



  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = mockSearchResults.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);


  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString("fr-FR");
    if (!acc[date]) acc[date] = [];
    acc[date].push(notif);
    return acc;
  }, {});





  useEffect(() => {
    if (!userData?.id) return; // Early return if no user ID

    const socket = io(backendUrl);

    console.log("Connecting socket for user:", userData.id);
    socket.emit("add-user", userData.id);

    socket.on("new-notification", (notif) => {
      console.log("Received new notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
      toast.info("Nouvelle notification reçue");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?.id, backendUrl]);

  const handleNotificationClick = async (notif) => {
    try {
      await axios.put(`${backendUrl}/api/notifications/read/${notif._id}`);
      navigate(notif.link || "/admin");
      setNotifications((prev) =>
        prev.map((n) => n._id === notif._id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      toast.error("Erreur ouverture notification");
    }
  };

  console.log("UserData object:", userData);
  console.log("Using user ID:", userData?.id);
  console.log("Backend URL:", backendUrl);


  const markAllAsRead = async () => {
    try {
      if (!userData?.id) {
        toast.error("User ID not available");
        return;
      }

      await axios.put(`${backendUrl}/api/notifications/read-all/${userData.id}`);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      toast.error("Erreur lors du marquage des notifications.");
    }
  };
  // Update your useEffect for fetching notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userData?.id) return; // Check for userData.id instead of _id

        console.log("Fetching notifications for user:", userData.id);
        const { data } = await axios.get(`${backendUrl}/api/notifications/${userData.id}`);
        console.log("Notifications response:", data);

        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Erreur chargement notifications :", err);
        toast.error("Erreur lors du chargement des notifications");
      }
    };

    fetchNotifications();
  }, [userData?.id, backendUrl]); // Use id and include backendUrl in dependencies



  return (
    <div className="bg-[#f4d47c] shadow-md w-full fixed top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <img
          onClick={() => navigate("/admin")}
          src={assets.logotopjuridique}
          alt="Logo"
          className="w-44 cursor-pointer"
        />

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item, index) => (
            <div key={index} className="relative">
              {item.subMenu ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-2 text-base font-medium text-gray-800 hover:text-blue-700"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                  <div
                    className={`absolute top-full mt-2 left-0 bg-white border rounded-md shadow-md w-64 z-40 transition-all duration-200 origin-top ${openDropdown === item.label ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                      }`}
                  >
                    {item.subMenu.map((sub, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigate(sub.path);
                          setOpenDropdown(null);
                        }}
                        className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                      >
                        {sub.label}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-base font-medium text-gray-800 hover:text-blue-700"
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </div>
          ))}

          {/* Notification */}
          <div className="relative">
            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative flex items-center justify-center w-10 h-10 rounded-md border border-blue-600 bg-white hover:bg-blue-50 transition">
              <FaRegBell className="text-xl text-blue-800" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border shadow-lg rounded-lg z-50 overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b font-semibold text-sm text-gray-700">
                  <span>Derniers projets créés</span>
                  <button onClick={markAllAsRead} className="text-blue-600 text-xs hover:underline">
                    Tout marquer comme lu
                  </button>
                </div>
                <ul className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((dossier) => (
                      <li
                        key={dossier._id}
                        onClick={async () => {
                          try {
                            await axios.put(`${backendUrl}/api/admin/notifications/mark-as-read/${dossier._id}`, {}, { withCredentials: true });
                            setNotifications(prev => prev.map(notif => notif._id === dossier._id ? { ...notif, isRead: true } : notif));
                            navigate(`/admin/dossier/${dossier._id}`);
                            setShowNotifDropdown(false);
                          } catch (err) {
                            console.error("Erreur lors du marquage comme lu :", err);
                          }
                        }}
                        className={`px-4 py-3 hover:bg-blue-50 text-sm cursor-pointer border-b ${dossier.isRead ? 'text-gray-500' : 'text-gray-800 font-medium'
                          }`}
                      >
                        <div className="font-medium">
                          <span className="text-blue-800">{dossier.sender?.name || "Client"}</span> • {dossier.message}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(dossier.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>

                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-gray-500">Aucune notification</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Avatar */}
          {userData && (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "user" ? null : "user")}
                className="w-10 h-10 flex items-center justify-center border-2 border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 transition"
              >
                {userData.name?.charAt(0).toUpperCase() || "U"}
              </button>
              <div className={`absolute right-0 mt-3 bg-white border rounded-xl shadow-xl z-50 w-44 transition-all duration-200 origin-top-right ${openDropdown === "user" ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                }`}>
                <button onClick={() => navigate("/admin/profile")} className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700">
                  Profil
                </button>
                <button onClick={() => navigate("/admin/espace")} className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700">
                  Mon espace
                </button>
                <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600">
                  Déconnexion
                </button>
              </div>
            </div>
          )}

          {/* Recherche */}
          <button
            onClick={() => setShowSearchBar(prev => !prev)}
            className="w-10 h-10 flex items-center justify-center border-2 border-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            <FiSearch className="text-blue-600 text-lg" />
          </button>
        </div>

        <button className="md:hidden text-2xl text-blue-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>
    </div>
  );
};

export default NavbarBO;