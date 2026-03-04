import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 opacity-90 scale-110 lg:scale-125 origin-top-right">
        <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round"/>
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
          <circle cx="232" cy="155" r="7" fill="white"/>
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4"/>
          <circle cx="130" cy="94" r="5" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10" y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="50" y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function Section6({ onCommencer, onRetour }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <GradBg />

      {/* Structure simplifiée - sans la colonne décorative qui causait des problèmes de centrage */}
      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-5 lg:pt-14">

        {/* Back button aligné à gauche */}
        <button 
          onClick={onRetour} 
          className="self-start text-white/80 hover:text-white transition-colors w-11 h-11 flex items-center justify-center" 
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={38} />
        </button>

        {/* Zone de contenu scrollable */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {/* Contenu aligné à gauche */}
          <div className="flex flex-col items-start w-full max-w-2xl">
            {/* Titre aligné à gauche - taille comme section 7 */}
            <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-4">
              TROUVER<br />MON ORIENTATION
            </h1>
            
            {/* Sous-texte aligné à gauche */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-sm mb-10">
              Réponds à quelques questions. Cela prendra moins de 2 minutes.
            </p>

            {/* Bouton CTA aligné à gauche */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => onCommencer?.()}
                className="w-full bg-[#1a3ea8] hover:bg-[#122d88] text-white border-none rounded-full px-6 py-4 flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-xl transition-all font-bold text-base"
              >
                <span>Commencer</span>
                <HiOutlineSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Zone fixe en bas pour l'icône home - centrée */}
        <div className="flex justify-center py-6">
          <button onClick={() => navigate("/acceuil")} className="text-white hover:text-white/80 transition-colors" aria-label="Accueil">
            <HiOutlineHome size={30} />
          </button>
        </div>
      </div>

      {/* Style pour cacher la scrollbar tout en gardant le défilement */}
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