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
            <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">{metier.domaine}</span>
            <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">Niveau : {metier.niveau}</span>
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
        <span className="text-white/90 text-[10px] font-bold bg-[#1a3ea8]/80 px-2 py-0.5 rounded-full shrink-0">{metier.niveau}</span>
      </div>
      {metier.description && (
        <p className="text-white/75 text-xs leading-relaxed line-clamp-2 mb-1.5">{metier.description}</p>
      )}
      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">{metier.domaine}</p>
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
    return allMetiers.filter((m) =>
      (m.label + " " + m.domaine + " " + m.description + " " + (m.parcours?.join(" ") || ""))
        .toLowerCase().includes(q)
    );
  }, [searchQuery, allMetiers]);

  const filteredDomaines = useMemo(() => {
    const q = comboSearch.trim().toLowerCase();
    if (!q) return domainesList;
    return domainesList.filter((d) => d.label.toLowerCase().includes(q));
  }, [comboSearch, domainesList]);

  const metiersParDomaine = useMemo(() => {
    if (!selectedDomaine) return [];
    return allMetiers.filter((m) => {
      const fieldDomNorm = (m.domaine || "").toLowerCase().trim();
      const domaineNorm = selectedDomaine.label.toLowerCase().trim();
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
            <img src={pictoExplorer} alt="" className="w-[200px] lg:w-[260px] opacity-40 object-contain" />
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
          className="w-[200px] lg:w-[260px] opacity-40 object-contain pointer-events-none"
        />
      </div>
      <div className="s2-deco-bld">
        <BuildingSVG className="w-full opacity-60" />
      </div>

      {/* Layout */}
      <div className="s2-layout">

        {/* ══ Colonne gauche ══ */}
        <div className={`s2-left transition-transform duration-500 ease-in-out ${(isMetierComboOpen || isComboOpen) ? "lg:-translate-y-20 -translate-y-12" : "translate-y-0"}`}>
          <div className="s2-scroll">
            <div className="flex items-center justify-between mb-2">
              {onRetour && (
                <button onClick={onRetour} className="s2-back" aria-label="Retour">
                  <IoArrowBackCircleOutline size={42} />
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
            <div className="s2-cbwrap" ref={metierComboRef}>
              <p className="s2-lbl">Rechercher un métier</p>
              <button className="s2-trigger" onClick={() => setIsMetierComboOpen(!isMetierComboOpen)}>
                <span className={localSelected ? "s2-val blue" : "s2-ph"}>
                  {localSelected ? localSelected.label : "Ex : développeur, infirmier…"}
                </span>
                <HiOutlineSearch className="s2-icon blue" />
              </button>

              {isMetierComboOpen && (
                <div className="s2-drop s2-fadein">
                  <div className="s2-drop-search">
                    <HiOutlineSearch className="s2-drop-sicon" />
                    <input
                      type="text"
                      placeholder="Médecin, designer, pilote…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="s2-drop-input"
                      autoFocus
                    />
                    {searchQuery && (
                      <button className="s2-drop-clr" onClick={() => setSearchQuery("")}>
                        <HiX size={13} />
                      </button>
                    )}
                  </div>
                  <div className="s2-drop-list">
                    {filteredMetiers.length > 0 ? filteredMetiers.map((m, i) => (
                      <button key={m.id} onClick={() => handleSelectMetier(m, false)}
                        className={`s2-drop-item ${localSelected?.id === m.id ? "active-blue" : ""} ${i !== filteredMetiers.length - 1 ? "bordered" : ""}`}>
                        <div className="s2-drop-row">
                          <span className="s2-drop-name">{m.label}</span>
                          {localSelected?.id === m.id && <HiCheck className="s2-chk blue" />}
                        </div>
                        <span className="s2-badge blue">{m.domaine}</span>
                      </button>
                    )) : (
                      <div className="s2-empty">
                        <p>Aucun métier trouvé</p>
                        <span>Essayez un autre mot-clé</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Fiche métier mobile removed as per user request */}

            {/* ── Séparateur + COMBOBOX 2 ── */}
            {mode !== "metier" && (
              <>
                <div className="s2-sep" style={{ animation: "s2In 0.55s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}>
                  <div className="s2-sep-l" /><span className="s2-sep-txt">ou</span><div className="s2-sep-l" />
                </div>

                <div className="s2-cbwrap" ref={comboRef}>
                  <p className="s2-lbl">Explorer par domaine</p>
                  <button onClick={() => setIsComboOpen(!isComboOpen)}
                    className={`s2-trigger ${isComboOpen ? "open-green" : ""}`}>
                    <span className={selectedDomaine ? "s2-val green" : "s2-ph"}>
                      {selectedDomaine ? selectedDomaine.label : "Sélectionner un domaine…"}
                    </span>
                    <HiChevronDown className={`s2-icon green ${isComboOpen ? "rot180" : ""}`} />
                  </button>

                  {isComboOpen && (
                    <div className="s2-drop s2-fadein">
                      <div className="s2-drop-search">
                        <HiOutlineSearch className="s2-drop-sicon" />
                        <input
                          type="text"
                          placeholder="Rechercher un domaine…"
                          value={comboSearch}
                          onChange={(e) => setComboSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="s2-drop-input"
                          autoFocus
                        />
                        {comboSearch && (
                          <button className="s2-drop-clr" onClick={() => setComboSearch("")}>
                            <HiX size={13} />
                          </button>
                        )}
                      </div>
                      <div className="s2-drop-list">
                        {filteredDomaines.length > 0 ? filteredDomaines.map((d, i) => (
                          <button key={d.id} onClick={() => handleSelectDomaine(d)}
                            className={`s2-drop-item ${selectedDomaine?.id === d.id ? "active-green" : ""} ${i !== filteredDomaines.length - 1 ? "bordered" : ""}`}>
                            <span className="s2-drop-name">{d.label}</span>
                            {selectedDomaine?.id === d.id && <HiCheck className="s2-chk green" />}
                          </button>
                        )) : (
                          <div className="s2-empty"><p>Aucun domaine trouvé</p></div>
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
        <div className="s2-right">
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
          <HiOutlineHome size={30} />
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

        /* Colonne gauche */
        .s2-left { display:flex;flex-direction:column;width:100%;min-height:100%; }
        @media(min-width:1024px){ .s2-left{width:50%;} }
        @media(min-width:1280px){ .s2-left{width:52%;} }

        /* Zone scrollable — remplit l'espace restant */
        .s2-scroll {
          flex:1;min-height:0;overflow:visible;
          padding: 1rem clamp(1.25rem,5vw,3.5rem) 2rem;
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
          font-size:clamp(2.1rem,6.2vw,3.75rem);font-weight:900;
          color:white;line-height:1;letter-spacing:-.03em;margin:0 0 .6rem;
        }
        .s2-h1-sub { color:rgba(255,255,255,.65); }
        .s2-desc {
          font-size:clamp(.8rem,2vw,.95rem);color:rgba(255,255,255,.72);
          line-height:1.6;max-width:30ch;margin:0 0 clamp(1rem,3vw,1.75rem);
        }
        @media(max-width: 1023px) {
          .s2-header-mob { display: flex; flex-direction: column; align-items: center; text-align: center; }
          .s2-h1 { text-align: center; }
          .s2-desc { text-align: center; margin-left: auto; margin-right: auto; }
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
        }
        .s2-cbwrap:focus-within { z-index: 200; }
          margin-bottom: 1.25rem; 
        }
        @media(max-width: 1023px) {
          .s2-cbwrap { max-width: 100%; display: flex; flex-direction: column; align-items: center; }
        }

        /* Trigger bouton blanc */
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
        .s2-trigger.open-green { border-color: #4ade80; }
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
        .s2-val {
          font-size: 0.875rem;
          font-weight: 700;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .s2-val.blue  { color: #1e40af; }
        .s2-val.green { color: #166534; }

        .s2-icon { font-size: 1.125rem; flex-shrink: 0; transition: transform 0.3s ease; }
        .s2-icon.blue  { color: #3b82f6; }
        .s2-icon.green { color: #22c55e; }
        .rot180 { transform: rotate(180deg); }

        /* Dropdown */
        .s2-drop {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 10px);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          border-radius: 1.25rem;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
          z-index: 1000;
          transform-origin: top;
          animation: s2DropIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes s2DropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Input de recherche */
        .s2-drop-search {
          position: relative;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.5);
          border-bottom: 1px solid #f1f5f9;
        }
        .s2-drop-sicon {
          position: absolute;
          left: 1.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 0.875rem;
          pointer-events: none;
        }
        .s2-drop-input {
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          font-size: 0.875rem;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: all 0.2s ease;
          color: #1e293b;
        }
        .s2-drop-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .s2-drop-clr {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .s2-drop-clr:hover { background: #f1f5f9; color: #64748b; }

        /* Liste items */
        .s2-drop-list { 
          max-height: 14rem; 
          overflow-y: auto; 
          background: transparent;
        }
        .s2-drop-list::-webkit-scrollbar { width: 4px; }
        .s2-drop-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .s2-drop-item {
          width: 100%;
          padding: 0.875rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .s2-drop-item:hover { background: rgba(59, 130, 246, 0.05); }
        .s2-drop-item.active-blue { background: rgba(59, 130, 246, 0.08); }
        .s2-drop-item.active-green { background: rgba(34, 197, 94, 0.08); }
        .s2-drop-item.bordered { border-bottom: 1px solid rgba(0, 0, 0, 0.02); }

        .s2-drop-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .s2-drop-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
        .s2-chk { font-size: 1rem; flex-shrink: 0; }
        .s2-chk.blue { color: #2563eb; }
        .s2-chk.green { color: #16a34a; }

        .s2-badge {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.125rem 0.5rem;
          border-radius: 0.5rem;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .s2-badge.blue { background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; }
        
        .s2-empty { padding: 2rem 1.5rem; text-align: center; color: #64748b; }
        .s2-empty p { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; }
        .s2-empty span { font-size: 0.75rem; opacity: 0.7; }

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