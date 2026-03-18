import { useState, useEffect, useMemo } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiChevronDown, HiCheck } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useNavigate } from "react-router-dom";
import { getAllDomaines } from "../../../services/domaine.services";

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

export default function Section8({ onSuivant, onRetour, onHome }) {
  const navigate    = useNavigate();
  const [allDomaines, setAllDomaines] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [open,        setOpen]        = useState(false);
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null); 

  useEffect(() => {
    const loadDomaines = async () => {
      try {
        const domaines = await getAllDomaines();
        setAllDomaines(domaines);
      } catch (error) {
        console.error("Erreur chargement domaines:", error);
        setAllDomaines([]);
      } finally {
        setLoading(false);
      }
    };
    loadDomaines();
  }, []);

  const domaineOptions = useMemo(() => {
    return allDomaines.map((d) => ({
      value: d.id || d.label,
      label: d.label,
    }));
  }, [allDomaines]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return domaineOptions;
    return domaineOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, domaineOptions]);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    setSearch("");
  };

  const handleSuivantClick = () => {
    if (selected) {
      onSuivant?.(selected.label);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Chargement des domaines…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full px-5 sm:px-8 pt-5 pb-4 overflow-hidden">
        {/* Retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Zone de contenu - centrée verticalement et horizontalement */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <div className="flex flex-col items-center text-center w-full max-w-2xl">

            <div className={`transition-all duration-500 ease-in-out ${open ? "-translate-y-12 opacity-30" : "translate-y-0 opacity-100"}`}>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                Explorer par<br />domaine
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
                Sélectionne le domaine qui t'intéresse pour découvrir
                immédiatement les métiers disponibles.
              </p>
            </div>

            {/* Combobox inline */}
            <div className="w-full max-w-sm relative z-[200]">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-white/95 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span className={`text-sm font-semibold truncate ${selected ? "text-[#1250c8]" : "text-gray-400"}`}>
                  {selected ? selected.label : "Choisir un domaine…"}
                </span>
                <HiChevronDown
                  className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>

              {open && (
                <div className="absolute z-50 left-0 right-0 lg:bottom-full lg:mb-2 top-full mt-2 lg:top-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un domaine…"
                        className="w-full bg-gray-50 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none"
                      />
                    </div>
                  </div>
                  <ul className="max-h-56 overflow-y-auto p-1.5 scrollbar-gray">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((o) => (
                        <li key={o.value}>
                          <button
                            type="button"
                            onClick={() => handleSelect(o)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                              selected?.value === o.value ? "bg-[#1250c8] text-white" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {o.label}
                            {selected?.value === o.value && <HiCheck size={14} />}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-3 text-sm text-gray-400 text-center">Aucun résultat</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {selected && (
              <p className="mt-4 text-white/70 text-sm font-medium animate-fadeIn">
                ✓ «{selected.label}» sélectionné
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Boutons bas - Centrés au milieu en haut de Home */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button
          onClick={handleSuivantClick}
          disabled={!selected}
          className={`w-full py-4 rounded-full font-black text-base transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 pointer-events-auto ${
            selected
              ? "bg-[#1250c8] text-white hover:bg-[#1a3ea8] hover:-translate-y-0.5"
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
        .scrollbar-gray::-webkit-scrollbar { width: 6px; }
        .scrollbar-gray::-webkit-scrollbar-track { background: rgba(15,23,42,0.04); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.20); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.30); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
    </div>
  );
}
