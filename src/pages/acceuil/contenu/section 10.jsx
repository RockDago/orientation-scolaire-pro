import { useState, useRef, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllMetiers } from "../../../services/metier.services";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import BuildingSVG from "./BuildingSVG";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[160px] lg:w-[280px] object-contain" />
      </div>

      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg
          width="100%"
          height="60"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

const NIVEAUX_COURTS = [
  "bac+2", "bac+3", "bac +2", "bac +3",
  "licence", "bts", "dut", "dts", "deug", "diplome d'etat"
];
const NIVEAUX_LONGS = [
  "bac+4", "bac+5", "bac+6", "bac+7", "bac+8",
  "bac +4", "bac +5", "bac +6", "bac +7", "bac +8",
  "master", "doctorat", "ingenieur", "mba", "dea", "dess"
];

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Vérifie si un champ JSON (array ou string) contient une valeur normalisée
function fieldContainsNorm(field, valueNorm) {
  if (!field || !valueNorm) return false;
  if (Array.isArray(field)) {
    return field.some((item) => {
      const n = normalize(String(item));
      return n === valueNorm || n.includes(valueNorm) || valueNorm.includes(n);
    });
  }
  const n = normalize(String(field));
  return n === valueNorm || n.includes(valueNorm) || valueNorm.includes(n);
}

function filtrerMetiers(metiers, reponseDomaine, reponseEtudes) {
  return metiers.filter((metier) => {

    if (reponseDomaine) {
      const domaineNorm = normalize(reponseDomaine);
      // domaine et mention sont des tableaux JSON dans la BDD
      const inDomaine = fieldContainsNorm(metier.domaine, domaineNorm);
      const inMention = fieldContainsNorm(metier.mention, domaineNorm);
      if (!inDomaine && !inMention) return false;
    }

    if (reponseEtudes) {
      // niveau peut être un tableau JSON ou une string
      const niveauxRaw = Array.isArray(metier.niveau)
        ? metier.niveau
        : metier.niveau
          ? [metier.niveau]
          : [];
      
      const niveauxNorm = niveauxRaw.map(n => normalize(String(n)));

      if (reponseEtudes === "court") {
        // Au moins un niveau doit être dans les niveaux courts
        if (!niveauxNorm.some((n) => NIVEAUX_COURTS.some(c => n.includes(c) || c.includes(n)))) return false;
      } else if (reponseEtudes === "long") {
        // Au moins un niveau doit être dans les niveaux longs
        if (!niveauxNorm.some((n) => NIVEAUX_LONGS.some(l => n.includes(l) || l.includes(n)))) return false;
      }
    }

    return true;
  });
}

