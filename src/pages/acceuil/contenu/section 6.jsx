import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiOutlineSearch } from "react-icons/hi";
import { GiDiploma } from "react-icons/gi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";

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

export default function Section6({ onCommencer, onRetour, onHome }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-20 lg:pb-4">

        {/* Back button aligné à gauche */}
        <button 
          onClick={onRetour} 
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 shrink-0" 
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 flex flex-col justify-center items-center py-8">
          {/* Contenu centré */}
          <div className="flex flex-col items-center text-center w-full max-w-2xl">
            {/* Titre aligné à gauche - taille comme section 7 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              TROUVER<br />MON ORIENTATION
            </h1>
            
            {/* Sous-texte centré */}
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs sm:max-w-sm mb-6 lg:mb-4">
              Réponds à quelques questions. Cela prendra moins de 2 minutes.
            </p>

            {/* Le bouton est maintenant relocalisé en bas du composant */}
          </div>
        </div>
      </div>

      {/* Boutons bas - Centrés au milieu en haut de Home */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button
          onClick={() => onCommencer?.()}
          className="w-full bg-[#1250c8] hover:bg-[#1a3ea8] text-white border-none rounded-full px-8 py-3 sm:py-4 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all font-black text-sm lg:text-base active:scale-95 pointer-events-auto"
        >
          <span>Commencer</span>
        </button>
      </div>

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <button onClick={onHome} className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm" aria-label="Accueil">
          <HiOutlineHome size={26} className="sm:hidden" />
          <HiOutlineHome size={30} className="hidden sm:block" />
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}