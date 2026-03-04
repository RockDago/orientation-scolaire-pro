import { useState, useRef } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const METIERS_SUGGERES = [
  {
    id: "ingenieur-info",
    titre: "Ingénieur en informatique",
    mention: "Informatique",
    description: "Conçoit, développe et maintient des solutions logicielles et numériques. Très demandé dans les entreprises et startups tech à Madagascar.",
    niveau: "Bac + 5",
    parcours: [
      "Bac scientifique ou technique (Série C, D ou Technique)",
      "Licence en Informatique – ESPA ou Université de Fianarantsoa",
      "Master / Diplôme d'Ingénieur – ESPA Antananarivo, IST ou EMIT",
    ],
  },
  {
    id: "data-analyst",
    titre: "Data Analyst / Data Scientist",
    mention: "Informatique & Data",
    description: "Analyse et interprète de grandes quantités de données pour la prise de décisions stratégiques dans les entreprises malgaches et internationales.",
    niveau: "Bac + 3 à Bac + 5",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "Licence en Mathématiques, Statistiques ou Informatique",
      "Master en Data Science – ESPA Antananarivo",
    ],
  },
  {
    id: "medecin",
    titre: "Médecin",
    mention: "Médecine",
    description: "Diagnostique et traite les maladies. La FMPA d'Antananarivo et la Faculté de Médecine de Mahajanga forment les médecins malgaches.",
    niveau: "Bac + 7 à Bac + 11",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "1ère année – FMPA Antananarivo ou Université de Mahajanga",
      "Doctorat en Médecine – FMPA ou Université de Mahajanga",
    ],
  },
  {
    id: "avocat",
    titre: "Avocat / Juriste",
    mention: "Droit",
    description: "Défend les droits de ses clients et conseille sur les questions juridiques. Les Facultés de Droit forment chaque année de nombreux juristes.",
    niveau: "Bac + 5",
    parcours: [
      "Bac littéraire (Série A ou B)",
      "Licence en Droit – FACDROIT Antananarivo",
      "Master en Droit + Stage au Barreau de Madagascar",
    ],
  },
  {
    id: "ingenieur-civil",
    titre: "Ingénieur civil / BTP",
    mention: "Génie Civil",
    description: "Conçoit et supervise la construction d'infrastructures : routes, ponts, bâtiments. Secteur en forte croissance à Madagascar.",
    niveau: "Bac + 5",
    parcours: [
      "Bac scientifique ou technique (Série C, D ou Technique)",
      "Licence en Génie Civil – ESPA Antananarivo",
      "Diplôme d'Ingénieur en Génie Civil – ESPA ou IST Antananarivo",
    ],
  },
  {
    id: "infirmier",
    titre: "Infirmier / Infirmière",
    mention: "Sciences de la Santé",
    description: "Assure les soins aux patients et assiste les médecins. Profession essentielle avec des débouchés dans tout Madagascar.",
    niveau: "Bac + 3",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "Diplôme d'État d'Infirmier – INSPC Antananarivo ou centres régionaux",
      "Licence en Sciences Infirmières (optionnel)",
    ],
  },
  {
    id: "marketing",
    titre: "Marketing digital / Chef de projet",
    mention: "Marketing & Communication",
    description: "Pilote les stratégies digitales des entreprises. Avec l'essor du numérique à Madagascar, ce profil est de plus en plus recherché.",
    niveau: "Bac + 3 à Bac + 5",
    parcours: [
      "Bac toutes séries",
      "Licence en Marketing / Communication – ISCAM Antananarivo",
      "Master en Management Digital – INSCAE ou ISCAM",
    ],
  },
  {
    id: "architecte",
    titre: "Architecte",
    mention: "Architecture & Urbanisme",
    description: "Conçoit des bâtiments fonctionnels et esthétiques. Le secteur de la construction à Madagascar offre de nombreuses opportunités.",
    niveau: "Bac + 5",
    parcours: [
      "Bac scientifique ou technique",
      "Licence en Architecture – ESPA Antananarivo",
      "Master en Architecture – ESPA ou Institut Catholique de Madagascar",
    ],
  },
  {
    id: "pharmacien",
    titre: "Pharmacien",
    mention: "Pharmacie",
    description: "Prépare et dispense les médicaments, conseille les patients et veille à la sécurité des traitements à Madagascar.",
    niveau: "Bac + 6",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "PACES – FMPA Antananarivo ou Université de Mahajanga",
      "Doctorat en Pharmacie (6 ans)",
    ],
  },
  {
    id: "ingenieur-agro",
    titre: "Ingénieur agronome",
    mention: "Agriculture & Agronomie",
    description: "Améliore les techniques agricoles à Madagascar, 4ème secteur employeur du pays. L'ESSA forme les meilleurs agronomes de l'île.",
    niveau: "Bac + 5",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "Licence en Agronomie – ESSA Antananarivo",
      "Master / Diplôme Ingénieur Agronome – ESSA",
    ],
  },
  {
    id: "tourisme",
    titre: "Responsable Tourisme / Hôtellerie",
    mention: "Tourisme & Hôtellerie",
    description: "Gère des établissements touristiques, organise des circuits. Secteur clé pour Madagascar, destination en fort développement.",
    niveau: "Bac + 3 à Bac + 5",
    parcours: [
      "Bac toutes séries",
      "Licence en Tourisme / Hôtellerie – ISCAM ou Université de Toliara",
      "Master en Management du Tourisme – ISCAM Antananarivo",
    ],
  },
  {
    id: "pilote",
    titre: "Pilote de ligne",
    mention: "Aéronautique",
    description: "Conduit des avions commerciaux. L'ANAC Madagascar et le Centre d'Ivato forment les pilotes professionnels de la région.",
    niveau: "Bac + 3 à Bac + 5",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "Formation théorique de pilote – ANAC Madagascar Ivato",
      "Licence de pilote professionnel (CPL) + qualifications",
    ],
  },
  {
    id: "comptable",
    titre: "Expert-comptable",
    mention: "Comptabilité & Finance",
    description: "Gère la comptabilité et conseille les entreprises sur leur stratégie financière et fiscale dans l'économie malgache.",
    niveau: "Bac + 5",
    parcours: [
      "Bac série B ou C",
      "Licence en Comptabilité – INSCAE Antananarivo",
      "Master CCA (Comptabilité, Contrôle, Audit) – INSCAE",
    ],
  },
  {
    id: "veto",
    titre: "Vétérinaire",
    mention: "Médecine Vétérinaire",
    description: "Soigne les animaux et joue un rôle crucial dans l'élevage et la santé publique. L'ESSA forme les vétérinaires de Madagascar.",
    niveau: "Bac + 5 à Bac + 6",
    parcours: [
      "Bac scientifique (Série C ou D)",
      "Licence en Médecine vétérinaire – ESSA Antananarivo",
      "Doctorat vétérinaire – ESSA (5 à 6 ans)",
    ],
  },
];

