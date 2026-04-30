import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

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
      navigate('/acceuil/orientation', { replace: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <>
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

      <div
        className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg,#1250c8 0%,#1a6dcc 25%,#28b090 55%,#a0d820 80%,#c2e832 100%)',
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={logo}
            alt="Logo Orientation Scolaire"
            className="max-w-full object-contain"
            style={{
              width: 'clamp(180px, 38vw, 420px)',
              height: 'clamp(180px, 38vw, 420px)',
            }}
          />
        </div>

        <div
          className="absolute left-1/2 flex w-full -translate-x-1/2 justify-center px-4 sm:px-6"
          style={{ bottom: 'clamp(32px, 8vh, 72px)' }}
        >
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
            <div className="mb-2 flex justify-between text-xs text-gray-600 sm:text-sm">
              <span>Chargement...</span>
              <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 sm:h-2.5">
              <div
                className="relative h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
