import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import illustraImage from "../assets/illustra.png"; // Adjust the file extension if necessary
import WhyTop from "./WhyTop";
import '../components/HomePage.css';
import DocumentModels from "./DocumentModels";
import ContactForm from "./user/ContactForm";



const HomePage = () => {
  const navigate = useNavigate();
  const [showUnderline, setShowUnderline] = useState(true);
  const [showSlashes, setShowSlashes] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setShowUnderline(prev => !prev);
    }, 2000); // Toggle every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30); // seuil de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);





  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar isScrolled={isScrolled} />
      {/* colors to test  E6F4EA  #F3E8FF #F5EAF4  #FF00FF  #C154C1  #d9ba65  #F78FB3rgb(208, 191, 199)                         #d9ba65*              /} 
      {/* Header Section with Image on the left and Text on the right      */}
      <section className="header-section relative bg-[#f4d47c] rounded-xl py-22 px-4 sm:px-10 overflow-hidden">
        <div className="z-10 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-16 fade-in">

          {/* Texte à gauche */}
          <div className="w-full lg:w-2/3 text-left space-y-6">
            <div className="inline-block  text-blue-800 font-medium text-sm px-4 py-1 rounded-full shadow-sm">
              Plateforme juridique en ligne pour entrepreneurs
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
              <span className={`animated-underline-full ${showUnderline ? 'visible' : 'hidden'}`}>
                Simplifiez toutes vos <br className="hidden sm:block" />
                démarches juridiques et administratives en ligne
              </span>
            </h1>

            <div className="space-y-4 text-base sm:text-lg text-gray-800 leading-relaxed">
              <p>
                Automatisez vos formalités grâce à une plateforme tout-en-un pensée pour les <strong>entrepreneurs</strong>, <strong>auto-entrepreneurs</strong> et <strong>dirigeants de PME</strong> en France.
              </p>
              <p>
                Créez, modifiez ou fermez votre entreprise, déposez votre marque, gérez votre comptabilité ou accédez à nos modèles juridiques personnalisables – le tout depuis un <strong>guichet unique digital</strong>, sans déplacement.
              </p>
              <ul className="list-disc list-inside text-gray-700 pl-2">
                <li>Création d’entreprise</li>
                <li>Modification statutaire</li>
                <li>Dépôt de marque INPI</li>
                <li>Comptabilité simplifiée</li>
              </ul>
              <p>
                <span className="font-semibold text-blue-800">TOP-JURIDIQUE</span> vous accompagne à chaque étape.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => window.location.href = "/form-project"}
                className="bg-blue-600 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md transition"
              >
                Démarrer une démarche
              </button>
              <button
                onClick={() => window.location.href = "/contact"}
                className="bg-white hover:bg-gray-100 text-blue-700 text-sm font-semibold px-6 py-3 rounded-full border border-blue-500 transition"
              >
                Obtenir un devis personnalisé
              </button>
            </div>
          </div>

          {/* Illustrations à droite */}
          <div className="w-full lg:w-[45%] bg-white rounded-3xl px-6 py-10 sm:p-10 shadow-xl flex flex-col items-center text-center gap-8 slide-in-down">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition duration-300">
                <img
                  src={assets.bwoman_img1}
                  alt="Illustration 1"
                  className="w-full h-40 sm:h-82 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition duration-300">
                <img
                  src={assets.bwoman_img2}
                  alt="Illustration 2"
                  className="w-full h-40 sm:h-82 object-cover"
                />
              </div>
            </div>
            <p className="text-md sm:text-lg font-medium text-gray-800 px-2">
              Plateforme experte en <strong>création</strong>, <strong>modification</strong> et <strong>gestion juridique</strong> des entreprises. Simplifiez vos démarches avec <span className="font-semibold text-blue-800">TOP-JURIDIQUE</span>.
            </p>
          </div>

        </div>
      </section>



      {/* Solutions Section */}
      {/* Solutions Section */}
      <section className="bg-white py-16 px-6 sm:px-12">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Découvrez nos solutions juridiques 100 % en ligne
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Démarches rapides, conformes, et accessibles à tous les entrepreneurs – où que vous soyez.
        </p>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-screen-xl w-full px-4">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-yellow-100 hover:bg-yellow-200 transition-all duration-300 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center w-full max-w-[350px] min-h-[370px] mx-auto"
              >
                <div className="mb-4">
                  <img
                    src={solution.img}
                    alt={solution.title}
                    className="w-24 h-24 object-contain mx-auto"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900">{solution.title}</h3>
                <p className="text-gray-700 text-base mt-3 mb-5 px-2 leading-relaxed">
                  {solution.description}
                </p>
                <button
                  onClick={() => solution.link && navigate(solution.link)}
                  className="w-full py-2 rounded-full bg-[#2D26Fc] text-white font-semibold hover:bg-blue-700 transition-all mt-auto"
                >
                  {solution.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-white py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">

          {/* Texte à gauche */}
          <div className="w-full md:w-1/2 text-left space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Ils nous font confiance
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Une relation de confiance construite sur la transparence et l’efficacité
            </h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Depuis nos débuts, nous avons su gagner la confiance de centaines d’entrepreneurs grâce à notre <strong>transparence</strong>, notre <strong>accompagnement humain</strong> et notre <strong>réactivité</strong>.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Nos clients apprécient la <strong>simplicité</strong> de notre plateforme, la <strong>rapidité de traitement</strong> et la <strong>sécurité</strong> offerte à chaque étape de leurs démarches juridiques.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Aujourd’hui, <span className="font-semibold text-blue-800">TOP-JURIDIQUE</span> est reconnu comme l’un des services <strong>en ligne les plus fiables</strong> du marché.
              Notre capacité à accompagner chaque client, quel que soit son profil, et à répondre rapidement à ses besoins, nous distingue. Leur fidélité est la meilleure preuve de notre impact.
            </p>
          </div>

          {/* Vidéo à droite */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-xl aspect-video bg-gray-100 rounded-xl shadow-lg overflow-hidden relative">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
              >
                <source src={assets.people_together_vid1} type="video/mp4" />
                <img
                  src={assets.ppl_together}
                  alt="Client témoignage"
                  className="w-full h-full object-cover"
                />
              </video>
              {/* Optionnel : Icône lecture au centre */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-70 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div> */}
            </div>
          </div>
        </div>
      </section>


      <section>
        <div>
          <WhyTop />
        </div>
      </section>
      <section>
        <div>
          <DocumentModels />
        </div>
      </section>

      {/* Nos partenaires Section */}


      {/* Scrolling logos */}
      <section className="bg-white py-20 px-6 sm:px-12 overflow-x-hidden">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6">
          Ils nous accompagnent dans l’innovation juridique
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 text-lg">
          Nos partenaires partagent notre ambition de rendre les démarches juridiques plus simples, plus rapides et plus accessibles.
          Ensemble, nous construisons des solutions innovantes pour accompagner les entrepreneurs au quotidien.
        </p>

        {/* Slider animé au défilement horizontal avec animation pingpong */}
        <div className="partner-carousel-container">
          <div className="partner-slider pingpong-animation">
            {[
              {
                logo: assets.logoblablassur,

                description: "Assurance professionnelle",
              },
              {
                logo: assets.logotopcompta,

                description: "Expertise comptable",
              },
              {
                logo: assets.logohabile,

                description: "Solutions digitales",
              },
              {
                logo: assets.logoassurtime,

                description: "Assurance auto & pro",
              },
              {
                logo: assets.logosedomicilier,

                description: "Domiciliation d’entreprise",
              },
              {
                logo: assets.salambologo,
                name: "Salambo Proserv",
                description: "Externalisation back office",
              },
              {
                logo: assets.kandbaz,

                description: "Formalités juridiques",
              }
            ].map((partner, idx) => (
              <div
                key={idx}
                className="partner-logo-wrapper"
              >
                <div className="text-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="partner-logo mb-2 mx-auto"
                  />
                  <h3 className="text-base font-semibold text-gray-800">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>









      {/* Contact Section */}

      <section className="bg-white py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 relative">
            <span className="relative z-10">Contactez-nous</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Nos coordonnées</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">Adresse</h4>
                      <p className="text-gray-600">Adresse : 30 Boulevard DE Sebastopol PARIS , 75004 PARIS France</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">Téléphone</h4>
                      <p className="text-gray-600">07 58 42 11 38</p>
                      <p className="text-gray-600 mt-1">Lundi-Vendredi: 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">contact@top-juridique.fr</p>
                      <p className="text-gray-600 mt-1">Réponse sous 24h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>


                  <a href="#" className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />

    </div>
  );
};

// Solutions data
const solutions = [
  {
    img: assets.Créer_bg,
    title: "Créer mon entreprise en ligne",
    description: "Démarche 100 % guidée et simplifiée via l’INPI. Lancez votre activité en toute sérénité.",
    buttonText: "Démarrer mon entreprise",
    link: "/form-project",
  },
  {
    img: assets.Modifier_bg,
    title: "Modifier les statuts de mon entreprise",
    description: "Ajoutez un dirigeant, transférez un siège, ou changez l’objet social en quelques clics.",
    buttonText: "Modifier mes statuts",
    link: "/gerer-entreprise",
  },
  {
    img: assets.Fermer_bg,
    title: "Fermer mon entreprise",
    description: "Clôturez proprement votre activité avec un accompagnement administratif sécurisé.",
    buttonText: "Fermer mon entreprise",
    link: "/fermer-entreprise",
  },
  {
    img: assets.Mon_bg,
    title: "Mon tableau de bord juridique",
    description: "Suivez vos démarches en temps réel et accédez à l’historique complet de vos formalités.",
    buttonText: "Accéder à mon suivi",
  },
];


export default HomePage;
