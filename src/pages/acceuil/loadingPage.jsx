import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 0.5;
      });
    }, 25);

  
    const timer = setTimeout(() => {
      navigate('/acceuil', { replace: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <>
      {/* Style CSS interne pour l'animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Logo centré */}
        <div className="flex-grow flex items-center justify-center">
          <img 
            src={logo} 
            alt="Logo Orientation Scolaire" 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain"
          />
        </div>

        {/* Section de chargement centrée et plus petite */}
        <div className="w-full pb-8 sm:pb-10 md:pb-12 lg:pb-16 flex justify-center">
          <div className="w-64 sm:w-72 md:w-80">
            {/* Texte et pourcentage plus petits */}
            <div className="flex justify-between mb-2 text-xs sm:text-sm text-gray-600">
              <span>Chargement...</span>
              <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            
            {/* Barre de progression plus petite */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Effet de brillance animé sur la barre de progression */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;