function MetierDetailPanel({ metier, onVoirParcours }) {
  if (!metier) return null;

  return (
    <div className="relative w-full h-auto max-h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 p-6 sm:p-10 xl:p-12 flex flex-col overflow-hidden">
      {/* Titre & badges */}
      <div className="shrink-0 mb-3 sm:mb-5">
        <h2 className="text-white font-black text-lg sm:text-2xl xl:text-3xl leading-tight mb-2 sm:mb-3 uppercase">
          {metier.label}
        </h2>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {metier.niveau && (
            <span className="text-white text-[10px] sm:text-xs font-bold bg-[#155faa]/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider">
              Niveau : {Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}
            </span>
          )}
        </div>
      </div>

      {/* Contenu - On permet le scroll si le texte est vraiment trop long pour la page */}
      <div className="overflow-y-auto scrollbar-thin-white space-y-6 sm:space-y-8 pr-2">
        <div>
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
            Description du métier
          </p>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-medium">{metier.description}</p>
        </div>

        {metier.mention && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
              Mention
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(Array.isArray(metier.mention) ? metier.mention : [metier.mention]).map((m, idx) => (
                <span key={idx} className="text-white text-[10px] sm:text-xs font-bold bg-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {metier.parcours?.length > 0 && (
          <div>
            <p className="text-white/55 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
              Parcours d'études possibles
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {metier.parcours.map((p, i) => (
                <span key={i} className="text-[10px] sm:text-xs bg-white/15 border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-white">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {metier.serie?.length > 0 && (
          <div>
            <p className="text-white/55 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
              Séries recommandées
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {metier.serie.map((p, i) => (
                <span key={i} className="text-[10px] sm:text-xs bg-white/20 border border-white/30 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-8 sm:pt-10 flex justify-end">
        <button
          onClick={() => onVoirParcours?.(metier)}
          className="group inline-flex items-center gap-2 text-white hover:text-[#c2e832] font-black text-[clamp(0.8rem,1vw,0.9rem)] transition-all uppercase tracking-wide"
        >
          Découvrir le parcours
          <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function Section10({
  reponseDomaine,
  reponseEtudes,
  onRetour,
  onVoirParcours,
  onHome,
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [metiersFiltres, setMetiersFiltres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(
    "Connexion à la base de données…",
  );
  const touchStartX = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadEtFiltrer = async () => {
      setLoading(true);
      setMetiersFiltres([]);
      setIndex(0);
      setLoadingText("Connexion à la base de données…");

      try {
        const tous = await getAllMetiers();
        if (cancelled) return;

        setLoadingText("Application des filtres…");
        const filtres = filtrerMetiers(tous, reponseDomaine, reponseEtudes);
        if (!cancelled) setMetiersFiltres(filtres);
      } catch (err) {
        console.error("Erreur chargement métiers:", err);
        if (!cancelled) setMetiersFiltres([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEtFiltrer();
    return () => {
      cancelled = true;
    };
  }, [reponseDomaine, reponseEtudes]);

  const total = metiersFiltres.length;
  const metier = metiersFiltres[index] ?? null;

  const handlePrev = () => setIndex((i) => (i - 1 + total) % total);
  const handleNext = () => setIndex((i) => (i + 1) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? handleNext() : handlePrev();
    touchStartX.current = null;
  };

  const handleVoirParcoursInternal = () => {
    if (!metier) return;
    onVoirParcours?.({
      id: metier.id,
      label: metier.label,
      mention: metier.mention,
      niveau: metier.niveau,
      description: metier.description,
      serie: metier.serie || null,
      parcours: metier.parcours || null,
      categorie: metier.categorie || null,
    });
  };

  return (
    <div
      className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      {/* Page de chargement plein écran */}
      {loading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
          style={{
            background:
              "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
          }}
        >
          <GradBg />
          <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              />
            </div>
            <div>
              <p className="text-white font-black text-2xl mb-1">
                Métiers suggérés
              </p>
              <p className="text-white/70 text-sm font-medium animate-pulse">
                {loadingText}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden h-full">
          
          {/* ─── VUE DESKTOP (Section 3 Style) ─── */}
          <div className="hidden lg:flex flex-row flex-1 min-h-0 overflow-hidden h-full">
            {/* Gauche : Liste */}
            <div className="flex flex-col w-1/2 xl:w-[52%] px-10 lg:px-14 pt-12 h-full min-h-0 overflow-hidden">
              
              {/* Bouton retour */}
              <button
                onClick={onRetour}
                className="text-white/80 hover:text-white transition-colors w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 mb-6"
                aria-label="Retour"
              >
                <IoArrowBackCircleOutline size={42} />
              </button>

              <div className="shrink-0 mb-6">
                <h1 className="text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight uppercase">
                  Métiers Suggérés
                </h1>
                <p className="text-white/80 text-[clamp(0.72rem,0.95vw,0.95rem)] font-semibold mt-2 uppercase tracking-widest">
                  {total} résultat{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                </p>
              </div>

              {/* Liste scrollable */}
              <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-3 pr-2 pb-20 min-h-0">
                {total === 0 ? (
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20 text-center">
                    <p className="text-white/85 text-sm">Aucun métier trouvé.</p>
                  </div>
                ) : (
                  metiersFiltres.map((item, i) => (
                    <div
                      key={item.id || i}
                      onClick={() => setIndex(i)}
                      className={`rounded-2xl p-4 border cursor-pointer transition-all ${index === i ? "bg-white/20 border-white/50" : "bg-white/10 border-white/20 hover:bg-white/15"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-[1rem] uppercase">{item.label}</h3>
                        <span className="text-[10px] bg-white/25 text-white px-2 py-1 rounded-full font-bold uppercase">
                          {Array.isArray(item.niveau) ? item.niveau[0] : item.niveau}
                        </span>
                      </div>
                      
                      <p className="text-white/75 text-xs leading-relaxed line-clamp-2 mb-3">{item.description}</p>

                      {item.mention && (
                        <div className="mb-3">
                          <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Mention</p>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(item.mention) ? item.mention : [item.mention]).map((m, idx) => (
                              <span key={idx} className="text-[9px] bg-white/10 text-white/90 px-2 py-0.5 rounded-full font-bold uppercase border border-white/10">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Droite : Détails */}
            <div className="flex-1 px-8 xl:px-12 pt-40 pb-10 h-full overflow-hidden">
              {metier && (
                <MetierDetailPanel metier={metier} onVoirParcours={handleVoirParcoursInternal} />
              )}
            </div>
          </div>

          {/* ─── VUE MOBILE / TABLETTE (Carousel) ─── */}
          <div className="lg:hidden flex flex-col flex-1 min-h-0 h-full overflow-hidden">
            <div className="px-6 pt-6">
              <button
                onClick={onRetour}
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
                aria-label="Retour"
              >
                <IoArrowBackCircleOutline size={32} className="sm:hidden" />
                <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
              </button>

              <div className="s10-title mb-6">
                <h1 className="s10-page-title text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight uppercase">
                  Métiers Suggérés
                </h1>
                <p className="s10-result-count text-xs sm:text-sm text-white/60 font-black tracking-widest uppercase mt-1">
                  {total} résultat{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Zone de la carte CAROUSEL */}
            <div
              className="s10-card-area flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto min-h-0 px-6"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {total === 0 ? (
                <div className="rounded-3xl p-8 flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md">
                  <p className="text-white/85 text-center text-base">Aucun résultat.</p>
                </div>
              ) : (
                metier && (
                  <div className="slide-in max-h-full overflow-hidden flex flex-col" key={metier.id || index}>
                    <MetierDetailPanel metier={metier} onVoirParcours={handleVoirParcoursInternal} />
                  </div>
                )
              )}
            </div>

            {/* Pagination Carousel */}
            {total > 0 && (
              <div className="s10-pagination shrink-0 pt-4 pb-20 px-6">
                <div className="flex items-center justify-between w-full max-w-md mx-auto">
                  <button
                    onClick={handlePrev}
                    disabled={total <= 1}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 text-white border border-white/10 disabled:opacity-30"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {metiersFiltres.slice(0, 10).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-full transition-all"
                          style={{
                            width: i === index ? "18px" : "6px",
                            height: "6px",
                            background: i === index ? "white" : "rgba(255,255,255,0.3)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{index + 1} / {total}</p>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={total <= 1}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 text-white border border-white/10 disabled:opacity-30"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <button
          onClick={onHome}
          className="text-white hover:text-white/80 transition-colors bg-black/10 p-2 rounded-full backdrop-blur-sm pointer-events-auto shadow-lg"
          aria-label="Accueil"
        >
          <HiOutlineHome size={26} className="sm:hidden" />
          <HiOutlineHome size={30} className="hidden sm:block" />
        </button>
      </div>

      <style>{`
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
