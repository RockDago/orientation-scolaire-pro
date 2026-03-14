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
import { getAllMentions }      from "../../../services/mention.services";
import { searchMetier }        from "../../../services/metier.services";


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
            <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">{metier.mention}</span>
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
      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">{metier.mention}</p>
    </button>
  );
}

export default function Section2({ onSelectMetier, selectedMetier, onRetour, searchParam }) {
  const navigate = useNavigate();
  const [allMetiers,  setAllMetiers]  = useState([]);
  const [allMentions, setAllMentions] = useState([]);
  const [_loading,    _setLoading]    = useState(true);

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
        const [metiers, mentions] = await Promise.all([getAllMetiersCache(), getAllMentions()]);
        setAllMetiers(metiers);
        setAllMentions(mentions);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        _setLoading(false);
      }
    };
    loadData();
  }, []);

  const domainesList = useMemo(() =>
    allMentions.map((m) => ({ id: m.id, label: m.label, keywords: [m.label.toLowerCase()] })),
    [allMentions]
  );

  const filteredMetiers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allMetiers;
    return allMetiers.filter((m) =>
      (m.label + " " + m.mention + " " + m.description + " " + (m.parcours?.join(" ") || ""))
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
      const mentionNorm = (m.mention || "").toLowerCase().trim();
      const domaineNorm = selectedDomaine.label.toLowerCase().trim();
      return mentionNorm === domaineNorm || mentionNorm.includes(domaineNorm) || domaineNorm.includes(mentionNorm);
    });
  }, [selectedDomaine, allMetiers]);

  const handleSelectMetier = (metier) => {
    if (metier.id && metier.label) searchMetier(metier.id, metier.label).catch(console.error);
    setLocalSelected(metier);
    setSelectedDomaine(null);
    setIsMetierComboOpen(false);
    setSearchQuery("");
    setMode("metier");
    onSelectMetier?.(metier);
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

      {/* Déco SVG */}
      <div className="s2-deco-tr">
        <svg width="200" height="180" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="232" cy="155" r="7" fill="white" />
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4" />
          <circle cx="130" cy="94" r="5" fill="white" />
        </svg>
      </div>
      <div className="s2-deco-bld">
        <svg width="100%" height="80" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10"  y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="240" y="55" width="28" height="45" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="370" y="60" width="25" height="40" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Layout */}
      <div className="s2-layout">

        {/* ══ Colonne gauche ══ */}
        <div className="s2-left">
          <div className="s2-scroll">

            {/* Retour */}
            {onRetour && (
              <button onClick={onRetour} className="s2-back" aria-label="Retour"
                style={{ animation: "s2In 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
                <IoArrowBackCircleOutline size={36} />
              </button>
            )}

            {/* Titre */}
            <div style={{ animation: "s2In 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}>
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
                      <button key={m.id} onClick={() => handleSelectMetier(m)}
                        className={`s2-drop-item ${localSelected?.id === m.id ? "active-blue" : ""} ${i !== filteredMetiers.length - 1 ? "bordered" : ""}`}>
                        <div className="s2-drop-row">
                          <span className="s2-drop-name">{m.label}</span>
                          {localSelected?.id === m.id && <HiCheck className="s2-chk blue" />}
                        </div>
                        <span className="s2-badge blue">{m.mention}</span>
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

            {/* Fiche métier mobile */}
            {mode === "metier" && localSelected && (
              <div className="s2-fiche-mob s2-fadein lg:hidden">
                <MetierDetailsCard metier={localSelected} onClose={() => { setLocalSelected(null); setMode("idle"); }} />
              </div>
            )}

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
                        {metiersParDomaine.map((m) => <MetierCard key={m.id} metier={m} onSelect={handleSelectMetier} />)}
                      </div>
                    ) : <p className="s2-nores">Aucun métier trouvé pour ce domaine.</p>}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="s2-foot">
            {mode === "metier" && localSelected && (
              <button className="s2-btn-cont" onClick={handleValider}>Continuer →</button>
            )}
            <button className="s2-btn-home" onClick={() => navigate("/acceuil/orientation")} aria-label="Accueil">
              <HiOutlineHome size={26} />
            </button>
          </div>
        </div>

        {/* ══ Colonne droite — Desktop ══ */}
        <div className="s2-right">
          {mode === "metier" && localSelected && (
            <div className="h-full s2-fadein">
              <MetierDetailsCard metier={localSelected} onClose={() => { setLocalSelected(null); setMode("idle"); }} />
            </div>
          )}
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
                  {metiersParDomaine.map((m) => <MetierCard key={m.id} metier={m} onSelect={handleSelectMetier} />)}
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

      <style>{`
        /* Base */
        .s2-root *, .s2-root *::before, .s2-root *::after { box-sizing: border-box; font-family: 'Sora', sans-serif; }

        /* Racine — 100dvh pour éviter l'espace blanc mobile */
        .s2-root {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg,#1250c8 0%,#1a6dcc 25%,#28b090 55%,#a0d820 80%,#c2e832 100%);
        }

        /* Décos */
        .s2-deco-tr { position:absolute;top:0;right:0;pointer-events:none;z-index:0;opacity:.75; }
        .s2-deco-bld { position:absolute;bottom:0;left:0;right:0;pointer-events:none;z-index:0;opacity:.10; }

        /* Layout principal */
        .s2-layout { position:relative;z-index:10;display:flex;flex:1;height:100%;overflow:hidden; }

        /* Colonne gauche */
        .s2-left { display:flex;flex-direction:column;width:100%;height:100%; }
        @media(min-width:1024px){ .s2-left{width:50%;} }
        @media(min-width:1280px){ .s2-left{width:52%;} }

        /* Zone scrollable — remplit l'espace restant */
        .s2-scroll {
          flex:1;min-height:0;overflow-y:auto;
          padding: clamp(1.25rem,4vw,2.5rem) clamp(1.25rem,5vw,3.5rem) 0.75rem;
          scrollbar-width:none;-ms-overflow-style:none;
        }
        .s2-scroll::-webkit-scrollbar{display:none;}

        /* Retour */
        .s2-back {
          display:inline-flex;align-items:center;justify-content:center;
          color:rgba(255,255,255,.8);background:transparent;border:none;cursor:pointer;
          width:2.75rem;height:2.75rem;border-radius:.75rem;margin-bottom:.5rem;
          transition:color .2s,background .2s;
        }
        .s2-back:hover{color:white;background:rgba(255,255,255,.1);}

        /* Titre */
        .s2-h1 {
          font-size:clamp(2.25rem,6.5vw,3.75rem);font-weight:900;
          color:white;line-height:1;letter-spacing:-.03em;margin:0 0 .6rem;
        }
        .s2-h1-sub { color:rgba(255,255,255,.65); }
        .s2-desc {
          font-size:clamp(.8rem,2vw,.95rem);color:rgba(255,255,255,.72);
          line-height:1.6;max-width:30ch;margin:0 0 clamp(1rem,3vw,1.75rem);
        }

        /* Label */
        .s2-lbl {
          font-size:.6rem;color:rgba(255,255,255,.85);font-weight:700;
          letter-spacing:.15em;text-transform:uppercase;margin:0 0 .45rem;
        }

        /* Combobox wrapper */
        .s2-cbwrap { position:relative;width:100%;margin-bottom:.75rem; }

        /* Trigger bouton blanc */
        .s2-trigger {
          width:100%;background:white;border:2px solid transparent;
          border-radius:.875rem;
          padding:clamp(.7rem,1.8vw,.875rem) clamp(.875rem,2.2vw,1.125rem);
          display:flex;align-items:center;justify-content:space-between;gap:.5rem;
          cursor:pointer;
          box-shadow:0 4px 18px rgba(0,0,0,.13);
          transition:box-shadow .2s,border-color .2s,transform .15s;
          text-align:left;
        }
        .s2-trigger:hover{box-shadow:0 6px 24px rgba(0,0,0,.17);transform:translateY(-1px);}
        .s2-trigger.open-green{border-color:#86efac;}

        .s2-ph  {font-size:.875rem;font-weight:500;color:#9ca3af;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .s2-val {font-size:.875rem;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .s2-val.blue  {color:#1250c8;}
        .s2-val.green {color:#5E9422;}

        .s2-icon {font-size:1.125rem;flex-shrink:0;transition:transform .2s;}
        .s2-icon.blue  {color:#60a5fa;}
        .s2-icon.green {color:#4ade80;}
        .rot180{transform:rotate(180deg);}

        /* Dropdown */
        .s2-drop {
          position:absolute;
          left:0;
          right:0;
          top:calc(100% + 8px);
          background:white;
          border-radius:1rem;
          box-shadow:0 12px 40px rgba(0,0,0,.25);
          border:1px solid #e2e8f0;
          overflow:hidden;
          z-index:1000;
        }

        /* Input de recherche dans le dropdown - DESIGN TOUT BLANC */
        .s2-drop-search {
          position:relative;
          padding:1rem;
          background:white;
          border-bottom:1px solid #f1f5f9;
        }
        .s2-drop-sicon {
          position:absolute;
          left:1.5rem;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
          font-size:1rem;
          pointer-events:none;
        }
        .s2-drop-input {
          width:100%;
          background:white;
          border:1.5px solid #e2e8f0;
          border-radius:0.75rem;
          padding:0.75rem 1rem 0.75rem 2.5rem;
          font-size:0.95rem;
          font-family:'Sora',sans-serif;
          outline:none;
          transition:all 0.2s ease;
          color:#1e293b;
        }
        .s2-drop-input::placeholder {
          color:#94a3b8;
          font-weight:400;
        }
        .s2-drop-input:focus {
          border-color:#60a5fa;
          box-shadow:0 0 0 4px rgba(96,165,250,0.15);
        }
        .s2-drop-clr {
          position:absolute;
          right:1.5rem;
          top:50%;
          transform:translateY(-50%);
          color:#64748b;
          background:white;
          border:none;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0.25rem;
          border-radius:9999px;
          transition:all 0.2s ease;
        }
        .s2-drop-clr:hover {
          background:#f1f5f9;
          color:#334155;
        }

        /* Liste items */
        .s2-drop-list{max-height:16rem;overflow-y:auto;overscroll-behavior:contain;background:white;}
        .s2-drop-list::-webkit-scrollbar{width:5px;}
        .s2-drop-list::-webkit-scrollbar-track{background:#f8fafc;}
        .s2-drop-list::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px;}

        .s2-drop-item {
          width:100%;padding:.875rem 1.25rem;
          display:flex;flex-direction:column;gap:.35rem;
          text-align:left;background:white;border:none;cursor:pointer;
          transition:background .15s;
        }
        .s2-drop-item:hover{background:#f8fafc;}
        .s2-drop-item.active-blue{background:#eff6ff;}
        .s2-drop-item.active-green{background:#f0fdf4;}
        .s2-drop-item.bordered{border-bottom:1px solid #f1f5f9;}

        .s2-drop-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;}
        .s2-drop-name{font-size:.95rem;font-weight:600;color:#0f172a;}
        .s2-chk{font-size:1.125rem;flex-shrink:0;}
        .s2-chk.blue{color:#1250c8;}.s2-chk.green{color:#5E9422;}
        .s2-badge{display:inline-block;font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:.375rem;width:fit-content;}
        .s2-badge.blue{background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;}
        .s2-empty{padding:1.5rem 1.25rem;text-align:center;background:white;}
        .s2-empty p{font-size:.95rem;color:#64748b;margin:0 0 .25rem;}
        .s2-empty span{font-size:.8rem;color:#94a3b8;}

        /* Séparateur */
        .s2-sep{display:flex;align-items:center;margin:clamp(.75rem,2vw,1.1rem) 0;}
        .s2-sep-l{flex:1;height:1px;background:rgba(255,255,255,.22);}
        .s2-sep-txt{padding:0 .875rem;font-size:.6rem;font-weight:900;color:rgba(255,255,255,.75);letter-spacing:.25em;text-transform:uppercase;}

        /* Fiche mobile */
        .s2-fiche-mob{margin-bottom:1rem;height:15rem;}

        /* Résultats domaine mobile */
        .s2-dom-res{margin-top:.75rem;padding-bottom:2rem;}
        .s2-cards{display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;}
        .s2-dom-cnt{font-size:clamp(1.25rem,4vw,1.75rem);font-weight:900;color:white;margin:0;}
        .s2-dom-cnt.lg{font-size:clamp(2rem,5vw,3rem);line-height:1;}
        .s2-dom-cnt .sub{font-size:1.25rem;font-weight:600;color:rgba(255,255,255,.6);}
        .s2-dom-name{font-size:.6rem;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.2em;text-transform:uppercase;margin:.25rem 0 0;}
        .s2-nores{font-size:.875rem;color:rgba(255,255,255,.55);}

        /* Footer */
        .s2-foot{
          flex-shrink:0;
          padding:.75rem clamp(1.25rem,5vw,3.5rem) clamp(.875rem,2.5vw,1.25rem);
          display:flex;flex-direction:column;align-items:center;gap:.625rem;
        }
        .s2-btn-cont{
          width:100%;max-width:26rem;
          padding:.875rem 1.5rem;border-radius:.875rem;
          font-weight:900;font-size:.875rem;text-transform:uppercase;letter-spacing:.08em;
          background:white;color:#1250c8;border:none;cursor:pointer;
          box-shadow:0 4px 18px rgba(0,0,0,.12);
          transition:background .2s,transform .15s,box-shadow .2s;
        }
        .s2-btn-cont:hover{background:#eff6ff;transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.15);}
        .s2-btn-home{
          color:rgba(255,255,255,.55);background:none;border:none;cursor:pointer;
          padding:.5rem;border-radius:.75rem;transition:color .2s,background .2s;
        }
        .s2-btn-home:hover{color:white;background:rgba(255,255,255,.1);}

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
        @keyframes s2In{from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);}}
        @keyframes s2FadeIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
        .s2-fadein{animation:s2FadeIn .25s cubic-bezier(0.16,1,0.3,1) both;}

        /* Scrollbar fiche détail */
        .scrollbar-thin-white::-webkit-scrollbar{width:5px;}
        .scrollbar-thin-white::-webkit-scrollbar-track{background:transparent;}
        .scrollbar-thin-white::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:999px;}
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.4);}
      `}</style>
    </div>
  );
}