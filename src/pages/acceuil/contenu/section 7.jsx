import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";
import Boutton from "../../../components/ui/boutton";

const STATUTS = [
  "Lycéen(ne)",
  "Etudiant(e)",
  "En reconversion",
];

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[160px] lg:w-[280px] object-contain" />
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function Section7({ onSuivant, onRetour, onHome }) {
  const navigate = useNavigate();
  const [statut, setStatut] = useState(null);

  const handleSuivant = () => {
    if (!statut) return;
    onSuivant?.(statut);
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-32 sm:pb-36">
        {/* Back button */}
        <button 
          onClick={onRetour} 
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 shrink-0 mb-4" 
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 min-h-full flex flex-col justify-center items-center py-4 sm:py-6">
          <div className="s7-panel flex flex-col items-center text-center w-full max-w-lg">
            <h1 className="s7-title text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4 uppercase">
              Tu es actuellement :
            </h1>
            
            <p className="s7-desc text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
              Indique ta situation pour adapter les recommandations.
            </p>

            <div className="s7-choices flex flex-wrap justify-center gap-3 w-full max-w-md mb-6">
              {STATUTS.map((s) => (
                <Boutton
                  key={s}
                  onClick={() => setStatut(s)}
                  size="sm"
                  variant={statut === s ? "chipActive" : "chip"}
                >
                  {s}
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
          disabled={!statut}
          fullWidth
          size="lg"
          variant={statut ? "primary" : "soft"}
          className="pointer-events-auto"
        >
          Suivant
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
        .s7-title {
          font-size: clamp(2rem, 5vw, 4.1rem);
        }
        .s7-desc {
          font-size: clamp(0.82rem, 1vw, 0.98rem);
        }
        @media (max-height: 820px) {
          .s7-title {
            font-size: clamp(1.7rem, 4vw, 3.1rem);
            margin-bottom: 0.75rem;
          }
          .s7-desc {
            font-size: 0.78rem;
            margin-bottom: 1rem;
          }
          .s7-choices {
            gap: 0.6rem;
            margin-bottom: 1rem;
          }
          .s7-choices > button {
            font-size: 0.82rem;
            padding: 0.55rem 0.95rem;
          }
        }
        @media (max-height: 720px) {
          .s7-title {
            font-size: clamp(1.55rem, 3.5vw, 2.5rem);
          }
          .s7-desc {
            font-size: 0.74rem;
          }
          .s7-choices > button {
            font-size: 0.76rem;
            padding: 0.5rem 0.85rem;
          }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
