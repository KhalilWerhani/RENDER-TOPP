import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import LoadingPage from '../../components/LoadingPage';
import { assets } from '../../assets/assets';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardUser = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [demarches, setDemarches] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const adminId = import.meta.env.VITE_ADMIN_USER_ID;

  const [stats, setStats] = useState({
    dossiersTraites: 0,
    dossiersATraiter: 0,
    documents: 0,
    documentsReceived: 0,
    activiteRecent: [
      { day: 'Lun', value: 2 },
      { day: 'Mar', value: 3 },
      { day: 'Mer', value: 1 },
      { day: 'Jeu', value: 4 },
      { day: 'Ven', value: 2 },
      { day: 'Sam', value: 1 },
      { day: 'Dim', value: 0 }
    ]
  });

  const [ratingLoading, setRatingLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [expert, setExpert] = useState(null);
  const [expertLoading, setExpertLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/feedback/user-rating/${userData._id}`, {
          withCredentials: true,
        });

        if (res.data.rating) {
          setRating(res.data.rating.value);
          setHasRated(true);
        }
      } catch (err) {
        console.error("Erreur récupération note:", err.message);
      }
    };

    if (userData?._id) {
      fetchUserRating();
    }
  }, [backendUrl, userData?._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/stats`, {
          withCredentials: true
        });

        console.log("Stats data received:", data);

        if (data) {
          setStats({
            dossiersTraites: data.dossiersTraites ?? 0,
            dossiersATraiter: data.dossiersATraiter ?? 0,
            documents: data.documentsUploaded ?? 0,
            documentsReceived: data.documentsReceived ?? 0,
            activiteRecent: data.activiteRecent ?? []
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchDemarches = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        const userId = data?.userData?.id;
        const res = await axios.get(`${backendUrl}/api/progress/user/${userId}`);
        setDemarches(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des démarches :", err.message);
      }
    };

    const checkProgress = async () => {
      try {
        return fetchDemarches();
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expirée - Veuillez vous reconnecter");
          navigate('/login');
          return;
        } else if (err.request) {
          toast.error("Pas de réponse du serveur");
        } else {
          console.error('Request setup error:', err.message);
        }
        fetchDemarches();
      }
    };

    const fetchExpert = async () => {
      setExpertLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/expert`, {
          withCredentials: true
        });

        if (data.success) {
          setExpert(data.expert);
        } else {
          setExpert({
            name: "Support Team",
            role: "Customer Support",
            description: "Our team is available to assist you",
            phone: "+1 (555) 123-4567"
          });
        }
      } catch (err) {
        console.error("Error fetching expert:", err);
        setExpert({
          name: "Support Team",
          role: "Customer Support",
          description: "Contact us for assistance",
          phone: "support@example.com"
        });
      } finally {
        setExpertLoading(false);
      }
    };

    checkProgress();
    fetchData();
    fetchExpert();
  }, [backendUrl, navigate]);

  const handleResume = (demarche) => {
    setIsNavigating(true);
    const id = demarche._id;
    const type = demarche.typeDemarche?.toLowerCase();

    setTimeout(() => {
      switch (type) {
        case 'association':
          navigate(`/form-association/${id}`);
          break;
        case 'entreprise-individuelle':
          navigate(`/form-EI/${id}`);
          break;
        case 'auto-entrepreneur':
          navigate(`/form-auto-entrepreneur/${id}`);
          break;
        case 'sci':
          navigate(`/form-sci/${id}`);
          break;
        case 'sasu':
          navigate(`/form-sasu/${id}`);
          break;
        case 'eurl':
          navigate(`/form-eurl/${id}`);
          break;
        case 'sarl':
          navigate(`/form-sarl/${id}`);
          break;
        case 'sas':
          navigate(`/form-sas/${id}`);
          break;
        case 'transfert-siege':
          navigate('/formulaire/transfert-siege-sociale', { state: { progressId: id } });
          break;
        case 'changement-president':
          navigate('/formulaire/changement-president', { state: { progressId: id } });
          break;
        case 'changement-denomination':
          navigate('/formulaire/changement-denomination', { state: { progressId: id } });
          break;
        case 'changement-activite':
          navigate('/formulaire/changement-activite', { state: { progressId: id } });
          break;
        case 'transformation-sarl-sas':
          navigate('/formulaire/transformation-sarl-en-sas', { state: { progressId: id } });
          break;
        case 'transformation-sas-sarl':
          navigate('/formulaire/transformation-sas-en-sarl', { state: { progressId: id } });
          break;
        case 'fermer-societe':
          navigate('/formulaire/fermer-societe', { state: { progressId: id } });
          break;
        default:
          toast.error(`Type de démarche inconnu : ${demarche.typeDemarche}`);
          setIsNavigating(false);
      }
    }, 1500);
  };

  const handleContactAdmin = () => {
    if (!adminId) return toast.error("ADMIN_USER_ID non défini");
    navigate(`/user/messages?userId=${adminId}`);
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`${backendUrl}/api/feedback/rating`, {
        rating,
        userId: userData?.id
      }, { withCredentials: true });
      toast.success("Merci pour votre évaluation !");
      setHasRated(true);
    } catch (err) {
      toast.error("Erreur lors de l'envoi de votre évaluation");
    }
  };

  const AppointmentScheduler = ({ open, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [step, setStep] = useState(1);
    const [appointmentDetails, setAppointmentDetails] = useState({
      name: userData?.name || '',
      email: userData?.email || '',
      subject: '',
      notes: ''
    });

    const generateDates = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }

      return dates;
    };

    const timeSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const handleDateSelect = (date) => {
      setSelectedDate(date);
      setStep(2);
    };

    const handleTimeSelect = (time) => {
      setSelectedTime(time);
      setStep(3);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAppointmentDetails(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${backendUrl}/api/appointments`, {
          date: selectedDate,
          time: selectedTime,
          expertId: expert?._id,
          userId: userData?.id,
          name: appointmentDetails.name,
          email: appointmentDetails.email,
          subject: appointmentDetails.subject,
          notes: appointmentDetails.notes
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          toast.success("Rendez-vous confirmé avec succès!");
          onClose();
          setSelectedDate(null);
          setSelectedTime('');
          setAppointmentDetails({
            name: userData?.name || '',
            email: userData?.email || '',
            subject: '',
            notes: ''
          });
          setStep(1);
        } else {
          toast.error(response.data.message || "Erreur lors de la réservation");
        }
      } catch (err) {
        console.error("Appointment error:", err);
        toast.error(err.response?.data?.message || "Erreur lors de la réservation du rendez-vous");
      }
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
        <div
          className="fixed inset-0 bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col mx-8">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1 && 'Choisir une date'}
              {step === 2 && 'Choisir un horaire'}
              {step === 3 && 'Confirmer le rendez-vous'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`h-1 w-16 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {generateDates().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-4 rounded-lg border transition-all ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className="text-sm font-medium text-gray-500">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-semibold">
                      {date.getDate()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`py-3 px-4 rounded-lg border transition-all ${selectedTime === time ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Date et heure du rendez-vous</p>
                    <p className="font-medium">
                      {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}
                      {' à '}
                      {selectedTime}
                    </p>
                    <p className="text-sm mt-2">Avec: {expert?.name || 'Support Team'}</p>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={appointmentDetails.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={appointmentDetails.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={appointmentDetails.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Objet de la consultation"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes supplémentaires
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={appointmentDetails.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Décrivez brièvement votre demande..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isNavigating) {
    return <LoadingPage />;
  }

  const StarRating = ({ rating, setRating, disabled }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex justify-center mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && setRating(star)}
            className="focus:outline-none"
            disabled={disabled}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              className={`w-10 h-10 mx-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitRating = async () => {
    if (hasRated) {
      toast.warning("Vous avez déjà soumis une évaluation");
      return;
    }

    if (!rating) {
      toast.warning("Veuillez sélectionner une note");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/feedback/rating`,
        {
          value: rating,
          userId: userData._id
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Merci pour votre évaluation !");
        setHasRated(true);
      } else {
        toast.error(response.data.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error("Erreur soumission note:", err);

      let errorMessage = "Erreur lors de l'envoi de votre évaluation";

      if (err.response) {
        if (err.response.status === 400 && err.response.data?.existingRating) {
          setHasRated(true);
          setRating(err.response.data.existingRating.value);
          errorMessage = "Vous avez déjà soumis une évaluation";
        } else {
          errorMessage = err.response.data?.message ||
            `Erreur serveur (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur - veuillez réessayer";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AppointmentScheduler open={showScheduler} onClose={() => setShowScheduler(false)} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bonjour, {userData?.name}</h1>
            <p className="text-gray-500 mt-1">Aperçu de vos activités et démarches</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dossiers traités</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.dossiersTraites}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dossiers à traiter</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.dossiersATraiter}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Documents envoyés</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Documents reçus</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.documentsReceived}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Card */}
        {expertLoading ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="animate-pulse flex flex-col items-center justify-center h-40">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ) : expert ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                <img
                  src={assets.avatar}
                  alt="Expert"
                  className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                />
              </div>
              <div className="md:w-3/4 md:pl-8 text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-800">{expert.name}</h2>
                <p className="text-indigo-700 mt-2 text-lg">{expert.role}</p>
                <p className="text-gray-600 mt-2">{expert.description}</p>
                <div className="mt-4 flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <a href={`tel:${expert.phone}`} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {expert.phone}
                  </a>
                  <button
                    onClick={() => setShowScheduler(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">Aucun collaborateur n'est actuellement disponible</p>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Évaluez notre service</h2>
            <div className="h-80 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-center">
                Veuillez noter votre expérience avec notre service Backoffice
              </p>
              <StarRating rating={rating} setRating={setRating} disabled={hasRated} />

              {hasRated ? (
                <div className="text-center mt-4">
                  <p className="text-sm text-green-600">
                    Vous avez déjà noté ce service: {rating} ⭐
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Merci pour votre retour!
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-3 text-gray-600 text-sm">
                    {rating > 0 ? `Note sélectionnée : ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
                  </p>
                  <button
                    onClick={handleSubmitRating}
                    disabled={!rating || hasRated}
                    className={`mt-4 px-4 py-2 rounded ${!rating || hasRated
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {hasRated ? 'Déjà noté' : 'Soumettre'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Votre activité récente</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.activiteRecent}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} actions`, 'Nombre']}
                  />
                  <Bar
                    dataKey="value"
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                    name="Actions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Demarches */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Mes démarches récentes</h2>
            <button
              onClick={() => navigate('/mes-dossiers')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Voir tout
            </button>
          </div>

          {demarches.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune démarche en cours</h3>
              <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore commencé de démarche.</p>
              <button
                onClick={() => navigate('/form-project')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Commencer une démarche
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étape actuelle</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {demarches.map((demarche) => (
                    <tr key={demarche._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {demarche.typeDemarche.replace('-', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${demarche.etatAvancement === 'en cours' ? 'bg-blue-100 text-blue-800' :
                            demarche.etatAvancement === 'terminé' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}`}>
                          {demarche.etatAvancement}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(demarche.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {demarche.currentStepName || "Nom de l'étape"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {demarche.status || "Statut"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleResume(demarche)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Reprendre
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>



        {/* Expert Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
              <img
                src={assets.person_icon}
                alt="Expert"
                className="w-32 h-32 rounded-full border-4 border-indigo-100"
              />
            </div>
            <div className="md:w-3/4 md:pl-8 text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800">Jean Dupont</h2>
              <p className="text-indigo-700 mt-2 text-lg">
                Expert en création d'entreprise
              </p>
              <p className="text-gray-600 mt-2">
                Disponible pour vous accompagner dans toutes vos démarches administratives et juridiques.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                <a
                  href="tel:+33123456789"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +33 1 23 45 67 89
                </a>
                <button
                  onClick={() => navigate('/dashboard/rendez-vous')}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Prendre rendez-vous
                </button>
                <button
                  onClick={handleContactAdmin}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Contacter l’administrateur
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardUser;