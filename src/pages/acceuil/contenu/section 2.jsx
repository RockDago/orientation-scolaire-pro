import { useMemo, useState, useEffect, useRef } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiOutlineSearch, HiX, HiChevronDown, HiCheck, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const METIERS_LIST = [
  { id: "architecte",      label: "Architecte",                         mention: "Architecture & Urbanisme",   niveau: "Bac + 5", description: "Conçoit et supervise la construction de bâtiments et d'espaces urbains fonctionnels et esthétiques.", parcours: ["Architecture", "Génie civil", "Design urbain", "BTP"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "avocat",          label: "Avocat / Juriste",                   mention: "Droit",                      niveau: "Bac + 5", description: "Défend les intérêts de ses clients devant les juridictions et conseille sur les questions juridiques.", parcours: ["Droit privé", "Droit public", "Droit des affaires", "Criminologie"], profil: ["Série A", "Série B"] },
  { id: "data-analyst",    label: "Data analyst / Data scientist",      mention: "Informatique & Data",        niveau: "Bac + 5", description: "Analyse et interprète de grandes quantités de données pour aider à la prise de décisions stratégiques.", parcours: ["Statistiques", "Informatique", "Intelligence artificielle", "Big Data"], profil: ["Série C", "Série D"] },
  { id: "designer",        label: "Designer graphique",                 mention: "Arts & Design",              niveau: "Bac + 3", description: "Crée des visuels, logos, interfaces et supports de communication pour les entreprises.", parcours: ["Arts visuels", "Communication", "Design numérique", "Multimédia"], profil: ["Série A", "Série C"] },
  { id: "infirmier",       label: "Infirmier / Infirmière",             mention: "Sciences de la Santé",       niveau: "Bac + 3", description: "Prodigue des soins aux patients, assiste les médecins et assure le suivi thérapeutique.", parcours: ["Sciences infirmières", "Santé publique", "Soins médicaux"], profil: ["Série C", "Série D"] },
  { id: "ingenieur-civil", label: "Ingénieur civil",                    mention: "Génie Civil",                niveau: "Bac + 5", description: "Conçoit et supervise des projets d'infrastructure : routes, ponts, bâtiments.", parcours: ["Génie civil", "BTP", "Environnement", "Hydraulique"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "ingenieur-info",  label: "Ingénieur en informatique",          mention: "Informatique",               niveau: "Bac + 5", description: "Développe et optimise des solutions numériques pour répondre aux besoins des entreprises.", parcours: ["Génie logiciel", "Informatique générale", "Systèmes et réseaux", "Intelligence artificielle"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "marketing",       label: "Marketing digital / Community mgr",  mention: "Marketing & Communication",  niveau: "Bac + 3", description: "Gère la présence en ligne des marques et pilote les stratégies de communication numérique.", parcours: ["Marketing", "Communication", "Commerce", "Numérique"], profil: ["Série A", "Série B", "Série C"] },
  { id: "medecin",         label: "Médecin",                            mention: "Médecine",                   niveau: "Bac + 7", description: "Diagnostique et traite les maladies, prescrit des traitements et assure le suivi de santé des patients.", parcours: ["Médecine générale", "Chirurgie", "Pédiatrie", "Spécialités médicales"], profil: ["Série C", "Série D"] },
  { id: "pilote",          label: "Pilote de ligne",                    mention: "Aéronautique",               niveau: "Bac + 3", description: "Conduit des avions commerciaux pour le transport de passagers et de marchandises.", parcours: ["Aéronautique", "Navigation aérienne", "Météorologie"], profil: ["Série C", "Série D"] },
  { id: "pharmacien",      label: "Pharmacien",                         mention: "Pharmacie",                  niveau: "Bac + 6", description: "Prépare et dispense les médicaments, conseille les patients et veille à la sécurité des traitements.", parcours: ["Pharmacie", "Biochimie", "Chimie pharmaceutique"], profil: ["Série C", "Série D"] },
  { id: "technicien-aero", label: "Technicien aéronautique",            mention: "Aéronautique & Maintenance", niveau: "Bac + 2", description: "Assure la maintenance, la réparation et le contrôle des aéronefs.", parcours: ["Maintenance aéronautique", "Électronique", "Mécanique"], profil: ["Série C", "Série D", "Série technique"] },
];

const DOMAINES_LIST = [
  { id: "sante",     label: "Santé",                    keywords: ["santé", "médecine", "pharmacie", "infirmier"] },
  { id: "tourisme",  label: "Tourisme / hôtellerie",    keywords: ["tourisme", "hôtellerie"] },
  { id: "info",      label: "Informatique / numérique", keywords: ["informatique", "numérique", "data", "logiciel"] },
  { id: "admin",     label: "Administration / gestion", keywords: ["administration", "gestion", "droit"] },
  { id: "commerce",  label: "Commerce / banque",        keywords: ["commerce", "banque", "marketing"] },
  { id: "genie",     label: "Génie civil / BTP",        keywords: ["génie", "btp", "civil", "construction"] },
  { id: "industrie", label: "Industrie",                keywords: ["industrie", "mécanique", "maintenance"] },
  { id: "arts",      label: "Arts / Communication",     keywords: ["arts", "communication", "design", "multimédia"] },
  { id: "autres",    label: "Autres",                   keywords: [] },
];

// ── Fiche détaillée d'un métier ─────────────────────────────────────────────
function MetierDetailsCard({ metier, onClose, useAzureBg = false }) {
  if (!metier) return null;

  const bgClass = useAzureBg
    ? "bg-[#155faa]"
    : "bg-slate-950/35 backdrop-blur-2xl border border-white/20";

  return (
    <div className={`relative rounded-2xl p-5 h-full flex flex-col ${bgClass}`}>
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

// ── Card métier expandable (pour la liste domaine) ───────────────────────────
function MetierExpandCard({ metier, onSelect }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  const handleToggle = () => {
    if (!open && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 220);
    }
    setOpen(!open);
  };

  return (
    <div ref={cardRef} className="bg-slate-950/25 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden transition-all">
      {/* En-tête cliquable */}
      <button
        className="w-full flex items-start justify-between gap-3 p-4 text-left"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-white font-bold text-base leading-snug">{metier.label}</span>
            <span className="text-white/90 text-[10px] font-bold bg-[#1a3ea8] px-2 py-0.5 rounded-full shrink-0">{metier.niveau}</span>
          </div>
          <p className={`text-white/70 text-xs leading-relaxed ${open ? "" : "line-clamp-1"}`}>{metier.description}</p>
          <p className="text-white/45 text-[10px] uppercase font-bold tracking-wider mt-1">{metier.mention}</p>
        </div>
        <div className="text-white/70 shrink-0 mt-0.5">
          {open ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
        </div>
      </button>

      {/* Détails expandés */}
      {open && (
        <div className={`px-4 pb-4 border-t border-white/10 pt-3 space-y-3 animate-fadeIn`}>
          {metier.parcours?.length > 0 && (
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1.5">Parcours d'études</p>
              <div className="flex flex-wrap gap-1.5">
                {metier.parcours.map((p, i) => (
                  <span key={i} className="text-[11px] bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-white/90">{p}</span>
                ))}
              </div>
            </div>
          )}
          {metier.profil?.length > 0 && (
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1.5">Séries recommandées</p>
              <div className="flex flex-wrap gap-1.5">
                {metier.profil.map((p, i) => (
                  <span key={i} className="text-[11px] bg-white/15 border border-white/20 text-white/90 px-2.5 py-1 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => onSelect(metier)}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#155faa] hover:bg-[#114b8a] text-white text-sm font-black transition-all"
          >
            Sélectionner ce métier →
          </button>
        </div>
      )}
    </div>
  );
}

export default function Section2({ onSelectMetier, selectedMetier, onRetour }) {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [localSelected, setLocalSelected] = useState(selectedMetier || null);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [isComboOpen, setIsComboOpen]     = useState(false);
  const [comboSearch, setComboSearch]     = useState("");
  const [mode, setMode]                   = useState("idle");
  const [modalSelected, setModalSelected] = useState(null);

  const comboRef = useRef(null);

  const filteredMetiers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return METIERS_LIST;
    return METIERS_LIST.filter((m) =>
      (m.label + " " + m.mention + " " + m.description + " " + m.parcours.join(" ") + " " + m.profil.join(" "))
        .toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredDomaines = useMemo(() => {
    const q = comboSearch.trim().toLowerCase();
    if (!q) return DOMAINES_LIST;
    return DOMAINES_LIST.filter((d) => d.label.toLowerCase().includes(q));
  }, [comboSearch]);

  const metiersParDomaine = useMemo(() => {
    if (!selectedDomaine) return [];
    if (selectedDomaine.id === "autres") return METIERS_LIST;
    return METIERS_LIST.filter((m) => {
      const hay = (m.mention + " " + m.parcours.join(" ") + " " + m.description).toLowerCase();
      return selectedDomaine.keywords.some((k) => hay.includes(k));
    });
  }, [selectedDomaine]);

  const canValider = Boolean(localSelected || selectedDomaine);

  const handleSelectMetier = (metier) => {
    setLocalSelected(metier);
    setSelectedDomaine(null);
    setIsModalOpen(false);
    setSearchQuery("");
    setMode("metier");
  };

  const handleSelectDomaine = (d) => {
    setSelectedDomaine(d);
    setLocalSelected(null);
    setIsComboOpen(false);
    setComboSearch("");
    setMode("domaine");
  };

  const handleValider = () => {
    if (localSelected) { onSelectMetier?.(localSelected); return; }
    if (selectedDomaine) {
      onSelectMetier?.({ id: "domaine", label: selectedDomaine.label, isDomaine: true, results: metiersParDomaine });
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    setModalSelected(localSelected || filteredMetiers[0] || null);
  }, [isModalOpen]); // eslint-disable-line

  // Fermer combobox en cliquant dehors
  useEffect(() => {
    const handler = (e) => {
      if (comboRef.current && !comboRef.current.contains(e.target)) setIsComboOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-['Sora'] flex bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── Déco SVG ── */}
      <div className="absolute top-0 right-0 pointer-events-none z-0 opacity-80 origin-top-right">
        <svg width="220" height="200" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round"/>
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
          <circle cx="232" cy="155" r="7" fill="white"/>
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4"/>
          <circle cx="130" cy="94" r="5" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="90" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10" y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="50" y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="240" y="55" width="28" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="370" y="60" width="25" height="40" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-[45%] left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* ═══════════════════════
          Colonne gauche
      ═══════════════════════ */}
      <div className="relative z-10 flex flex-col h-full w-full lg:w-1/2 xl:w-[52%] px-6 sm:px-10 lg:px-12 xl:px-16 pt-8 pb-4">

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-2">
          {onRetour && (
            <button onClick={onRetour} className="text-white/80 hover:text-white transition-colors w-11 h-11 flex items-center justify-center mb-2" aria-label="Retour">
              <IoArrowBackCircleOutline size={38} />
            </button>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-3">
            EXPLORER<br />LES MÉTIERS
          </h1>
          <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-sm">
            Aide les élèves et les parents à choisir un métier et le parcours d&apos;études adapté.
          </p>

          {/* Input recherche */}
          <div className="w-full mb-4">
            <button
              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-lg hover:shadow-xl transition-all"
              onClick={() => { setIsModalOpen(true); setSearchQuery(""); }}
            >
              <span className={`font-medium text-sm ${localSelected ? "text-[#1250c8] font-bold" : "text-gray-400"} truncate max-w-[80%]`}>
                {localSelected ? localSelected.label : "Rechercher un métier (Ex : développeur, infirmier…)"}
              </span>
              <HiOutlineSearch className="text-gray-400 text-lg flex-shrink-0" />
            </button>
          </div>

          {/* Mode metier : fiche résumé sur mobile */}
          {mode === "metier" && localSelected && (
            <div className="mb-4 h-64 animate-fadeIn lg:hidden">
              <MetierDetailsCard metier={localSelected} onClose={() => { setLocalSelected(null); setMode("idle"); }} />
            </div>
          )}

          {/* Séparateur + Combobox */}
          {mode !== "metier" && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-white/30" />
                <span className="px-4 text-white/90 text-xs font-bold tracking-[0.2em]">- OU -</span>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Combobox */}
              <div className="w-full mb-4 relative" ref={comboRef}>
                <p className="text-[11px] text-white/70 font-bold mb-2 uppercase tracking-widest">Explorer par domaine</p>

                <button
                  onClick={() => setIsComboOpen(!isComboOpen)}
                  className={`w-full bg-slate-950/25 backdrop-blur-xl border rounded-xl px-4 py-2.5 flex items-center justify-between transition-all
                    ${isComboOpen ? "border-white/70 ring-2 ring-white/20" : "border-white/30 hover:border-white/60 hover:bg-slate-950/30"}`}
                >
                  <span className={`text-sm font-semibold ${selectedDomaine ? "text-white" : "text-white/60"}`}>
                    {selectedDomaine ? selectedDomaine.label : "Sélectionner un domaine…"}
                  </span>
                  <HiChevronDown className={`text-white/80 text-lg transition-transform duration-200 flex-shrink-0 ${isComboOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown — affiché par dessus tout */}
                {isComboOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-fadeIn">
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="text"
                          placeholder="Rechercher un domaine…"
                          value={comboSearch}
                          onChange={(e) => setComboSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1250c8] focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto overscroll-contain scrollbar-gray">
                      {filteredDomaines.length > 0 ? (
                        filteredDomaines.map((d, i) => (
                          <button
                            key={d.id}
                            onClick={() => handleSelectDomaine(d)}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all
                              ${selectedDomaine?.id === d.id ? "bg-blue-50 text-[#1250c8]" : "text-gray-700 hover:bg-gray-50"}
                              ${i !== filteredDomaines.length - 1 ? "border-b border-gray-50" : ""}`}
                          >
                            <span className="text-sm font-semibold flex-1">{d.label}</span>
                            {selectedDomaine?.id === d.id && <HiCheck className="text-[#1250c8] text-base flex-shrink-0" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-5 text-center text-sm text-gray-400">Aucun domaine trouvé</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Résultats domaine sur Mobile (expandable cards) */}
              {mode === "domaine" && selectedDomaine && metiersParDomaine.length > 0 && (
                <div className="lg:hidden mt-3 animate-fadeIn pb-10">
                  <div className="text-center mb-4">
                    <h2 className="text-white font-black text-2xl">{metiersParDomaine.length} métiers trouvés</h2>
                    <p className="text-white/60 text-xs mt-0.5 tracking-widest uppercase">{selectedDomaine.label}</p>
                  </div>
                  <div className="space-y-2">
                    {metiersParDomaine.map((m) => (
                      <MetierExpandCard key={m.id} metier={m} onSelect={handleSelectMetier} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bouton + Home */}
        <div className="shrink-0 pt-3 flex flex-col items-center gap-3">
          <button
            className={`w-full max-w-sm py-3.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-lg ${
              canValider
                ? "bg-[#1a3ea8] text-white hover:bg-[#122d88] hover:-translate-y-0.5"
                : "bg-white/20 text-white/40 backdrop-blur-md cursor-not-allowed"
            }`}
            onClick={handleValider}
            disabled={!canValider}
          >
            {mode === "metier" ? "Continuer →" : "Lancer la recherche"}
          </button>
          <button onClick={() => navigate("/acceuil/orientation")} className="text-white/70 hover:text-white transition-colors" aria-label="Accueil">
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════
          Colonne droite — Desktop
      ═══════════════════════ */}
      <div className="hidden lg:flex relative z-10 w-[48%] flex-col px-10 xl:px-14 py-10 h-full">

        {/* Mode METIER — fiche détaillée */}
        {mode === "metier" && localSelected && (
          <div className="h-full animate-fadeIn">
            <MetierDetailsCard
              metier={localSelected}
              onClose={() => { setLocalSelected(null); setMode("idle"); }}
            />
          </div>
        )}

        {/* Mode DOMAINE — liste expandable */}
        {mode === "domaine" && selectedDomaine && (
          <div className="w-full h-full flex flex-col">
            <div className="text-center mb-5 shrink-0">
              <h2 className="text-white font-black text-4xl mb-1">
                {metiersParDomaine.length} métiers trouvés
              </h2>
              <p className="text-white/70 font-semibold tracking-widest uppercase text-sm">
                {selectedDomaine.label}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin-white pb-6">
              {metiersParDomaine.map((m) => (
                <MetierExpandCard key={m.id} metier={m} onSelect={handleSelectMetier} />
              ))}
            </div>
          </div>
        )}

        {/* Mode IDLE — colonne vide */}
        {mode === "idle" && <div className="w-full h-full" />}
      </div>

      {/* ═══════════════════════
          MODAL Recherche (Plein écran mobile)
      ═══════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn md:p-4">
          <div className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl md:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-black text-slate-800">Rechercher un métier</h2>
              <button onClick={() => { setIsModalOpen(false); setSearchQuery(""); }} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <HiX size={22} />
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Médecin, designer, pilote…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#155faa] focus:border-transparent shadow-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col md:grid md:grid-cols-[380px_1fr]">
                {/* Liste (Scrollable) */}
                <div className="flex-1 md:flex-none h-full overflow-y-auto p-4 bg-slate-50/50 scrollbar-gray order-2 md:order-1 border-r border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 sticky top-0 bg-slate-50 py-1">
                    {filteredMetiers.length} métier{filteredMetiers.length > 1 ? "s" : ""} trouvé{filteredMetiers.length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2 pb-4">
                    {filteredMetiers.map((m) => {
                      const active = modalSelected?.id === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setModalSelected(m)}
                          className={`w-full text-left px-4 py-3 rounded-2xl border transition-all bg-white
                            ${active ? "border-[#155faa] shadow-md ring-1 ring-[#155faa]/20" : "border-transparent hover:border-slate-200 hover:shadow-sm"}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-black text-slate-800 text-sm leading-snug">{m.label}</span>
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 shrink-0">{m.niveau}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 rounded border border-blue-100 text-[#155faa]">{m.mention}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Détail (Scrollable) */}
                <div className="shrink-0 h-[38vh] md:h-full overflow-y-auto p-4 md:p-5 bg-slate-100/50 scrollbar-gray order-1 md:order-2 border-b md:border-b-0 border-slate-200">
                  <p className="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Aperçu</p>
                  {modalSelected ? (
                    <MetierDetailsCard metier={modalSelected} useAzureBg />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                      Sélectionnez un métier
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 md:px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => { setIsModalOpen(false); setSearchQuery(""); }}
                className="px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => modalSelected && handleSelectMetier(modalSelected)}
                disabled={!modalSelected}
                className={`px-5 py-3 rounded-xl text-sm font-black transition-all flex-1 md:flex-none ${
                  modalSelected ? "bg-[#155faa] text-white hover:bg-[#114b8a]" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Sélectionner
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-gray::-webkit-scrollbar { width: 6px; }
        .scrollbar-gray::-webkit-scrollbar-track { background: rgba(15,23,42,0.04); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.20); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.30); }
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
      `}</style>
    </div>
  );
}
