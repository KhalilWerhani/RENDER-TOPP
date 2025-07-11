import React from 'react';
import NavRou from '../components/NavRou';
import { assets } from '../assets/assets';
import './Project.css';

function Project() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col">
      {/* Navigation */}
      <NavRou />

      {/* Page Content */}
      <div className="flex flex-col lg:flex-row justify-center items-center flex-1 gap-12 px-6 py-10 relative overflow-hidden">

        {/* Floating Background Blobs */}
        

        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col items-start justify-center text-left w-60 z-10">
          <img src={assets.login_img} alt="Business Success" className="w-full rounded-3xl shadow-lg" />
          <h1 className="text-4xl font-extrabold text-sky-900 mt-6 mb-2">Votre avenir commence ici</h1>
          <p className="text-gray-700">Gérez votre entreprise en toute simplicité avec notre plateforme sécurisée et intelligente.</p>
        </div>

        {/* Right Side - Login Card */}
        <div
          className="relative w-full max-w-md min-h-[420px] bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30 z-10 transition-transform transform hover:scale-[1.01]"
        >
          
          {/* Floating Logo */}
          <img
            src={assets.logo}
            alt="Logo"
            className="absolute right-6 top-6 w-16 opacity-70 bounce-slow z-20"
          />

        <div className="absolute -top-32 -left-32 w-[300px] h-[400px] bg-sky-300 rounded-full mix-blend-multiply filter blur-8xl opacity-30 animate-blob z-0"></div>
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[400px] bg-sky-300 rounded-full mix-blend-multiply filter blur-8xl opacity-30 animate-blob animation-delay-900 z-0"></div>

          {/* Login Form */}
          <div className="relative z-20 pb-2 p-10">
            <div className="pb-10">
              <h2 className="text-4xl font-extrabold text-sky-800 text-center mb-4">Bienvenue</h2>
              <p className="text-center text-gray-600 text-sm mb-8">Connectez-vous pour accéder à votre espace</p>
            </div>

            <form className="space-y-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-inner focus-within:ring-2 ring-blue-300 transition">
                <img className="w-5" src={assets.mail_icon} alt="Mail" />
                <input
                  className="bg-transparent outline-none w-full text-sm text-gray-800"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-inner focus-within:ring-2 ring-blue-300 transition">
                <img className="w-5" src={assets.lock_icon} alt="Lock" />
                <input
                  className="bg-transparent outline-none w-full text-sm text-gray-800"
                  type="password"
                  placeholder="Mot de passe"
                  required
                />
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-sky-800 to-blue-900 hover:brightness-110 text-white rounded-xl font-semibold shadow-md mt-10 transition duration-300 ease-in-out transform hover:scale-105">
                Connexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
