import { useState, useRef, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiChevronDown } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const DOMAINES = [
  { value: "Santé", label: "Santé & Médecine" },
  { value: "Banque / Finance", label: "Banque / Finance" },
  { value: "Administration", label: "Administration & Droit" },
  { value: "Technologies de l'information", label: "Technologies de l'information" },
  { value: "Tourisme", label: "Tourisme & Hôtellerie" },
  { value: "Industrie", label: "Industrie & Technique" },
  { value: "Agriculture", label: "Agriculture & Agronomie" },
  { value: "Enseignement", label: "Enseignement & Éducation" },
  { value: "Communication", label: "Arts & Communication" },
  { value: "Logistique", label: "Logistique & Transport" },
  { value: "Génie civil", label: "Génie civil / BTP" },
  { value: "Autres", label: "Autres domaines" },
];

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

function Combobox({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white/95 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        <span className={`text-sm font-semibold truncate ${selected ? "text-[#1250c8]" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <HiChevronDown className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} size={18} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-gray-50 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1250c8]/30"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto p-1.5">
            {filtered.map(o => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    value === o.value
                      ? "bg-[#1250c8] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {o.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">Aucun résultat</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Section8({ onSuivant, onRetour }) {
  const navigate = useNavigate();
  const [domaine, setDomaine] = useState(null);

  const handleSuivant = () => {
    if (!domaine) return;
    onSuivant?.(domaine);
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
          {/* Contenu aligné à gauche */}
          <div className="flex flex-col items-start w-full max-w-lg">
            {/* Titre aligné à gauche - taille comme section 7 */}
            <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-4">
              Quel domaine<br />t'attire le plus ?
            </h1>
            
            {/* Sous-texte aligné à gauche */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md lg:max-w-sm mb-6">
              Sélectionne le domaine qui te parle le plus.
            </p>

            {/* Combobox alignée à gauche */}
            <div className="w-full mb-8">
              <Combobox
                options={DOMAINES}
                value={domaine}
                onChange={setDomaine}
                placeholder="Choisir un domaine…"
              />
            </div>
          </div>
        </div>

        {/* Zone fixe en bas pour le bouton et l'icône home */}
        <div className="flex flex-col items-center gap-4 mt-4">
          {/* Bouton Suivant - style comme section 6 */}
          <button
            onClick={handleSuivant}
            disabled={!domaine}
            className={`w-full max-w-xs py-4 rounded-full font-bold text-sm transition-all shadow-lg ${
              domaine
                ? "bg-[#1a3ea8] hover:bg-[#122d88] text-white hover:shadow-xl"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }`}
          >
            Suivant
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