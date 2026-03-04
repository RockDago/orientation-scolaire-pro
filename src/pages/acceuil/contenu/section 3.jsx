import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const METIERS_LIST = [
  { id: "architecte",      label: "Architecte",                              mention: "Architecture & Urbanisme",   niveau: "Bac + 5", description: "L'architecte conçoit et supervise la construction de bâtiments et d'espaces urbains fonctionnels et esthétiques.", parcours: ["Architecture", "Génie civil", "Design urbain", "BTP"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "avocat",          label: "Avocat / Juriste",                        mention: "Droit",                      niveau: "Bac + 5", description: "L'avocat défend les intérêts de ses clients devant les juridictions et conseille sur les questions juridiques.", parcours: ["Droit privé", "Droit public", "Droit des affaires", "Criminologie"], profil: ["Série A", "Série B"] },
  { id: "data-analyst",    label: "Data analyst / Data scientist",           mention: "Informatique & Data",        niveau: "Bac + 5", description: "Le data analyst analyse et interprète de grandes quantités de données pour aider à la prise de décisions stratégiques.", parcours: ["Statistiques", "Informatique", "Intelligence artificielle", "Big Data"], profil: ["Série C", "Série D"] },
  { id: "designer",        label: "Designer graphique",                      mention: "Arts & Design",              niveau: "Bac + 3", description: "Le designer graphique crée des visuels, logos, interfaces et supports de communication pour les entreprises.", parcours: ["Arts visuels", "Communication", "Design numérique", "Multimédia"], profil: ["Série A", "Série C"] },
  { id: "infirmier",       label: "Infirmier / Infirmière",                  mention: "Sciences de la Santé",       niveau: "Bac + 3", description: "L'infirmier prodigue des soins aux patients, assiste les médecins et assure le suivi thérapeutique.", parcours: ["Sciences infirmières", "Santé publique", "Soins médicaux"], profil: ["Série C", "Série D"] },
  { id: "ingenieur-civil", label: "Ingénieur civil",                         mention: "Génie Civil",                niveau: "Bac + 5", description: "L'ingénieur civil conçoit et supervise des projets d'infrastructure : routes, ponts, bâtiments.", parcours: ["Génie civil", "BTP", "Environnement", "Hydraulique"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "ingenieur-info",  label: "Ingénieur en informatique",               mention: "Informatique",               niveau: "Bac + 5", description: "L'ingénieur informatique conçoit, développe et maintient des solutions logicielles et numériques répondant aux besoins des entreprises et de la société.", parcours: ["Génie logiciel", "Informatique générale", "Systèmes et réseaux", "Intelligence artificielle"], profil: ["Série C", "Série D", "Série technique"] },
  { id: "marketing",       label: "Marketing digital / Community manager",   mention: "Marketing & Communication",  niveau: "Bac + 3", description: "Le marketeur digital gère la présence en ligne des marques et pilote les stratégies de communication numérique.", parcours: ["Marketing", "Communication", "Commerce", "Numérique"], profil: ["Série A", "Série B", "Série C"] },
  { id: "medecin",         label: "Médecin",                                 mention: "Médecine",                   niveau: "Bac + 7", description: "Le médecin diagnostique et traite les maladies, prescrit des traitements et assure le suivi de la santé des patients.", parcours: ["Médecine générale", "Chirurgie", "Pédiatrie", "Spécialités médicales"], profil: ["Série C", "Série D"] },
  { id: "pilote",          label: "Pilote de ligne",                         mention: "Aéronautique",               niveau: "Bac + 3", description: "Le pilote de ligne conduit des avions commerciaux pour le transport de passagers et de marchandises.", parcours: ["Aéronautique", "Navigation aérienne", "Météorologie"], profil: ["Série C", "Série D"] },
  { id: "pharmacien",      label: "Pharmacien",                              mention: "Pharmacie",                  niveau: "Bac + 6", description: "Le pharmacien prépare et dispense les médicaments, conseille les patients et veille à la sécurité des traitements.", parcours: ["Pharmacie", "Biochimie", "Chimie pharmaceutique"], profil: ["Série C", "Série D"] },
  { id: "technicien-aero", label: "Technicien aéronautique",                 mention: "Aéronautique & Maintenance", niveau: "Bac + 2", description: "Le technicien aéronautique assure la maintenance, la réparation et le contrôle des aéronefs.", parcours: ["Maintenance aéronautique", "Électronique", "Mécanique"], profil: ["Série C", "Série D", "Série technique"] },
];

const DEFAULT_METIER = METIERS_LIST.find((m) => m.id === "ingenieur-info");

const getFormationParcours = (metier) => {
  const parcoursMap = {
    "architecte":      ["Bac scientifique ou technique (Série C, D ou technique)", "Licence en Architecture ou Génie civil", "Master en Architecture ou Diplôme d'Architecte"],
    "avocat":          ["Bac littéraire (Série A ou B)", "Licence en Droit", "Master en Droit + CAPA (Certificat d'Aptitude à la Profession d'Avocat)"],
    "data-analyst":    ["Bac scientifique (Série C ou D)", "Licence en Statistiques, Informatique ou Mathématiques", "Master en Data Science ou Big Data"],
    "designer":        ["Bac littéraire ou artistique (Série A)", "Licence en Arts visuels ou Design", "Master en Design graphique ou numérique"],
    "infirmier":       ["Bac scientifique (Série C ou D)", "Diplôme d'État d'Infirmier (3 ans)", "Licence ou Master en Sciences infirmières"],
    "ingenieur-civil": ["Bac scientifique ou technique (Série C, D ou technique)", "Classes préparatoires ou Licence en Génie civil", "Diplôme d'Ingénieur en Génie civil"],
    "ingenieur-info":  ["Bac scientifique ou technique", "Licence en Informatique", "Master ou diplôme d'ingénieur en Informatique"],
    "marketing":       ["Bac toutes séries", "Licence en Marketing, Communication ou Commerce", "Master en Marketing digital ou Management"],
    "medecin":         ["Bac scientifique (Série C ou D)", "Première année commune aux études de santé (PACES)", "Diplôme de Docteur en Médecine (9 à 11 ans)"],
    "pilote":          ["Bac scientifique (Série C ou D)", "Formation théorique de pilote", "Licence de pilote professionnel + qualifications"],
    "pharmacien":      ["Bac scientifique (Série C ou D)", "Première année commune aux études de santé (PACES)", "Diplôme de Docteur en Pharmacie (6 ans)"],
    "technicien-aero": ["Bac technique ou scientifique", "BTS ou DUT en Maintenance aéronautique", "Licence professionnelle en Aéronautique"],
  };
  return parcoursMap[metier?.id] || parcoursMap["ingenieur-info"];
};

// ── Fiche détaillée métier (colonne droite) ───────────────────────────────────
function MetierDetailPanel({ metier }) {
  if (!metier) return null;
  return (
    <div className="relative h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-2xl p-6 xl:p-8 flex flex-col overflow-hidden">
      {/* Titre & badges */}
      <div className="shrink-0 mb-5">
        <h2 className="text-white font-black text-2xl xl:text-3xl leading-tight mb-3">{metier.label}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">{metier.mention}</span>
          {metier.niveau && (
            <span className="text-white text-xs font-bold bg-[#155faa]/60 px-3 py-1.5 rounded-full">Niveau : {metier.niveau}</span>
          )}
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-5 pr-1">
        {/* Description */}
        <div>
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Description du métier</p>
          <p className="text-white/95 text-sm leading-relaxed">{metier.description}</p>
        </div>

        {/* Parcours d'études */}
        {metier.parcours?.length > 0 && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Parcours d'études possibles</p>
            <div className="flex flex-wrap gap-2">
              {metier.parcours.map((p, i) => (
                <span key={i} className="text-[12px] bg-white/15 border border-white/20 px-3 py-1.5 rounded-full text-white">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Séries recommandées */}
        {metier.profil?.length > 0 && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Séries recommandées</p>
            <div className="flex flex-wrap gap-2">
              {metier.profil.map((p, i) => (
                <span key={i} className="text-[12px] bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Débouchés (infos additionnelles visuelles) */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Pourquoi ce métier ?</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-0.5">✦</span>
              <span className="text-white/90 text-sm">Métier en forte demande sur le marché du travail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-0.5">✦</span>
              <span className="text-white/90 text-sm">Nombreuses opportunités à l'échelle nationale et internationale</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-0.5">✦</span>
              <span className="text-white/90 text-sm">Évolution de carrière variée selon la spécialisation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Déco commun
// ─────────────────────────────────────────────────────────────────────────────
function DecoSVG() {
  return (
    <>
      <div className="absolute top-0 right-0 pointer-events-none opacity-40 z-0 scale-125 lg:scale-150 origin-top-right">
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
          <circle cx="158" cy="58" r="44" stroke="white" strokeWidth="2.5" fill="none"/>
          <line x1="158" y1="58" x2="158" y2="14" stroke="white" strokeWidth="2.5"/>
          <line x1="158" y1="58" x2="196" y2="80" stroke="white" strokeWidth="2.5"/>
          <path d="M158 14 A44 44 0 0 1 202 58" stroke="white" strokeWidth="2.5" fill="none"/>
          <path d="M196 80 A44 44 0 1 1 158 14" stroke="white" strokeWidth="2" fill="none" strokeDasharray="3 2"/>
          <rect x="14" y="82" width="16" height="58" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="38" y="62" width="16" height="78" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="62" y="72" width="16" height="68" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="86" y="50" width="16" height="90" rx="3" stroke="white" strokeWidth="2" fill="none"/>
          <line x1="10" y1="142" x2="110" y2="142" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="142" x2="10" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 122 L46 96 L70 106 L94 74" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10"  y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="20"  y="42" width="10" height="13" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="60"  y="22" width="20" height="13" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="148" y="14" width="24" height="16" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="240" y="55" width="28" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="370" y="60" width="25" height="40" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-[42%] left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section3 principal
// ─────────────────────────────────────────────────────────────────────────────
export default function Section3({ metier = DEFAULT_METIER, onRetour, onVoirCarte }) {
  const navigate = useNavigate();
  const [selectedMetier, setSelectedMetier] = useState(metier);
  const m = selectedMetier;
  const formationParcours = getFormationParcours(m);
  const isMultipleResults = metier?.isDomaine && metier?.results?.length > 0;

  // ── Vue liste de résultats (domaine) ──────────────────────────────────────
  if (isMultipleResults) {
    return (
      <div className="relative w-full h-screen overflow-hidden font-['Sora'] flex bg-gradient-to-br from-[#1550cc] via-[#1e72d8] via-[#30b8a4] via-[#7dc922] to-[#9ed418]">
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <DecoSVG />

        {/* Colonne gauche : liste des résultats */}
        <div className="relative z-10 flex flex-col h-full w-full lg:w-1/2 xl:w-[52%] px-6 sm:px-10 lg:px-14 pt-6 pb-4">
          <button onClick={onRetour} className="text-white/80 hover:text-white transition-colors w-12 h-12 flex items-center justify-center shrink-0" aria-label="Retour">
            <IoArrowBackCircleOutline size={42} />
          </button>

          <div className="shrink-0 mt-3 mb-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">{metier.label}</h1>
            <p className="text-white/80 text-sm font-semibold mt-2 uppercase tracking-widest">
              {metier.results.length} métier{metier.results.length > 1 ? "s" : ""} trouvé{metier.results.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-3 pr-2 pb-4">
            {metier.results.map((item) => {
              const active = selectedMetier?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMetier(item)}
                  className={`rounded-2xl p-4 border cursor-pointer transition-all
                    ${active
                      ? "bg-white/20 border-white/50 shadow-lg"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-base leading-snug">{item.label}</h3>
                    <span className="text-[10px] bg-white/25 text-white px-2 py-1 rounded-full shrink-0 ml-2 font-bold">{item.niveau}</span>
                  </div>
                  <p className="text-white/75 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mt-2">{item.mention}</p>
                </div>
              );
            })}
          </div>

          {/* Boutons bas */}
          <div className="shrink-0 pt-3 flex flex-col items-center gap-3">
            <button
              onClick={onVoirCarte}
              className="w-full max-w-sm bg-[#52ad1f] hover:bg-[#469c18] text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="text-sm">Établissements proposant ce parcours</span>
              <HiOutlineArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/acceuil/orientation")} className="text-white/70 hover:text-white transition-colors" aria-label="Accueil">
              <HiOutlineHome size={26} />
            </button>
          </div>
        </div>

        {/* Colonne droite : fiche détaillée du métier sélectionné */}
        <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 h-full">
          {selectedMetier && <MetierDetailPanel metier={selectedMetier} />}
        </div>

        <style>{`
          .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
          .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
          .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
          .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
        `}</style>
      </div>
    );
  }

  // ── Vue détail d'un seul métier ────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen overflow-hidden font-['Sora'] flex bg-gradient-to-br from-[#1550cc] via-[#1e72d8] via-[#30b8a4] via-[#7dc922] to-[#9ed418]">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <DecoSVG />

      {/* ── Colonne gauche : Parcours de formation ── */}
      <div className="relative z-10 flex flex-col h-full w-full lg:w-1/2 xl:w-[52%] px-6 sm:px-10 lg:px-14 pt-6 pb-4">

        <div className="flex-1 overflow-y-auto scrollbar-thin-white pb-4">
          <button onClick={onRetour} className="text-white/80 hover:text-white transition-colors w-12 h-12 flex items-center justify-center" aria-label="Retour">
            <IoArrowBackCircleOutline size={42} />
          </button>

          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mt-3 mb-2">
            {m.label}
          </h1>
          <div className="inline-block bg-white/90 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-800 mb-5">
            {m.mention}
          </div>

          {/* Bloc parcours de formation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
            <h2 className="text-white font-black text-base uppercase tracking-wide mb-4">
              Parcours de formation
            </h2>

            <div className="space-y-4">
              {formationParcours.map((etape, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Numéro + ligne verticale */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 bg-white/25 border border-white/40 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-black">{index + 1}</span>
                    </div>
                    {index < formationParcours.length - 1 && (
                      <div className="w-px flex-1 min-h-[20px] bg-white/20 mt-1.5" />
                    )}
                  </div>
                  {/* Texte de l'étape */}
                  <div className="pb-4">
                    <p className="text-white/95 text-sm leading-relaxed pt-1">{etape}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sur mobile : affiche la fiche détail en dessous */}
          <div className="lg:hidden mt-5">
            <MetierDetailPanel metier={m} />
          </div>
        </div>

        {/* Boutons bas */}
        <div className="shrink-0 pt-3 flex flex-col items-center gap-3">
          <button
            onClick={onVoirCarte}
            className="w-full max-w-sm bg-[#52ad1f] hover:bg-[#469c18] text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span className="text-sm">Établissements proposant ce parcours</span>
            <HiOutlineArrowRight size={18} />
          </button>
          <button onClick={() => navigate("/acceuil/orientation")} className="text-white/70 hover:text-white transition-colors" aria-label="Accueil">
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      {/* ── Colonne droite : Fiche détaillée du métier ── */}
      <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 h-full">
        <MetierDetailPanel metier={m} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.22s ease-out both; }
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
      `}</style>
    </div>
  );
}
