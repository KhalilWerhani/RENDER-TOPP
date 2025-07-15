import { useContext, useState, useEffect, useRef } from "react";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3, HiOutlineX, HiSearch } from "react-icons/hi";
import { FaUserTie, FaRegBell, FaBars, FaBuilding } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setIsLoggedin, setuserData } = useContext(AppContent);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef();

  // Brand colors
  const primaryColor = "blue-800";
  const accentColor = "#f4d47c";
  const lightAccent = "#f8f0d0";
  const darkAccent = "#d9b945";

  const navLinks = [
    {
      label: "Entreprises",
      icon: <FaBuilding className="text-lg" />,
      subMenu: [
        { label: "Créer une entreprise", path: "/admin/entreprises/creer" },
        { label: "Fermer une entreprise", path: "/admin/entreprises/fermer" },
        { label: "Autres", path: "/admin/entreprises/autres" },
      ],
    },
  ];

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setuserData(null);
        navigate("/");
        toast.success("Déconnexion réussie");
      }
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString("fr-FR");
    if (!acc[date]) acc[date] = [];
    acc[date].push(notif);
    return acc;
  }, {});

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!userData?.id) return;

    const socket = io(backendUrl);
    socket.emit("add-user", userData.id);

    socket.on("new-notification", (notif) => {
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
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error("Erreur ouverture notification");
    }
  };

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userData?.id) return;
        const { data } = await axios.get(`${backendUrl}/api/notifications/${userData.id}`);
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Erreur chargement notifications :", err);
        toast.error("Erreur lors du chargement des notifications");
      }
    };
    fetchNotifications();
  }, [userData?.id, backendUrl]);

  return (
    <header className={`bg-white shadow-md w-full fixed top-0 z-50 border-b border-gray-100`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/admin/dashboard1")}
            className="flex items-center cursor-pointer"
          >
            <img
              src={assets.logotopjuridique}
              alt="Logo"
              className="h-10"
            />
            
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Main Nav Links */}
            {navLinks.map((item, index) => (
              <div key={index} className="relative">
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-800 hover:bg-[${lightAccent}] transition-colors group`}
                >
                  <span className={`group-hover:text-[${darkAccent}]`}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  <motion.span
                    animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                    className="text-gray-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-1 left-0 bg-white border border-gray-200 shadow-lg rounded-lg z-40 w-56 overflow-hidden`}
                    >
                      {item.subMenu.map((sub, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            navigate(sub.path);
                            setOpenDropdown(null);
                          }}
                          className={`px-4 py-2.5 text-sm text-gray-700 hover:bg-[${lightAccent}] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors`}
                        >
                          {sub.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Search Bar */}
            <div className="relative mx-2 lg:mx-4">
              <form onSubmit={handleSearch} className="relative">
                <HiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className={`pl-10 pr-4 py-2 rounded-full bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${darkAccent}] w-48 lg:w-64 transition-all duration-300`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Notifications */}
            <div className="relative" ref={searchRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative p-2 rounded-full hover:bg-[${lightAccent}] transition-colors`}
                aria-label="Notifications"
              >
                <IoMdNotificationsOutline className="text-xl text-gray-700" />
                {notifications?.some((n) => !n.isRead) && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {notifications.filter((n) => !n.isRead).length}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden"
                  >
                    <div className={`flex justify-between items-center p-3 border-b bg-[${lightAccent}]`}>
                      <span className="font-semibold text-gray-700">Notifications</span>
                      <button
                        onClick={markAllAsRead}
                        className={`text-[${darkAccent}] text-sm hover:underline focus:outline-none`}
                      >
                        Tout marquer comme lu
                      </button>
                    </div>

                    <ul className="max-h-96 overflow-y-auto">
                      {notifications && notifications.length > 0 ? (
                        Object.entries(groupedNotifications).map(([date, notifs]) => (
                          <li key={date}>
                            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 font-semibold border-b">
                              {date}
                            </div>
                            {notifs.map((notif) => (
                              <motion.div
                                key={notif._id}
                                whileHover={{ backgroundColor: lightAccent }}
                                onClick={() => handleNotificationClick(notif)}
                                className={`px-4 py-3 text-sm cursor-pointer border-b ${
                                  notif.isRead
                                    ? "text-gray-500"
                                    : `text-gray-800 font-medium bg-[${lightAccent}]`
                                }`}
                              >
                                <div className="flex items-start">
                                  <div
                                    className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                                      notif.isRead ? "bg-gray-400" : `bg-[${darkAccent}]`
                                    }`}
                                  ></div>
                                  <div className="w-full">
                                    <div className="font-medium">
                                      {notif.message}
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-xs text-gray-500">
                                        {notif.sender?.name || "Utilisateur"}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(notif.createdAt).toLocaleTimeString("fr-FR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-6 text-center text-gray-500">
                          Aucune notification
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setOpenDropdown(openDropdown === "user" ? null : "user")}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold shadow-sm border border-[${darkAccent}]`}
                  style={{ color: darkAccent }}
                >
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </motion.button>

              <AnimatePresence>
                {openDropdown === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200`}
                  >
                    <div className={`px-4 py-3 border-b bg-[${lightAccent}]`}>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {userData?.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{userData?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/admin/profile");
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[${lightAccent}] transition-colors flex items-center`}
                    >
                      <FaUserTie className="inline mr-2" />
                      Mon profil
                    </button>
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard1");
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[${lightAccent}] transition-colors flex items-center`}
                    >
                      <FaBuilding className="inline mr-2" />
                      Tableau de bord
                    </button>
                    <button
                      onClick={logout}
                      className={`block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t flex items-center`}
                    >
                      <RiLogoutCircleRLine className="inline mr-2" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full hover:bg-[${lightAccent}] transition-colors`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <HiOutlineX className="text-2xl text-gray-700" />
            ) : (
              <HiOutlineMenuAlt3 className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4">
              {/* User Info */}
              <div className={`flex items-center space-x-4 mb-6 p-4 bg-[${lightAccent}] rounded-lg`}>
                <div
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold shadow-sm border"
                  style={{ borderColor: darkAccent, color: darkAccent }}
                >
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium">{userData?.name}</p>
                  <p className="text-sm text-gray-600">{userData?.email}</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <form onSubmit={handleSearch} className="relative">
                  <HiSearch className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className={`w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${darkAccent}]`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navLinks.map((item, index) => (
                  <div key={index} className="mb-1">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-[${lightAccent}] rounded-lg transition-colors`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3" style={{ color: darkAccent }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                      <motion.span
                        animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.span>
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subMenu.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              navigate(sub.path);
                              setMobileMenuOpen(false);
                            }}
                            className={`block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[${lightAccent}] rounded-lg transition-colors`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Notifications */}
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-[${lightAccent}] rounded-lg transition-colors`}
                >
                  <div className="flex items-center">
                    <IoMdNotificationsOutline
                      className="mr-3"
                      style={{ color: darkAccent }}
                    />
                    Notifications
                  </div>
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div
                    className="ml-8 mt-1 mb-4 border-l-2 pl-2"
                    style={{ borderColor: darkAccent }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            handleNotificationClick(notif);
                            setMobileMenuOpen(false);
                          }}
                          className={`px-3 py-2.5 mb-1 text-sm rounded-lg cursor-pointer ${
                            notif.isRead
                              ? "text-gray-500"
                              : `text-gray-800 font-medium bg-[${lightAccent}]`
                          }`}
                        >
                          <div className="font-medium">{notif.message}</div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{userData?.name || "Utilisateur"}</span>
                            <span>
                              {new Date(notif.createdAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2.5 text-sm text-gray-500">
                        Aucune notification
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Links */}
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-[${lightAccent}] rounded-lg transition-colors`}
                >
                  <FaUserTie className="mr-3" style={{ color: darkAccent }} />
                  Mon profil
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/dashboard1");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-[${lightAccent}] rounded-lg transition-colors`}
                >
                  <FaBuilding className="mr-3" style={{ color: darkAccent }} />
                  Tableau de bord
                </button>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2`}
                >
                  <RiLogoutCircleRLine className="mr-3" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarAdmin;