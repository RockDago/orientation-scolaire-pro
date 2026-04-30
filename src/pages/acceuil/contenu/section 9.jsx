import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";
import Boutton from "../../../components/ui/boutton";

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
        <img src={pictoOrientation} alt="" className="w-[160px] lg:w-[280px] object-contain" />
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
    <div className="relative w-full min-h-[100dvh] overflow-hidden font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
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

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col h-full w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-32 sm:pb-36">
        {/* Back button */}
        <button
          onClick={onRetour}
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 min-h-full flex flex-col justify-center items-center py-4 sm:py-6">
          <div className="s9-panel flex flex-col items-center text-center w-full max-w-2xl">
            <h1 className="s9-title text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4 uppercase">
              Tu te vois
              <br />
              plutôt…
            </h1>

            <p className="s9-desc text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
              Choisis le type de parcours qui te correspond.
            </p>

            <div className="s9-choices flex flex-wrap justify-center gap-3 w-full max-w-md mb-6">
              {CHOIX_ETUDES.map((item) => (
                <Boutton
                  key={item.value}
                  onClick={() => handleChoix(item)}
                  size="sm"
                  variant={choix === item.value ? "chipActive" : "chip"}
                >
                  {item.label}
                </Boutton>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons bas - Centrés au milieu en haut de Home */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <Boutton
          onClick={handleSuivant}
          disabled={!choix || isLoading}
          fullWidth
          size="lg"
          variant={choix && !isLoading ? "primary" : "soft"}
          className="pointer-events-auto"
        >
          {isLoading ? "Traitement..." : "Résultats"}
        </Boutton>
      </div>

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <Boutton
          onClick={onHome}
          size="icon"
          variant="ghost"
          className="pointer-events-auto"
          aria-label="Accueil"
        >
          <HiOutlineHome size={26} className="sm:hidden" />
          <HiOutlineHome size={30} className="hidden sm:block" />
        </Boutton>
      </div>

      <style>{`
        .s9-title {
          font-size: clamp(2rem, 5vw, 4.1rem);
        }
        .s9-desc {
          font-size: clamp(0.82rem, 1vw, 0.98rem);
        }
        @media (max-height: 820px) {
          .s9-title {
            font-size: clamp(1.7rem, 4vw, 3rem);
            margin-bottom: 0.75rem;
          }
          .s9-desc {
            font-size: 0.78rem;
            margin-bottom: 1rem;
          }
          .s9-choices {
            gap: 0.6rem;
            margin-bottom: 1rem;
          }
          .s9-choices > button {
            font-size: 0.82rem;
            padding: 0.55rem 0.95rem;
          }
        }
        @media (max-height: 720px) {
          .s9-title {
            font-size: clamp(1.55rem, 3.5vw, 2.45rem);
          }
          .s9-desc {
            font-size: 0.74rem;
          }
          .s9-choices > button {
            font-size: 0.76rem;
            padding: 0.5rem 0.85rem;
          }
        }
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
