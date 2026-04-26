import { useMemo, useState, useEffect, useRef } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiX,
  HiChevronDown,
  HiCheck,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAllMetiersCache }  from "../../../services/metier.services";
import { getAllDomaines }      from "../../../services/domaine.services";
import { searchMetier }        from "../../../services/metier.services";
import { ChevronDown, Search } from "lucide-react";
import BuildingSVG        from "./BuildingSVG";
import pictoExplorer      from "../../../assets/picto_Explorer.png";


function MetierDetailsCard({ metier, onClose }) {
  if (!metier) return null;
  return (
    <div className="relative rounded-2xl p-5 h-full flex flex-col bg-white/10 backdrop-blur-2xl border border-white/25">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 z-10 transition-colors"
          aria-label="Fermer"
        >
          <HiX size={16} />
        </button>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-4 pr-1">
        <div>
          <h3 className="text-white font-black text-xl leading-snug pr-8">{metier.label}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">{Array.isArray(metier.domaine) ? metier.domaine.join(", ") : metier.domaine}</span>
            <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">Niveau : {Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}</span>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Description du métier</p>
          <p className="text-white text-sm leading-relaxed">{metier.description}</p>
        </div>
        {metier.parcours?.length > 0 && (
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1.5">Parcours d'études possibles</p>
            <div className="flex flex-wrap gap-1.5">
              {metier.parcours.map((p, i) => (
                <span key={i} className="text-[11px] bg-white/15 border border-white/20 px-2.5 py-1 rounded-full text-white">{p}</span>
              ))}
            </div>
          </div>
        )}
        {metier.profil?.length > 0 && (
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1.5">Séries recommandées</p>
            <div className="flex flex-wrap gap-1.5">
              {metier.profil.map((p, i) => (
                <span key={i} className="text-[11px] bg-white/20 border border-white/30 text-white px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetierCard({ metier, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(metier)}
      className="w-full text-left bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-4 transition-all hover:bg-white/18 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-white font-bold text-base leading-snug flex-1">{metier.label}</span>
        <span className="text-white/90 text-[10px] font-bold bg-[#1a3ea8]/80 px-2 py-0.5 rounded-full shrink-0">{Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}</span>
      </div>
      {metier.description && (
        <p className="text-white/75 text-xs leading-relaxed line-clamp-2 mb-1.5">{metier.description}</p>
      )}
      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">{Array.isArray(metier.domaine) ? metier.domaine.join(", ") : metier.domaine}</p>
    </button>
  );
}

export default function Section2({ onSelectMetier, selectedMetier, onRetour, searchParam, onHome }) {
  const navigate = useNavigate();
  const [allMetiers,  setAllMetiers]  = useState([]);
  const [allDomaines, setAllDomaines] = useState([]);
  const [_loading,    _setLoading]    = useState(true);
  const [isLoading,   setIsLoading]   = useState(false);

  const [isMetierComboOpen, setIsMetierComboOpen] = useState(false);
  const [searchQuery,       setSearchQuery]       = useState(searchParam || "");
  const [localSelected,     setLocalSelected]     = useState(selectedMetier || null);

  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [isComboOpen,     setIsComboOpen]     = useState(false);
  const [comboSearch,     setComboSearch]     = useState("");

  const [mode, setMode] = useState("idle");

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const metierComboRef = useRef(null);
  const comboRef       = useRef(null);

  // Reset state when return from parent (metierSelectionne becomes null)
  useEffect(() => {
    if (selectedMetier === null) {
      setLocalSelected(null);
      setSearchQuery("");
      setMode("idle");
      setSelectedDomaine(null);
    }
  }, [selectedMetier]);

  useEffect(() => {
    if (searchParam && searchParam.trim()) {
      setSearchQuery(searchParam);
      setIsMetierComboOpen(true);
    }
  }, [searchParam]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metiers, domaines] = await Promise.all([getAllMetiersCache(), getAllDomaines()]);
        setAllMetiers(metiers);
        setAllDomaines(domaines);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        _setLoading(false);
      }
    };
    loadData();
  }, []);

  const domainesList = useMemo(() =>
    allDomaines.map((d) => ({ id: d.id, label: d.label, keywords: [d.label.toLowerCase()] })),
    [allDomaines]
  );

  const filteredMetiers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allMetiers;
    return allMetiers.filter((m) => {
      const domaineStr = Array.isArray(m.domaine) ? m.domaine.join(" ") : (m.domaine || "");
      return (m.label + " " + domaineStr + " " + m.description + " " + (m.parcours?.join(" ") || ""))
        .toLowerCase().includes(q);
    });
  }, [searchQuery, allMetiers]);

  const filteredDomaines = useMemo(() => {
    const q = comboSearch.trim().toLowerCase();
    if (!q) return domainesList;
    return domainesList.filter((d) => d.label.toLowerCase().includes(q));
  }, [comboSearch, domainesList]);

  const hasMetierSearchText = searchQuery.trim().length > 0;
  const focusMetierSearch = isMetierComboOpen && hasMetierSearchText;
  const metierFocusLayout = mode === "metier" || focusMetierSearch;

  const metiersParDomaine = useMemo(() => {
    if (!selectedDomaine) return [];
    const domaineNorm = selectedDomaine.label.toLowerCase().trim();
    return allMetiers.filter((m) => {
      // m.domaine peut être un tableau JSON ["Informatique", ...] ou une string
      if (Array.isArray(m.domaine)) {
        return m.domaine.some((d) => {
          const dNorm = String(d).toLowerCase().trim();
          return dNorm === domaineNorm || dNorm.includes(domaineNorm) || domaineNorm.includes(dNorm);
        });
      }
      const fieldDomNorm = (m.domaine || "").toLowerCase().trim();
      return fieldDomNorm === domaineNorm || fieldDomNorm.includes(domaineNorm) || domaineNorm.includes(fieldDomNorm);
    });
  }, [selectedDomaine, allMetiers]);

  const handleSelectMetier = (metier, isFromDomain = false) => {
    if (metier.id && metier.label) searchMetier(metier.id, metier.label).catch(console.error);
    setLocalSelected(metier);
    setIsMetierComboOpen(false);
    setSearchQuery("");
    
    if (isFromDomain) {
      handleLancerRecherche(metier);
    } else {
      setSelectedDomaine(null);
      setMode("metier");
    }
  };

  const handleLancerRecherche = (metierToUse = null) => {
    const targetMetier = metierToUse || localSelected;
    if (!targetMetier) return;
    
    setIsLoading(true);
    setTimeout(() => {
      onSelectMetier?.(targetMetier);
      setIsLoading(false);
    }, 5000);
  };

  const handleSelectDomaine = (d) => {
    setSelectedDomaine(d);
    setLocalSelected(null);
    setIsComboOpen(false);
    setComboSearch("");
    setMode("domaine");
  };

  const handleValider = () => {
    if (localSelected) onSelectMetier?.(localSelected);
  };

  useEffect(() => {
    const handler = (e) => {
      if (metierComboRef.current && !metierComboRef.current.contains(e.target)) {
        setIsMetierComboOpen(false);
      }
      if (comboRef.current && !comboRef.current.contains(e.target)) {
        setIsComboOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="s2-root"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[500] bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] flex items-center justify-center">
          <div className="s2-deco-tr">
            <img src={pictoExplorer} alt="" className="w-[160px] lg:w-[260px] opacity-40 object-contain" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="loader">
              <div className="justify-content-center jimu-primary-loading"></div>
            </div>
            <div className="mt-20 flex flex-col items-center gap-2">
              <p className="text-white font-black text-2xl uppercase tracking-widest animate-pulse text-center px-4">
                Recherche de détails...
              </p>
              <p className="text-white/60 text-sm font-medium">Préparation de la fiche métier...</p>
            </div>
          </div>
        </div>
      )}

      {/* Déco SVG */}
      {/* Déco SVG */}
      <div className="s2-deco-tr">
          <img 
            src={pictoExplorer} 
            alt="" 
            className="w-[160px] lg:w-[260px] opacity-40 object-contain pointer-events-none"
          />
      </div>
      <div className="s2-deco-bld">
        <BuildingSVG className="w-full opacity-60" />
      </div>

      {/* Layout */}
      <div className={`s2-layout ${metierFocusLayout ? "metier-focus" : ""}`}>

        {/* ══ Colonne gauche ══ */}
        <div className={`s2-left transition-transform duration-500 ease-in-out ${metierFocusLayout ? "translate-y-0" : ((isMetierComboOpen || isComboOpen) ? "lg:-translate-y-20 -translate-y-12" : "translate-y-0")}`}>
          <div className="s2-scroll">
            <div className="flex items-center justify-between mb-2">
              {onRetour && (
                <button onClick={onRetour} className="s2-back" aria-label="Retour">
                  <IoArrowBackCircleOutline size={32} className="sm:hidden" />
                  <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
                </button>
              )}
            </div>

            {/* Titre et description centrés sur mobile */}
            <div 
              className={`s2-header-mob transition-all duration-500 ease-in-out ${(isMetierComboOpen || isComboOpen) ? "opacity-30 scale-95" : "opacity-100 scale-100"}`}
              style={{ animation: "s2In 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
            >
              <h1 className="s2-h1">
                EXPLORER<br /><span className="s2-h1-sub">LES MÉTIERS</span>
              </h1>
              <p className="s2-desc">
                Aide les élèves et les parents à choisir un métier et le parcours d'études adapté.
              </p>
            </div>

            {/* ── COMBOBOX 1 : Recherche métier ── */}
            <div className={`s2-cbwrap ${isMetierComboOpen ? "open" : ""}`} ref={metierComboRef}>
              <p className="s2-lbl">Rechercher un métier</p>
              <button
                className="s2-trigger"
                onClick={() => {
                  setIsMetierComboOpen((prev) => !prev);
                  setIsComboOpen(false);
                }}
              >
                <span className={localSelected ? "s2-val-new" : "s2-ph"}>
                  {localSelected ? localSelected.label : "Ex : développeur, infirmier…"}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {localSelected && (
                    <HiX 
                      size={16} 
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                      onClick={() => { setLocalSelected(null); setMode("idle"); }}
                    />
                  )}
                  <HiOutlineSearch className="s2-icon-blue" />
                </div>
              </button>

              {isMetierComboOpen && (
                <div className="s2-drop-new s2-fadein">
                  <div className="s2-drop-search-new">
                    <div className="relative">
                      <HiOutlineSearch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="s2-drop-input-new pr-8"
                        autoFocus
                      />
                      {searchQuery && (
                        <button 
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                        >
                          <HiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="s2-drop-list-new">
                    {filteredMetiers.length > 0 ? filteredMetiers.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMetier(m, false)}
                        className={`s2-drop-item-new ${localSelected?.id === m.id ? "active" : ""}`}
                      >
                        <div className="flex flex-col">
                          <span className="s2-item-name">{m.label}</span>
                          <span className="s2-item-badge">{Array.isArray(m.domaine) ? m.domaine.join(", ") : m.domaine}</span>
                        </div>
                        {localSelected?.id === m.id && <HiCheck className="text-blue-600" size={14} />}
                      </div>
                    )) : (
                      <div className="py-4 text-center text-xs text-gray-400 italic">Aucun résultat</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Séparateur ── */}
            {mode !== "metier" && !focusMetierSearch && (
              <>
                <div className="s2-sep" style={{ animation: "s2In 0.55s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}>
                  <div className="s2-sep-l" /><span className="s2-sep-txt">ou</span><div className="s2-sep-l" />
                </div>

                {/* ── COMBOBOX 2 : Recherche domaine ── */}
                <div className={`s2-cbwrap ${isComboOpen ? "open" : ""}`} ref={comboRef}>
                  <p className="s2-lbl">Explorer par domaine</p>
                  <button
                    onClick={() => {
                      setIsComboOpen((prev) => !prev);
                      setIsMetierComboOpen(false);
                    }}
                    className="s2-trigger"
                  >
                    <span className={selectedDomaine ? "s2-val-new green" : "s2-ph"}>
                      {selectedDomaine ? selectedDomaine.label : "Sélectionner un domaine…"}
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {selectedDomaine && (
                        <HiX 
                          size={16} 
                          className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                          onClick={() => setSelectedDomaine(null)}
                        />
                      )}
                      <HiChevronDown className={`s2-icon-green ${isComboOpen ? "rot180" : ""}`} />
                    </div>
                  </button>

                  {isComboOpen && (
                    <div className="s2-drop-new s2-fadein">
                      <div className="s2-drop-search-new">
                        <div className="relative">
                          <HiOutlineSearch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            value={comboSearch}
                            onChange={(e) => setComboSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="s2-drop-input-new pr-8"
                            autoFocus
                          />
                          {comboSearch && (
                            <button 
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                              onClick={(e) => { e.stopPropagation(); setComboSearch(""); }}
                            >
                              <HiX size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="s2-drop-list-new">
                        {filteredDomaines.length > 0 ? filteredDomaines.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => handleSelectDomaine(d)}
                            className={`s2-drop-item-new ${selectedDomaine?.id === d.id ? "active" : ""}`}
                          >
                            <span className="s2-item-name">{d.label}</span>
                            {selectedDomaine?.id === d.id && <HiCheck className="text-blue-600" size={14} />}
                          </div>
                        )) : (
                          <div className="py-4 text-center text-xs text-gray-400 italic">Aucun résultat</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Résultats domaine mobile */}
                {mode === "domaine" && selectedDomaine && (
                  <div className="s2-dom-res s2-fadein lg:hidden">
                    <h2 className="s2-dom-cnt">{metiersParDomaine.length} métier{metiersParDomaine.length > 1 ? "s" : ""}</h2>
                    <p className="s2-dom-name">{selectedDomaine.label}</p>
                    {metiersParDomaine.length > 0 ? (
                      <div className="s2-cards">
                        {metiersParDomaine.map((m) => <MetierCard key={m.id} metier={m} onSelect={(m) => handleSelectMetier(m, true)} />)}
                      </div>
                    ) : <p className="s2-nores">Aucun métier trouvé pour ce domaine.</p>}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* ══ Colonne droite — Desktop ══ */}
        <div className={`s2-right ${metierFocusLayout ? "metier-focus-hidden" : ""}`}>
          {/* Fiche métier desktop preview removed as per user request */}
          {mode === "domaine" && selectedDomaine && (
            <div className="s2-r-dom s2-fadein">
              <div className="s2-r-domhdr">
                <h2 className="s2-dom-cnt lg">
                  {metiersParDomaine.length}<span className="sub"> métier{metiersParDomaine.length > 1 ? "s" : ""}</span>
                </h2>
                <p className="s2-dom-name">{selectedDomaine.label}</p>
              </div>
              {metiersParDomaine.length > 0 ? (
                <div className="s2-r-list">
                  {metiersParDomaine.map((m) => <MetierCard key={m.id} metier={m} onSelect={(m) => handleSelectMetier(m, true)} />)}
                </div>
              ) : <p className="s2-nores">Aucun métier trouvé pour ce domaine.</p>}
            </div>
          )}
          {mode === "idle" && (
            <div className="s2-idle">
              <svg width="140" height="140" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="70" stroke="white" strokeWidth="2" strokeDasharray="8 6" />
                <circle cx="90" cy="90" r="45" stroke="white" strokeWidth="1.5" />
                <circle cx="90" cy="90" r="8" fill="white" />
                <line x1="90" y1="45" x2="90" y2="62" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="90" y1="118" x2="90" y2="135" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="45" y1="90" x2="62" y2="90" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="118" y1="90" x2="135" y2="90" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p>Recherchez un métier<br />ou sélectionnez un domaine</p>
            </div>
          )}
        </div>
      </div>

      {/* Lancer la recherche Button - ONLY for manual career search (mode === "metier") */}
      {mode === "metier" && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[250] w-full max-w-sm px-6 pointer-events-none flex justify-center">
          <button
            onClick={() => handleLancerRecherche()}
            disabled={!localSelected || isLoading}
            className={`w-full py-4 rounded-full font-black text-sm lg:text-base transition-all shadow-lg active:scale-95 pointer-events-auto ${
              localSelected && !isLoading
                ? "bg-[#1250c8] text-white hover:bg-[#1a3ea8] hover:-translate-y-0.5"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Traitement..." : "Lancer la recherche"}
          </button>
        </div>
      )}

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
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
        /* Base */
        .s2-root *, .s2-root *::before, .s2-root *::after { box-sizing: border-box; font-family: 'Sora', sans-serif; }

        /* Racine — 100dvh pour éviter l'espace blanc mobile */
        .s2-root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg,#1250c8 0%,#1a6dcc 25%,#28b090 55%,#a0d820 80%,#c2e832 100%);
        }
        /* Décos */
        .s2-deco-tr { position:absolute;top:0;right:0;pointer-events:none;z-index:0;opacity:.75; }
        .s2-deco-bld { position:fixed;bottom:0;left:0;right:0;pointer-events:none;z-index:0;opacity:.80; }

        /* Layout principal */
        .s2-layout { position:relative;z-index:10;display:flex;flex:1; width: 100%; min-height: 100vh; }
        .s2-layout.metier-focus { justify-content: center; }

        /* Colonne gauche */
        .s2-left { display:flex;flex-direction:column;width:100%;min-height:100%; }
        @media(min-width:1024px){ .s2-left{width:50%;} }
        @media(min-width:1280px){ .s2-left{width:52%;} }
        .s2-layout.metier-focus .s2-left { width: 100%; align-items: center; }

        /* Zone scrollable — remplit l'espace restant */
        .s2-scroll {
          position: relative;
          flex:1;min-height:0;overflow:visible;
          padding: 1rem 1rem 2rem; /* px-4 pt-4 approx */
        }
        @media(min-width: 640px) {
          .s2-scroll { padding: 1.5rem 2.5rem 2rem; } /* px-10 pt-6 approx */
        }
        .s2-layout.metier-focus .s2-scroll {
          width: 100%;
          max-width: 32rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .s2-layout.metier-focus .s2-scroll > .flex {
          position: fixed;
          top: 1.5rem;
          left: clamp(1rem, 2.6vw, 2.5rem);
          width: auto;
          z-index: 20;
        }
        @media(min-width: 640px) {
          .s2-layout.metier-focus .s2-scroll {
            padding-top: 1.5rem;
            padding-bottom: 2rem;
          }
        }

        /* Retour */
        .s2-back {
          display:inline-flex;align-items:center;justify-content:center;
          color:rgba(255,255,255,.8);background:transparent;border:none;cursor:pointer;
          padding:0;margin-bottom:.5rem;
          transition:color .2s,transform .2s;
        }
        .s2-back:hover{color:white;transform:scale(1.1);}

        /* Titre */
        .s2-h1 {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 900;
          color: white; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 0.75rem;
        }
        @media(min-width: 640px) {
          .s2-h1 { font-size: 2.25rem; } /* text-4xl */
        }
        @media(min-width: 1024px) {
          .s2-h1 { font-size: 3rem; } /* text-5xl */
        }
        .s2-h1-sub { color: rgba(255, 255, 255, 0.65); }
        .s2-desc {
          font-size: 0.75rem; /* text-xs */
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.6; max-width: 30ch; margin: 0 0 1.5rem;
        }
        @media(min-width: 640px) {
          .s2-desc { font-size: 0.875rem; } /* text-sm */
        }
        @media(max-width: 1023px) {
          .s2-header-mob { display: flex; flex-direction: column; align-items: center; text-align: center; }
          .s2-h1 { text-align: center; }
          .s2-desc { text-align: center; margin-left: auto; margin-right: auto; }
        }
        .s2-layout.metier-focus .s2-header-mob {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .s2-layout.metier-focus .s2-h1 { text-align: center; }
        .s2-layout.metier-focus .s2-desc {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        /* Label */
        .s2-lbl {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0 0 0.5rem 0.25rem;
        }

        /* Combobox wrapper */
        .s2-cbwrap { 
          position:relative; 
          width:100%; 
          max-width: 450px; 
          z-index: 100;
          margin-bottom: 1.25rem; 
        }
        .s2-layout.metier-focus .s2-cbwrap {
          margin-left: auto;
          margin-right: auto;
        }
        .s2-cbwrap:focus-within { z-index: 200; }
        .s2-cbwrap.open { z-index: 1200; }
        @media(max-width: 1023px) {
          .s2-cbwrap { max-width: 100%; display: flex; flex-direction: column; align-items: center; }
        }

        /* Original Rounded Trigger */
        .s2-trigger {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          padding: 0.875rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          cursor: pointer;
          box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }
        .s2-trigger:hover {
          background: white;
          box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .s2-trigger:active { transform: translateY(0); }

        .s2-ph {
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .s2-val-new {
          display: block;
          font-size: 0.875rem;
          color: #1e40af;
          font-weight: 700;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .s2-val-new.green { color: #166534; }

        .s2-icon-blue { font-size: 1.125rem; color: #3b82f6; flex-shrink: 0; }
        .s2-icon-green { font-size: 1.125rem; color: #22c55e; flex-shrink: 0; transition: transform 0.3s; }
        .rot180 { transform: rotate(180deg); }

        /* Refined Dropdown (match etablissementsView content style) */
        .s2-drop-new {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 8px);
          background: white;
          border-radius: 1.25rem;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(0,0,0,0.05);
          z-index: 1000;
          overflow: hidden;
        }

        .s2-drop-search-new {
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }
        .s2-drop-input-new {
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.5rem 0.5rem 0.5rem 2.25rem;
          font-size: 13px;
          outline: none;
          color: #1e293b;
        }
        .s2-drop-input-new:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

        .s2-drop-list-new {
          max-height: 15rem;
          overflow-y: auto;
          padding: 0.5rem;
        }
        .s2-drop-item-new {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .s2-drop-item-new:hover { background: #eff6ff; }
        .s2-drop-item-new.active { background: #eff6ff; color: #2563eb; }
        
        .s2-item-name { font-size: 13px; font-weight: 600; color: #1e293b; }
        .s2-item-badge { font-size: 11px; color: #64748b; font-weight: 500; }

        /* Séparateur */
        .s2-sep { 
          display: flex; 
          align-items: center; 
          margin: 1.5rem 0; 
          max-width: 450px;
        }
        @media(max-width: 1023px) { 
          .s2-sep { max-width: 100%; width: 100%; }
        }
        .s2-sep-l { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.2); }
        .s2-sep-txt { 
          padding: 0 1rem; 
          font-size: 0.65rem; 
          font-weight: 800; 
          color: rgba(255, 255, 255, 0.6); 
          letter-spacing: 0.2em; 
          text-transform: uppercase; 
        }

        /* Fiche mobile */
        .s2-fiche-mob{margin-bottom:1rem;height:15rem;}

        /* Résultats domaine mobile */
        .s2-dom-res{margin-top:.75rem;padding-bottom:5rem; width: 100%; max-width: 500px; margin-left: auto; margin-right: auto;}
        .s2-cards{display:flex;flex-direction:column;gap:.75rem;margin-top:.75rem;}
        .s2-dom-cnt{font-size:clamp(1.25rem,4vw,1.75rem);font-weight:900;color:white;margin:0;}
        .s2-dom-cnt.lg{font-size:clamp(2rem,5vw,3rem);line-height:1;}
        .s2-dom-cnt .sub{font-size:1.25rem;font-weight:600;color:rgba(255,255,255,.6);}
        .s2-dom-name{font-size:.6rem;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.2em;text-transform:uppercase;margin:.25rem 0 0;}
        .s2-nores{font-size:.875rem;color:rgba(255,255,255,.55);}

        /* Footer */
        .s2-foot {
          flex-shrink: 0;
          padding: 1.5rem clamp(1.25rem, 5vw, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.05), transparent);
        }
        .s2-btn-cont {
          width: 100%;
          max-width: 450px;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: white;
          color: #1250c8;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .s2-btn-cont:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
          background: #eff6ff;
        }

        /* Colonne droite */
        .s2-right{display:none;}
        @media(min-width:1024px){
          .s2-right{
            display:flex;flex-direction:column;
            width:50%;height:100%;
            padding:2.5rem clamp(1.5rem,3.5vw,3rem);
          }
          .s2-right.metier-focus-hidden { display: none; }
        }
        @media(min-width:1280px){.s2-right{width:48%;}}

        .s2-r-dom{width:100%;height:100%;display:flex;flex-direction:column;}
        .s2-r-domhdr{margin-bottom:1.25rem;flex-shrink:0;}
        .s2-r-list{
          flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem;
          padding-right:.5rem;padding-bottom:1.5rem;
        }
        .s2-r-list::-webkit-scrollbar{width:5px;}
        .s2-r-list::-webkit-scrollbar-track{background:transparent;}
        .s2-r-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:999px;}

        .s2-idle{
          width:100%;height:100%;display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          opacity:.28;text-align:center;gap:1rem;
        }
        .s2-idle p{color:white;font-size:.875rem;font-weight:600;line-height:1.6;margin:0;}

        /* Animations */
        @keyframes s2In { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes s2FadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .s2-fadein { animation: s2FadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }

        /* Scrollbar fiche détail */
        .scrollbar-thin-white::-webkit-scrollbar{width:5px;}
        .scrollbar-thin-white::-webkit-scrollbar-track{background:transparent;}
        .scrollbar-thin-white::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:999px;}
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.4);}

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
