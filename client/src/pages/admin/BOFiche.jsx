import { useEffect, useState , useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModalEditBO from "./ModalEditBO";
import ModalChangePasswordBO from './ModalChangePasswordBO';
import axios from 'axios';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCreditCard, FiKey, FiCalendar, FiClock } from 'react-icons/fi';
import { MdOutlineVerified } from 'react-icons/md';
import { RiPassportLine } from 'react-icons/ri';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { AppContent } from '../context/AppContext';


const BOFiche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bo, setBo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchBO = async () => {
      try {
        const res = await axios.get(`/api/admin/liste-bo/${id}`, {
          withCredentials: true,
        });
        setBo(res.data.data);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBO();
  }, [id]);

  const getInitials = (name) => {
    const parts = name?.split(' ') || [];
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
        <p className="text-gray-500">Chargement des informations...</p>
      </div>
    </div>
  );

  if (!bo) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Collaborateur introuvable</h2>
        <p className="text-gray-600 mb-4">Le collaborateur avec l'ID {id} n'existe pas ou vous n'avez pas les droits d'accès.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
        >
          <FiArrowLeft className="mr-2" />
          <span className="font-medium">Retour à la liste</span>
        </button>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar section */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                  {bo.name ? getInitials(bo.name) : <IoPersonCircleOutline className="w-16 h-16" />}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{bo.name}</h2>
                    {bo.isAccountVerified && (
                      <span 
                        className="bg-green-100 text-green-800 rounded-full p-1 flex items-center text-xs"
                        title="Compte vérifié"
                      >
                        <MdOutlineVerified className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{bo.role}</p>
                </div>
              </div>

              {/* Details section */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informations de contact</h3>
                    <div className="flex items-start">
                      <FiMail className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{bo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiPhone className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{bo.phone || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Localisation</h3>
                    <div className="flex items-start">
                      <FiMapPin className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">État/Ville</p>
                        <p className="font-medium">{bo.state || "Non renseigné"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiMapPin className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Code postal</p>
                        <p className="font-medium">{bo.postCode || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Identity info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Identité</h3>
                    <div className="flex items-start">
                      <FiCreditCard className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">CNI</p>
                        <p className="font-medium">{bo.cni || "Non renseigné"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <RiPassportLine className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Passeport</p>
                        <p className="font-medium">{bo.passportNumber || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Compte</h3>
                    <div className="flex items-start">
                      <FiCalendar className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Date de création</p>
                        <p className="font-medium">{new Date(bo.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiClock className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Dernière connexion</p>
                        <p className="font-medium">
                          {bo.lastLogin ? new Date(bo.lastLogin).toLocaleString() : "Jamais connecté"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier le collaborateur
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FiKey className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ModalEditBO
          bo={bo}
          onClose={() => setShowModal(false)}
          onUpdate={(updated) => setBo(updated)}
        />
      )}

      {showPasswordModal && (
        <ModalChangePasswordBO
          boId={bo._id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default BOFiche;