function filtrerMetiers(reponseStatut, reponseDomaine, reponseEtudes) {
  if (!reponseStatut && !reponseDomaine && !reponseEtudes) return METIERS_SUGGERES;
  const filtres = METIERS_SUGGERES.filter((m) => {
    if (reponseDomaine) {
      const d = reponseDomaine.toLowerCase();
      if (d.includes("info") || d.includes("tech") || d.includes("num")) {
        if (!["ingenieur-info", "data-analyst", "marketing"].includes(m.id)) return false;
      } else if (d.includes("sant") || d.includes("méd") || d.includes("med")) {
        if (!["medecin", "infirmier", "pharmacien", "veto"].includes(m.id)) return false;
      } else if (d.includes("droit") || d.includes("juri") || d.includes("admin")) {
        if (!["avocat"].includes(m.id)) return false;
      } else if (d.includes("tour") || d.includes("hôtel")) {
        if (!["tourisme", "marketing"].includes(m.id)) return false;
      } else if (d.includes("agri") || d.includes("agro")) {
        if (!["ingenieur-agro", "veto"].includes(m.id)) return false;
      } else if (d.includes("génie") || d.includes("civil") || d.includes("btp")) {
        if (!["ingenieur-civil", "architecte"].includes(m.id)) return false;
      }
    }
    return true;
  });
  return filtres.length > 0 ? filtres : METIERS_SUGGERES;
}

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

export default function Section10({
  reponseStatut,
  reponseDomaine,
  reponseEtudes,
  onRetour,
  onVoirParcours,
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const metiersFiltres = filtrerMetiers(reponseStatut, reponseDomaine, reponseEtudes);
  const total = metiersFiltres.length;
  const metier = metiersFiltres[index];

  const handlePrev = () => setIndex((i) => (i - 1 + total) % total);
  const handleNext = () => setIndex((i) => (i + 1) % total);

  // Touch/swipe support
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
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
          {/* Titre principal aligné à gauche - taille comme section 7 */}
          <h1 className="self-start text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mt-2 mb-1">
            Métiers suggérés
          </h1>
          
          {/* Compteur aligné à gauche */}
          <p className="self-start text-sm text-white/75 mb-4 font-medium">
            <span className="text-white font-bold">{total}</span> métier{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>

          {/* Conteneur centré pour la carte */}
          <div className="flex flex-col items-center w-full">
            {/* Card — full width, swipeable */}
            <div
              className="w-full max-w-2xl flex-1 flex flex-col"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="rounded-3xl p-5 sm:p-6 flex flex-col gap-3 flex-1"
                style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(12px)" }}
              >
                {/* Emoji + mention */}
                <div className="flex items-center gap-3">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.20)", color: "white" }}>
                    {metier.mention}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug break-words">
                  {metier.titre}
                </h2>

                <p className="text-sm sm:text-base text-white/85 leading-relaxed flex-1">
                  {metier.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.22)", color: "white" }}>
                    Niveau : {metier.niveau}
                  </span>
                </div>

                <button
                  onClick={() => onVoirParcours?.(metier)}
                  className="mt-1 inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "white", color: "#1250c8" }}
                >
                  Voir le parcours
                  <FiArrowRight size={15} />
                </button>
              </div>

              {/* Navigation — icons only (no text labels) */}
              <div className="flex items-center justify-between mt-4 mb-3">
                <button
                  onClick={handlePrev}
                  disabled={total <= 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
                  aria-label="Précédent"
                >
                  <FiChevronLeft size={22} />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[200px]">
                  {metiersFiltres.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === index ? "20px" : "8px",
                        height: "8px",
                        background: i === index ? "white" : "rgba(255,255,255,0.4)"
                      }}
                      aria-label={`Métier ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={total <= 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
                  aria-label="Suivant"
                >
                  <FiChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Zone fixe en bas pour l'icône home */}
        <div className="flex justify-center py-5 mt-4">
          <button onClick={() => navigate("/acceuil/orientation")} className="text-white hover:text-white/80 transition-colors" aria-label="Accueil">
            <HiOutlineHome size={30} />
          </button>
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
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}