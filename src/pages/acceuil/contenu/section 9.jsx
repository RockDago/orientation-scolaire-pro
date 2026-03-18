import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";

const CHOIX_ETUDES = [
  {
    value: "court",
    label: "Faire des études courtes (moins de 3 ans)",
  },
  {
    value: "long",
    label: "Faire des études longues (plus de 3 ans)",
  },
];

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[200px] lg:w-[280px] object-contain" />
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function Section9({ onVoirResultats, onRetour, onHome }) {
  const navigate = useNavigate();
  const [choix, setChoix] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChoix = (item) => {
    setChoix(item.value);
  };

  const handleSuivant = () => {
    if (choix) {
      setIsLoading(true);
      setTimeout(() => {
        onVoirResultats?.(choix);
      }, 5000);
    }
  };

  return (
    <div className="relative w-full min-h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />
      
      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] flex items-center justify-center">
          <GradBg />
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="loader">
              <div className="justify-content-center jimu-primary-loading"></div>
            </div>
            <div className="mt-20 flex flex-col items-center gap-2">
              <p className="text-white font-black text-2xl uppercase tracking-widest animate-pulse">
                Analyse en cours
              </p>
              <p className="text-white/60 text-sm font-medium">Nous préparons vos résultats personnalisés...</p>
            </div>
          </div>
        </div>
      )}

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4 overflow-hidden">
        {/* Back button */}
        <button
          onClick={onRetour}
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <div className="flex flex-col items-center text-center w-full max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Tu te vois
              <br />
              plutôt…
            </h1>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
              Choisis le type de parcours qui te correspond.
            </p>

            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mb-6">
              {CHOIX_ETUDES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleChoix(item)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    choix === item.value
                      ? "bg-white text-[#1250c8] border-white shadow-lg"
                      : "bg-white/10 text-white border-white/40 hover:bg-white/25"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons bas - Centrés au milieu en haut de Home */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button
          onClick={handleSuivant}
          disabled={!choix || isLoading}
          className={`w-full py-3.5 rounded-full font-black text-sm lg:text-base transition-all shadow-lg active:scale-95 pointer-events-auto ${
            choix && !isLoading
              ? "bg-[#1250c8] text-white hover:bg-[#1a3ea8] hover:-translate-y-0.5"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Traitement..." : "Voir les résultats"}
        </button>
      </div>

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <button
          onClick={onHome}
          className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm"
          aria-label="Accueil"
        >
          <HiOutlineHome size={30} />
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Loader Styles from Uiverse.io */
        .loader {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .jimu-primary-loading:before,
        .jimu-primary-loading:after {
          position: absolute;
          top: 0;
          content: '';
        }

        .jimu-primary-loading:before {
          left: -19.992px;
        }

        .jimu-primary-loading:after {
          left: 19.992px;
          -webkit-animation-delay: 0.32s !important;
          animation-delay: 0.32s !important;
        }

        .jimu-primary-loading:before,
        .jimu-primary-loading:after,
        .jimu-primary-loading {
          background: #ffffff;
          -webkit-animation: loading-keys-app-loading 0.8s infinite ease-in-out;
          animation: loading-keys-app-loading 0.8s infinite ease-in-out;
          width: 13.6px;
          height: 32px;
        }

        .jimu-primary-loading {
          text-indent: -9999em;
          margin: auto;
          position: absolute;
          right: calc(50% - 6.8px);
          top: calc(50% - 16px);
          -webkit-animation-delay: 0.16s !important;
          animation-delay: 0.16s !important;
        }

        @-webkit-keyframes loading-keys-app-loading {
          0%, 80%, 100% {
            opacity: .75;
            box-shadow: 0 0 #ffffff;
            height: 32px;
          }
          40% {
            opacity: 1;
            box-shadow: 0 -8px #ffffff;
            height: 40px;
          }
        }

        @keyframes loading-keys-app-loading {
          0%, 80%, 100% {
            opacity: .75;
            box-shadow: 0 0 #ffffff;
            height: 32px;
          }
          40% {
            opacity: 1;
            box-shadow: 0 -8px #ffffff;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
