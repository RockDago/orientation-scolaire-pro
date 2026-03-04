import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
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
          <rect x="50" y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
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

export default function Section11({ metier, onRetour, onVoirFormations }) {
  const navigate = useNavigate();

  const titre = metier?.titre || "Ingénieur en informatique";
  const mention = metier?.mention || "Informatique";
  const parcours = metier?.parcours || [
    "Bac scientifique ou technique (Série C, D ou Technique)",
    "Licence en Informatique – Université d'Antananarivo (ESPA) ou Université de Fianarantsoa",
    "Master / Diplôme d'Ingénieur – ESPA Antananarivo, IST Antananarivo ou EMIT",
  ];

  const metierCompatible = {
    id: metier?.id || "ingenieur-info",
    label: titre,
    mention: mention,
    description: metier?.description || "",
    parcours: parcours,
    profil: [],
  };

  return (
    <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <GradBg />

      {/* Conteneur principal avec padding et hauteur pleine */}
      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4">

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
          {/* Badge aligné à gauche */}
          <span className="inline-block self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mt-3 mb-2" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
            Parcours de formation
          </span>

          {/* Titre principal aligné à gauche - taille comme section 7 */}
          <h1 className="self-start text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-1">
            Devenir
          </h1>
          
          {/* Sous-titre aligné à gauche - taille adaptée */}
          <h2 className="self-start text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 break-words" style={{ color: "rgba(255,255,255,0.9)" }}>
            {titre}
          </h2>

          {/* Mention badge aligné à gauche */}
          <span className="inline-block self-start bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
            {mention}
          </span>

          {/* Conteneur centré pour les étapes */}
          <div className="flex flex-col items-center w-full">
            {/* Étapes - avec largeur maximale contrôlée */}
            <div className="w-full max-w-2xl flex flex-col gap-0 mb-6">
              {parcours.map((etape, i) => (
                <div key={i} className="flex items-stretch gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 z-10"
                      style={{
                        background: i === parcours.length - 1 ? "white" : "rgba(255,255,255,0.25)",
                        color: i === parcours.length - 1 ? "#1250c8" : "white",
                        border: "2px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < parcours.length - 1 && (
                      <div className="w-0.5 flex-1 my-1" style={{ background: "rgba(255,255,255,0.3)", minHeight: "20px" }} />
                    )}
                  </div>

                  <div
                    className="flex-1 rounded-2xl px-4 py-3"
                    style={{
                      background: i === parcours.length - 1 ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)",
                      border: i === parcours.length - 1 ? "1px solid rgba(255,255,255,0.45)" : "1px solid rgba(255,255,255,0.18)",
                      marginBottom: i < parcours.length - 1 ? "8px" : "0",
                    }}
                  >
                    <p className="text-sm sm:text-base font-semibold text-white leading-snug break-words">{etape}</p>
                    {i === parcours.length - 1 && (
                      <div className="flex items-center gap-1 mt-1">
                        <FiCheckCircle size={12} style={{ color: "#a0d820" }} />
                        <span className="text-[11px] font-semibold" style={{ color: "#a0d820" }}>Objectif final</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone fixe en bas pour le bouton et l'icône home */}
        <div className="flex flex-col items-center gap-4 mt-4">
          {/* Bouton fixe */}
          <button
            onClick={() => onVoirFormations?.(metierCompatible)}
            className="w-full max-w-xs py-4 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 bg-[#1a3ea8] hover:bg-[#122d88] text-white shadow-lg hover:shadow-xl"
          >
            Voir l'établissement
            <FiArrowRight size={16} />
          </button>

          {/* Home fixe */}
          <div className="flex justify-center py-2">
            <button onClick={() => navigate("/acceuil/orientation")} className="text-white hover:text-white/80 transition-colors" aria-label="Accueil">
              <HiOutlineHome size={30} />
            </button>
          </div>
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