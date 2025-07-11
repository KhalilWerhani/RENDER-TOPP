import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { assets } from '../../assets/assets';
import { FiSmartphone, FiCode, FiLayout, FiImage } from 'react-icons/fi';
import { FaHandsHelping, FaRocket, FaClock, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './chart.css'

const benefits = [
  { icon: <FaHandsHelping className="text-blue-600 text-3xl" />, title: "Accompagnement humain", description: "Notre équipe vous suit à chaque étape, par visio, téléphone ou e-mail.", ml: "0" },
  { icon: <FaClock className="text-yellow-600 text-3xl" />, title: "Gain de temps", description: "Ne perdez plus d’heures avec la paperasse, on s’en occupe.", ml: "4" },
  { icon: <FaRocket className="text-purple-600 text-3xl" />, title: "Croissance accélérée", description: "On vous aide à structurer et à adapter vos décisions pour évoluer.", mr: "2" },
  { icon: <FaShieldAlt className="text-green-600 text-3xl" />, title: "Sécurité juridique", description: "Toutes vos démarches sont cadrées et conformes aux obligations légales.", ml: "3" },
  { icon: <FaLightbulb className="text-pink-600 text-3xl" />, title: "Expertise dédiée", description: "Nos experts connaissent vos problématiques de dirigeant.", ml: "6" },
];



const services = [
  {
    icon: <FiLayout className="text-3xl text-blue-600" />,
    title: 'Procédure de création',
    path: '/form-project',
    desc: 'Créez votre entreprise facilement.',
  },
  {
    icon: <FiImage className="text-3xl text-blue-600" />,
    title: 'Modification administrative',
    path: '/modification',
    desc: 'Modifiez vos statuts en quelques clics.',
  },
  {
    icon: <FiSmartphone className="text-3xl text-blue-600" />,
    title: 'Procédure de fermeture',
    path: '/cessation',
    desc: 'Fermez votre entreprise sans stress.',
  },
  {
    icon: <FiCode className="text-3xl text-blue-600" />,
    title: 'Suivi de dossier',
    path: '/suivi',
    desc: 'Suivez vos démarches en temps réel.',
  },
];

const ChartG = () => {
  const [showUnderline, setShowUnderline] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowUnderline(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-6 lg:px-20 text-center space-y-6 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          <span
            className={`animated-underline-full transition-opacity duration-1 ${showUnderline ? 'opacity-100' : 'opacity-1'}`}>
            Simplifiez toutes vos démarches administratives
          </span>
        </h1>
        <p className="text-lg text-gray-800 max-w-3xl mx-auto font-medium">
          Automatisez vos formalités juridiques grâce à notre plateforme intuitive, pensée pour les entrepreneurs modernes.
        </p>
      </section>

      {/* Solutions + Illustration */}
      <section className="px-6 lg:px-20 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
        {/* Solutions */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-8">
          {services.map((service, idx) => (
            <button
              key={idx}
              onClick={() => navigate(service.path)}
              className="flex items-start gap-5 p-6 bg-white/80 backdrop-blur-md hover:bg-white shadow-md rounded-3xl border-2 border-white transition-all hover:shadow-lg text-left group"
            >
              <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
                {service.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Image à droite */}
        <div className="bg-white rounded-4xl shadow-xl border border-blue-200 p-4  flex items-center justify-center">
          <img
            src={assets.bwoman_img2}
            alt="Illustration entreprise"
            className="rounded-2xl w-full max-w-sm object-cover"
          />
        </div>
      </section>
      <section className="bg-white py-24 px-6 sm:px-20">
        
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={assets.people_together_vid1} type="video/mp4" />
        <img
          src={assets.ppl_together}
          alt="Illustration fallback"
          className="w-full h-full object-cover"
        />
      </video>
    </div>
    
    {/* Texte gauche */}
    <div className="space-y-8 text-center lg:text-left">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
        Ils nous font confiance
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Depuis notre lancement, des centaines de dirigeants et entrepreneurs nous font confiance pour gérer
        leurs formalités administratives. Nous nous engageons à offrir un service fluide, sécurisé et rapide,
        tout en vous accompagnant avec une équipe experte et à l’écoute.
      </p>
      <div className="flex justify-center lg:justify-start gap-4 mt-6 flex-wrap">
        <img src={assets.logoassurtime} alt="Logo 1" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
        <img src={assets.logohabile} alt="Logo 2" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
        <img src={assets.logoblablassur} alt="Logo 3" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
        <img src={assets.salambologo} alt="Logo 4" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
        <img src={assets.kandbaz} alt="Logo 5" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
      </div>
    </div>

    {/* Vidéo / image à droite */}
    
  </div>
</section>

<section className="bg-yellow-200 py-28 px-6 sm:px-16">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
        Pourquoi <span className="text-blue-600">TOP-JURIDIQUE</span> ?
      </h2>
      <p className="text-gray-600 mt-4 text-lg">
        Une plateforme pensée pour simplifier la vie des entrepreneurs.
      </p>
    </div>

    {/* Zone relative pour positionner librement les éléments */}
    <div className="relative w-full max-w-5xl mx-auto h-[600px]">
      {/* Image centrale */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src={assets.bwoman_img1}
          alt="Illustration"
          className="w-72 h-auto object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* Cartes positionnées librement */}
      {benefits.map((item, idx) => {
        const positions = [
          { top: '10%', left: '5%' },
          { top: '5%', right: '10%' },
          { bottom: '10%', left: '-10%' },
          { top: '45%', right: '0%' },
          { bottom: '0%', right: '0%' },
        ];

        const pos = positions[idx] || {};
        return (
          <div
            key={idx}
            className="absolute bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-md w-64"
            style={pos}
          >
            <div className="flex items-center gap-3 mb-2">
              {item.icon}
              <h4 className="text-blue-900 font-semibold text-md">{item.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>



    </div>
    
  );
};

export default ChartG;
