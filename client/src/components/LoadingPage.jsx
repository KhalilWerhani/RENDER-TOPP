import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { assets } from '../assets/assets';
const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2; // Faster loading (increase this number to go even faster)
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/'), 500);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [navigate]);

  const letters = ['T', 'O', 'P', '-', 'J', 'U', 'R', 'I', 'D', 'I', 'Q', 'U', 'E'];
  const lettersFilled = Math.floor(progress / (100 / letters.length));

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-30">
        <img 
          src={assets.logotopjuridique} 
          alt="TOP-JURIDIQUE Logo" 
          className="h-12 w-auto" 
        />
      </div>

      <div className="relative z-20 text-center px-4 w-full max-w-3xl">
        {/* Animated letters */}
        <div className="flex justify-center mb-12">
          {letters.map((letter, i) => (
            <div key={i} className="relative mx-0.5 md:mx-1">
              <span className="text-4xl md:text-5xl font-bold text-transparent block"
                style={{ WebkitTextStroke: '1px rgba(0,0,0,0.05)' }}>
                {letter}
              </span>
              {i < lettersFilled && (
                <span className={`absolute inset-0 text-4xl md:text-5xl font-bold block 
                  ${i < 4 ? 'text-blue-600' : 'text-black'}`}
                  style={{ 
                    animation: `float 2s ease-in-out infinite`,
                    animationDelay: `${i*0.06}s`
                  }}>
                  {letter}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Professional progress bar */}
        <div className="w-full max-w-md mx-auto mb-12">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-200 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite'
              }} />
          </div>
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span className="font-medium">Chargement en cours</span>
            <span className="font-mono font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Status message */}
        <div className="mb-8 text-gray-500 text-sm font-medium">
          {progress < 30 && "Initialisation du système..."}
          {progress >= 30 && progress < 70 && "Chargement des données..."}
          {progress >= 70 && progress < 100 && "Finalisation en cours..."}
          {progress >= 100 && "Prêt à rediriger..."}
        </div>

        {/* Professional contact */}
        <div className="flex items-center justify-center gap-2 text-gray-500 group">
          <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium">0176 39 00 60</span>
        </div>
      </div>

      {/* Subtle floating elements - smaller and slower */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-blue-100 opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            animation: `pulse ${Math.random() * 10 + 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(10px)'
          }} />
      ))}
    </div>
  );
};

export default LoadingPage;