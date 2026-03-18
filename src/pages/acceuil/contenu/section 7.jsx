import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";

const STATUTS = [
  "Collégien(ne)",
  "Lycéen(ne)",
  "Etudiant(e)",
  "En reconversion",
];

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[200px] lg:w-[280px] object-contain" />
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
    <div className="relative w-full min-h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full px-5 sm:px-8 pt-5 pb-4 overflow-hidden">
        {/* Back button */}
        <button 
          onClick={onRetour} 
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 shrink-0 mb-4" 
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <div className="flex flex-col items-center text-center w-full max-w-lg">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Tu es actuellement :
            </h1>
            
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
              Indique ta situation pour adapter les recommandations.
            </p>

            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mb-6">
              {STATUTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatut(s)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    statut === s
                      ? "bg-white text-[#1250c8] border-white shadow-lg"
                      : "bg-white/10 text-white border-white/40 hover:bg-white/25"
                  }`}
                >
                  {s}
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
          disabled={!statut}
          className={`w-full py-3.5 rounded-full font-black text-sm lg:text-base transition-all shadow-lg active:scale-95 pointer-events-auto ${
            statut
              ? "bg-[#1250c8] hover:bg-[#1a3ea8] text-white hover:shadow-xl hover:-translate-y-0.5"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          }`}
        >
          Suivant
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
      `}</style>
    </div>
  );
}