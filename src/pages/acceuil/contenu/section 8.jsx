import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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


export default function Section8({ onSuivant, onRetour, onHome }) {
  const navigate       = useNavigate();
  const [allDomaines, setAllDomaines] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [open,        setOpen]        = useState(false);
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null);

  const triggerRef  = useRef(null);
  const dropdownRef = useRef(null);
  const [triggerRect, setTriggerRect] = useState(null);

  // ── Lit la position RÉELLE du trigger après que la transition CSS soit finie ──
  // On attend 520ms (durée de la transition 500ms + marge) avant de lire le rect.
  const readRect = useCallback(() => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (!open) { setTriggerRect(null); return; }
    // Lecture immédiate pour afficher le dropdown rapidement, puis correction
    // après la fin de la transition translateY (500ms).
    readRect();
    const timer = setTimeout(readRect, 520);
    window.addEventListener("resize", readRect);
    window.addEventListener("scroll", readRect, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", readRect);
      window.removeEventListener("scroll", readRect, true);
    };
  }, [open, readRect]);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current  && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown",  handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown",  handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);


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
    return allDomaines.map((d) => ({ value: d.id || d.label, label: d.label }));
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

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSuivantClick = () => {
    if (selected) onSuivant?.(selected.label);
  };


  // ── Calcul de la position et hauteur max du dropdown ───────────────────────
  // triggerRect est lu APRÈS la transition CSS (voir useEffect avec setTimeout 520ms),
  // donc les coordonnées sont toujours exactes, peu importe le translateY du parent.
  const BOTTOM_SAFE = 110; // dégager bouton Suivant (bottom-20 ≈ 80px) + Home (bottom-4 ≈ 16px) + marge

  const dropdownStyle = useMemo(() => {
    if (!triggerRect) return { visibility: "hidden" };
    const spaceBelow = window.innerHeight - triggerRect.bottom - BOTTOM_SAFE;
    const maxH       = Math.max(120, Math.min(spaceBelow, 260));
    return {
      position:  "fixed",
      top:       triggerRect.bottom + 8,
      left:      triggerRect.left,
      width:     triggerRect.width,
      maxHeight: maxH,
      zIndex:    9999,
    };
  }, [triggerRect]);

  const listMaxHeight = triggerRect
    ? Math.max(60, (dropdownStyle.maxHeight ?? 200) - 56)
    : 144;


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
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <GradBg />

      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-4 overflow-hidden">
        {/* Retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Zone centrale — le texte ET le trigger montent ensemble quand open=true */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <div
            className="flex flex-col items-center text-center w-full max-w-2xl transition-transform duration-500 ease-in-out"
            style={{ transform: open ? "translateY(-60px)" : "translateY(0)" }}
          >
            {/* Titre + description — s'estompent quand ouvert */}
            <div
              className="transition-all duration-500 ease-in-out"
              style={{
                opacity:   open ? 0.3 : 1,
                transform: open ? "translateY(-12px)" : "translateY(0)",
              }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4 uppercase">
                Explorer par<br />domaine
              </h1>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
                Sélectionne le domaine qui t'intéresse pour découvrir
                immédiatement les métiers disponibles.
              </p>
            </div>

            {/* ── Trigger du combobox ────────────────────────────────────── */}
            <div className="w-full max-w-sm">
              <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
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
            </div>

            {selected && !open && (
              <p className="mt-4 text-white/70 text-sm font-medium animate-fadeIn">
                ✓ «{selected.label}» sélectionné
              </p>
            )}
          </div>
        </div>
      </div>


      {/* ── Dropdown en position FIXED — toujours devant tout ─────────────────── */}
      {open && (
        <div
          ref={dropdownRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn flex flex-col"
          style={{
            ...dropdownStyle,
            // Masque le flash pendant les 520ms d'attente de la transition
            opacity: triggerRect ? 1 : 0,
            pointerEvents: triggerRect ? "auto" : "none",
            transition: "opacity 0.15s ease",
          }}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 flex-shrink-0">
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

          {/* Liste scrollable */}
          <ul
            className="overflow-y-auto p-1.5 scrollbar-gray flex-1"
            style={{ maxHeight: listMaxHeight }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(o)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                      selected?.value === o.value
                        ? "bg-[#1250c8] text-white"
                        : "text-gray-700 hover:bg-gray-50"
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


      {/* Bouton Suivant */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button
          onClick={handleSuivantClick}
          disabled={!selected}
          className={`w-full py-3 sm:py-4 rounded-full font-black text-base transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 pointer-events-auto ${
            selected
              ? "bg-[#1250c8] text-white hover:bg-[#1a3ea8] hover:-translate-y-0.5"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          }`}
        >
          Suivant
        </button>
      </div>

      {/* Bouton Home */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <button
          onClick={onHome}
          className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm"
          aria-label="Accueil"
        >
          <HiOutlineHome size={26} className="sm:hidden" />
          <HiOutlineHome size={30} className="hidden sm:block" />
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