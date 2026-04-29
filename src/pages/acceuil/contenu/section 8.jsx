import { useState, useEffect, useMemo, useRef } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiChevronDown, HiCheck, HiX, HiOutlineSearch } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
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
  const [allDomaines, setAllDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  if (loading) {
    return (
      <div className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Chargement des domaines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="s8-root">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <GradBg />

      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className={`relative ${open ? "z-[220]" : "z-10"} flex-1 flex flex-col w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-32 sm:pb-36 overflow-hidden`}>
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        <div className="flex-1 flex flex-col justify-center items-center py-4 relative z-[100]">
          <div className={`s8-panel ${open ? "open" : ""}`}>
            <div className={`s8-header ${open ? "open" : ""}`}>
              <h1 className="s8-h1">
                Explorer par<br />domaine
              </h1>
              <p className="s8-desc">
                Sélectionne le domaine qui t&apos;intéresse pour découvrir
                immédiatement les métiers disponibles.
              </p>
            </div>

            <div className="s8-cbwrap">
              <p className="s8-lbl">Explorer par domaine</p>

              <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                className="s8-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls="section8-domaines"
              >
                <span className={selected ? "s8-val" : "s8-ph"}>
                  {selected ? selected.label : "Sélectionner un domaine..."}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {selected && (
                    <HiX
                      size={16}
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                      onClick={() => setSelected(null)}
                    />
                  )}
                  <HiChevronDown className={`s8-icon ${open ? "rot180" : ""}`} />
                </div>
              </button>

              {open && (
                <div ref={dropdownRef} className="s8-drop s8-fadein">
                  <div className="s8-drop-search">
                    <div className="relative">
                      <HiOutlineSearch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="s8-drop-input pr-8"
                        aria-label="Rechercher un domaine"
                      />
                      {search && (
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearch("");
                          }}
                        >
                          <HiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div id="section8-domaines" className="s8-drop-list" role="listbox" aria-label="Liste des domaines">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => handleSelect(o)}
                          className={`s8-drop-item ${selected?.value === o.value ? "active" : ""}`}
                          role="option"
                          aria-selected={selected?.value === o.value}
                        >
                          <span className="s8-item-name">{o.label}</span>
                          {selected?.value === o.value && <HiCheck className="text-blue-600" size={14} />}
                        </button>
                      ))
                    ) : (
                      <div className="py-4 text-center text-xs text-gray-400 italic">Aucun résultat</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selected && !open && (
              <p className="mt-4 text-white/70 text-sm font-medium animate-fadeIn text-center">
                ✓ «{selected.label}» sélectionné
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button
          onClick={handleSuivantClick}
          disabled={!selected || open}
          className={`w-full py-3 sm:py-4 rounded-full font-black text-[clamp(0.84rem,1.05vw,1rem)] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 pointer-events-auto ${
            selected && !open
              ? "bg-[#1250c8] text-white hover:bg-[#1a3ea8] hover:-translate-y-0.5"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          }`}
        >
          Suivant
        </button>
      </div>

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
        .s8-root {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg,#1250c8 0%,#1a6dcc 25%,#28b090 55%,#a0d820 80%,#c2e832 100%);
          overflow: hidden;
        }
        .s8-root *, .s8-root *::before, .s8-root *::after {
          box-sizing: border-box;
          font-family: "Sora", sans-serif;
        }
        .s8-panel {
          width: 100%;
          max-width: 30rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
          transform: translateY(0);
        }
        .s8-panel.open {
          transform: translateY(-180px);
        }
        .s8-header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .s8-header.open {
          opacity: 0.3;
          transform: translateY(-12px);
        }
        .s8-h1 {
          margin: 0 0 1rem;
          font-size: clamp(1.95rem, 4.6vw, 3.6rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-weight: 900;
          text-transform: uppercase;
          color: white;
        }
        .s8-desc {
          margin: 0 0 1.5rem;
          max-width: 30ch;
          font-size: clamp(0.8rem, 1vw, 0.95rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
        }
        .s8-cbwrap {
          position: relative;
          width: 100%;
          max-width: 25rem;
          z-index: 120;
        }
        .s8-cbwrap:focus-within {
          z-index: 200;
        }
        .s8-lbl {
          margin: 0 0 0.5rem 0.25rem;
          text-align: left;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }
        .s8-trigger {
          width: 100%;
          min-height: 50px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          padding: clamp(0.65rem, 1vw, 0.8rem) clamp(0.85rem, 1vw, 1rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .s8-trigger:hover {
          background: white;
          box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .s8-ph {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: clamp(0.7rem, 0.9vw, 0.85rem);
          font-weight: 500;
          color: #94a3b8;
        }
        .s8-val {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: clamp(0.7rem, 0.9vw, 0.85rem);
          font-weight: 700;
          color: #166534;
        }
        .s8-icon {
          font-size: 1.125rem;
          color: #22c55e;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .rot180 {
          transform: rotate(180deg);
        }
        .s8-drop {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 1.25rem;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(0, 0, 0, 0.05);
          z-index: 1000;
          overflow: hidden;
          max-height: min(22rem, calc(100dvh - 13rem));
        }
        .s8-drop-search {
          padding: 0.65rem 0.85rem;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .s8-drop-input {
          width: 100%;
          min-height: 44px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.45rem 0.7rem 0.45rem 2.1rem;
          font-size: clamp(0.7rem, 0.9vw, 0.82rem);
          font-weight: 500;
          outline: none;
          color: #1e293b;
        }
        .s8-drop-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .s8-drop-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 0.45rem;
        }
        .s8-drop-item {
          width: 100%;
          min-height: 44px;
          padding: 0.65rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          border: none;
          background: transparent;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .s8-drop-item:hover {
          background: #eff6ff;
        }
        .s8-drop-item.active {
          background: #eff6ff;
          color: #2563eb;
        }
        .s8-item-name {
          font-size: clamp(0.72rem, 0.9vw, 0.82rem);
          font-weight: 600;
          color: #1e293b;
        }
        .s8-drop-item.active .s8-item-name {
          color: #2563eb;
        }
        .s8-fadein {
          animation: s8FadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .scrollbar-gray::-webkit-scrollbar { width: 6px; }
        .scrollbar-gray::-webkit-scrollbar-track { background: rgba(15,23,42,0.04); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.20); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.30); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes s8FadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
        @media (min-width: 640px) {
          .s8-panel.open { transform: translateY(-160px); }
        }
        @media (min-width: 1024px) {
          .s8-panel.open { transform: translateY(-145px); }
        }
        @media (max-height: 860px) {
          .s8-h1 { font-size: clamp(1.7rem, 3.8vw, 3rem); }
          .s8-desc { font-size: 0.78rem; }
          .s8-panel.open { transform: translateY(-205px); }
          .s8-drop { max-height: min(19rem, calc(100dvh - 11rem)); }
        }
        @media (max-height: 760px) {
          .s8-panel.open { transform: translateY(-230px); }
          .s8-drop { max-height: min(16.5rem, calc(100dvh - 9rem)); }
          .s8-trigger { min-height: 52px; }
          .s8-drop-input { min-height: 40px; }
          .s8-drop-item { min-height: 40px; }
        }
      `}</style>
    </div>
  );
}
