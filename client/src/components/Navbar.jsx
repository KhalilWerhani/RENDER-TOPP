import React, { useContext, useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPhoneAlt, FaRegBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

import './Navbar.css';

const Navbar = ({ isScrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl, setuserData, setIsLoggedin } = useContext(AppContent);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false); // 👈 AJOUTE-LA ICI


  const dropdownRef = useRef(null);

  const mockSearchResults = [
    "Créez votre entreprise de services aux entreprises",
    "Micro-entreprise ou auto-entrepreneur : quelles différences ?",
    "Auto-entrepreneurs : comment gérer son auto-entreprise ?",
    "Guide de l'auto-entrepreneur (=micro-entrepreneur)",
    "Travailler en auto-entrepreneur pour une entreprise : guide 2025",
    "Combien coûte la création d'une micro-entreprise en 2025 ?"
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = mockSearchResults.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);
  useEffect(() => {
    if (!userData?.id) return;

    const socket = io(backendUrl);
    socket.emit("add-user", userData.id);

    socket.on("new-notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      toast.info("Vous avez une nouvelle notification");
    });

    return () => socket.disconnect();
  }, [userData?.id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userData?.id) return;

        const { data } = await axios.get(`${backendUrl}/api/notifications/${userData.id}`);
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
        toast.error("Impossible de charger les notifications");
      }
    };

    fetchNotifications();
  }, [userData?.id, backendUrl]);

  //notification 
  const handleNotificationClick = async (notif) => {
    try {
      await axios.put(`${backendUrl}/api/notifications/read/${notif._id}`);
      setNotifications((prev) =>
        prev.map((n) => n._id === notif._id ? { ...n, isRead: true } : n)
      );

      if (notif.link) {
        navigate(notif.link);
        setShowNotifDropdown(false);
      }
    } catch (err) {
      toast.error("Erreur lors de la lecture de la notification");
    }
  };
  const markAllAsRead = async () => {
    try {
      if (!userData?.id) return;

      await axios.put(`${backendUrl}/api/notifications/read-all/${userData.id}`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("Toutes les notifications ont été marquées comme lues.");
    } catch (err) {
      toast.error("Erreur lors du marquage des notifications");
    }
  };


  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setuserData(null);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(prev => (prev === section ? '' : section));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Créer mon entreprise", id: "creation" },
    { label: "Gérer mon entreprise", id: "gestion" },
    { label: "Comptabilité", id: "Comptabilite" },
    { label: "Ressources", id: "ressources" },
  ];

  return (
    <div className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-[#f4d47c]'}`}>
      <div className='flex justify-between items-center p-4 px-6 sm:px-12'>
        <img
          onClick={() => navigate('/')}
          src={assets.logotopjuridique}
          alt="Logo"
          className="w-43 sm:w-48 md:w-52 lg:w-60 pl-2 sm:pl-4 md:pl-6 lg:pl-10 cursor-pointer"
        />


        <div className='hidden lg:flex items-center gap-6'>
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => {
                if (id === "Comptabilite") {
                  navigate("/comptabilite");
                } else {
                  setActiveItem(id);
                  toggleDropdown(id);
                }
              }}
              className={`nav-link ${activeItem === id ? 'nav-link-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connexion ou Avatar User */}
          {userData ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="w-10 h-10 flex items-center justify-center border-2 border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 transition"
              >
                {userData.name[0]?.toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 w-44 transition-all duration-200">
                  <button
                    onClick={() => {
                      navigate("/dashboarduser");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 font-medium"
                  >
                    Mon espace
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-red-600 font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-10 h-10 flex items-center justify-center border-2 border-blue-600  rounded-md hover:bg-blue-50 transition"
            >
              <img src={assets.user_connecion} alt="Connexion" className="h-5 w-5" />
            </button>
          )}

          {/* Icône notification client */}
          {userData && (
            <div className="relative">
              <button onClick={() => setShowNotifDropdown(prev => !prev)} className="relative w-10 h-10 flex items-center justify-center border-2 border-blue-600 rounded-md hover:bg-blue-50">
                <FaRegBell className="text-xl text-blue-800" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white border shadow-lg rounded-lg z-50 overflow-hidden">
                  <div className="flex justify-between items-center p-3 border-b font-semibold text-sm text-gray-700">
                    <span>Mes notifications</span>
                    {notifications.some(n => !n.isRead) && (
                      <button
                        onClick={markAllAsRead}
                        className="text-blue-600 text-xs hover:underline focus:outline-none"
                      >
                        Tout lire
                      </button>
                    )}
                  </div>

                  <ul className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <li
                          key={notif._id}
                          className={`px-4 py-3 cursor-pointer border-b text-sm ${notif.isRead ? "bg-white" : "bg-blue-50 font-semibold"
                            } hover:bg-blue-100`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div>{notif.message}</div>
                          <div className="text-xs text-gray-500">
                            {notif.sender?.name} – {notif.sender?.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(notif.createdAt).toLocaleString("fr-FR", {
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
          )}

          {/* Bouton Recherche */}
          <button
            onClick={() => setShowSearchBar(prev => !prev)}
            className="w-10 h-10 flex items-center justify-center border-2 border-blue-600  rounded-md hover:bg-blue-50 transition"
          >
            <FiSearch className="text-blue-600 text-lg" />
          </button>

          {/* Téléphone (affiché uniquement sur sm+) */}
          <a
            href="tel:0176390060"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-[#3f47e6] text-white text-sm rounded-lg sm:rounded-xl font-medium shadow hover:bg-blue-800 transition"
          >
            <FaPhoneAlt className="text-base" />
            <span className="hidden sm:inline">01 76 39 00 60</span>
          </a>


          {/* Menu mobile (hamburger) */}
          <button className='lg:hidden p-2' onClick={() => setMobileMenuOpen(prev => !prev)}>
            {mobileMenuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenuAlt3 className="text-2xl" />}
          </button>
        </div>
      </div>

      {showSearchBar && (
        <>
          {/* OVERLAY FLOU POUR LE RESTE DE L'ÉCRAN */}
          <div
            className="fixed inset-0 bg-white/30 backdrop-blur-sm z-30"
            onClick={() => setShowSearchBar(false)}
          />

          {/* SEARCH DROPDOWN */}
          <div
            className="fixed top-[64px] right-0 w-full max-w-md h-full bg-white rounded-xl bg-center shadow-lg z-40 border-l border-gray-300 px-6 py-4 overflow-y-auto transition-all duration-300"
            style={{
              backgroundImage: `url(${assets.illustrawresearch})`,
              backgroundSize: '120%',               // 👈 contrôle la taille ici
              backgroundRepeat: 'no-repeat',       // évite la répétition
              backgroundPosition: 'center ',    // positionne l’image
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backgroundBlendMode: 'overlay',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}
          >

            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-full px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => setShowSearchBar(false)}
                className="ml-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {filteredResults.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredResults.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-4 text-gray-800 font-medium hover:text-blue-600 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Aucun résultat</p>
            )}
          </div>
        </>
      )}


      {mobileMenuOpen && (
        <div className="lg:hidden bg-white px-6 py-4 border-t">
          {navItems.map(({ label, id }) => (
            <div key={id} className="py-2 border-b" onClick={() => {
              if (id === "Comptabilite") navigate("/comptabilite")
              else toggleDropdown(id);
              setMobileMenuOpen(false);
            }}>
              {label}
            </div>
          ))}
        </div>
      )}

      {openDropdown && <DropdownContent section={openDropdown} navigate={navigate} ref={dropdownRef} />}
    </div>
  );
};

const DropdownContent = React.forwardRef(({ section, navigate }, ref) => {
  const sections = {
    creation: [
      {
        title: "Créer une entreprise",
        links: [
          { label: "Créer mon entreprise individuelle" },
          { label: "Devenir auto-entrepreneur" },
          { label: "Créer ma association" },
          { label: "Créer une SCI" },
          { label: "Créer ma SASU" },
          { label: "Créer mon EURL" },
          { label: "Créer ma SARL" },
          { label: "Créer ma SAS" },
        ]
      }
    ],
    ressources: [
      {
        title: "Ressources utiles",
        links: [
          { label: "Guide SARL", path: "/guide-sarl" },
          { label: "Guide SASU", path: "/guide-sasu" },
          { label: "Guide SAS", path: "/guide-sas" },
          { label: "Guide EURL", path: "/guide-eurl" },
          { label: "Guide Auto-Entrepreneur", path: "/guide-auto-entrepreneur" },
          { label: "Modèles de documents", path: "/documentmodels" },
          { label: "Aides juridiques", path: "/aidejuridique" },
        ]
      }
    ],
    gestion: [
      {
        title: "Modifier ses statuts",
        links: [
          { label: "Transfert de siège social", path: "/modification/transfert-siege-sociale" },
          { label: "Changement de dénomination sociale", path: "/modification/changement-denomination" },
          { label: "Changement de président", path: "/modification/changement-president" },
          { label: "Changement d’activité", path: "/modification/changement-activite" },
          { label: "Transformation SARL en SAS", path: "/modification/transformation-sarl-en-sas" },
          { label: "Transformation SAS en SARL", path: "/modification/transformation-sas-en-sarl" },
        ]

      },
      {
        title: "Fermer son entreprise",
        links: [
          { label: "Radiation auto-entrepreneur", path: "/formulaire/radiationautoentrepreneur" },
          { label: "Mise en sommeil", path: "/formulaire/miseensomeil" },
          { label: "Dissolution-liquidation", path: "/formulaire/fermer-societe" },
          { label: "Dépôt de bilan", path: "/formulaire/bilan" },
        ]

      },
      {
        title: "Protéger ses créations",
        links: [
          { label: "Dépôt de marque" },

        ]
      }
    ]
  };

  if (sections[section]) {
    return (
      <div
        ref={ref}
        className="absolute bg-white shadow-lg rounded-lg p-6 mt-2 left-1/2 -translate-x-1/2 w-fit max-w-full z-40 min-w-[300px]"
      >
        <div className={`grid gap-8 ${sections[section].length === 1 ? 'grid-cols-1' : sections[section].length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
          {sections[section].map((group, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-gray-900 mb-2">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => navigate(item.path || '/form-project')}
                    className="cursor-pointer text-sm text-gray-700 hover:text-blue-600"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    );
  }

  return null;
});

export default Navbar;