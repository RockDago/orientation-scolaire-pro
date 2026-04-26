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

  const handleVoirParcours = () => {
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
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {reponseDomaine && (
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  {reponseDomaine}
                </span>
              )}
              {reponseEtudes && (
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  {reponseEtudes === "court" ? "≤ Bac+3" : "≥ Bac+4"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="s10-shell relative z-10 flex flex-col h-full w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-3">
        {/* Header simple */}
        <div className="flex items-center justify-between shrink-0 mb-0">
          <button
            onClick={onRetour}
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-0"
            aria-label="Retour"
          >
            <IoArrowBackCircleOutline size={32} className="sm:hidden" />
            <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
          </button>
        </div>

        {/* Titre giant */}
        <div className="s10-title mb-6 lg:mb-4">
          <h1 className="s10-page-title text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-2 uppercase">
            Métiers<br />Suggérés
          </h1>
          {!loading && (
            <p className="s10-result-count text-xs sm:text-sm text-white/60 font-black tracking-widest uppercase">
              {total} résultat{total > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Zone de la carte */}
        <div
          className="s10-card-area flex-1 flex flex-col w-full max-w-2xl lg:max-w-4xl mx-auto min-h-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Aucun résultat */}
          {!loading && total === 0 && (
            <div
              className="rounded-3xl p-8 flex flex-col items-center justify-center gap-3"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/85 text-center text-base leading-relaxed">
                Désolé, aucun métier ne correspond à tes critères.
                <br />
                Essaie une autre combinaison.
              </p>
            </div>
          )}

          {/* Carte métier */}
          {!loading && total > 0 && metier && (
            <div
              className="s10-card flex-1 flex flex-col rounded-3xl p-6 sm:p-8 slide-in overflow-hidden mb-4"
              key={metier.id || index}
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="s10-card-body flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {metier.mention && (Array.isArray(metier.mention) ? metier.mention.length > 0 : metier.mention !== "—") && (
                  <div className="s10-card-badge mb-4">
                    <span
                      className="inline-block text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.20)",
                        color: "white",
                      }}
                    >
                      {Array.isArray(metier.mention) ? metier.mention.join(", ") : metier.mention}
                    </span>
                  </div>
                )}

                <h2 className="s10-card-title text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-6 pr-4 uppercase">
                  {metier.label}
                </h2>

                {metier.description && (
                  <div className="s10-description space-y-2 mb-6">
                    <p className="s10-section-label text-xs font-black text-white/50 uppercase tracking-widest">Description</p>
                    <p className="s10-description-text text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {metier.description}
                    </p>
                  </div>
                )}

                <div className="s10-meta-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {metier.niveau && (Array.isArray(metier.niveau) ? metier.niveau.length > 0 : true) && (
                    <div className="s10-meta-box bg-white/10 rounded-2xl p-3 border border-white/10">
                      <p className="s10-meta-label text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Niveau Requis</p>
                      <p className="s10-meta-value text-white font-bold text-sm">{Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}</p>
                    </div>
                  )}
                  {metier.serie && (Array.isArray(metier.serie) ? metier.serie.length > 0 : true) && (
                    <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Série</p>
                      <p className="text-white font-bold text-sm">{Array.isArray(metier.serie) ? metier.serie.join(", ") : metier.serie}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="s10-cta-row shrink-0 pt-6 flex justify-end">
                <button
                  onClick={handleVoirParcours}
                  className="group inline-flex items-center gap-2 text-white hover:text-[#c2e832] font-black text-[clamp(0.8rem,1vw,1rem)] transition-all uppercase tracking-wide"
                >
                  Découvrir le parcours
                  <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination & Home */}
        {!loading && total > 0 && (
          <div className="s10-pagination shrink-0 pt-2 pb-12">
            <div className="flex items-center justify-between max-w-2xl lg:max-w-4xl mx-auto w-full px-2 mb-4">
              <button
                onClick={handlePrev}
                disabled={total <= 1}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 bg-white/10 text-white border border-white/10 pointer-events-auto"
                aria-label="Précédent"
              >
                <FiChevronLeft size={24} />
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {metiersFiltres.slice(0, 8).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === index ? "18px" : "6px",
                        height: "6px",
                        background: i === index ? "white" : "rgba(255,255,255,0.3)",
                      }}
                      aria-label={`Métier ${i + 1}`}
                    />
                  ))}
                  {total > 8 && <span className="text-white/40 text-[9px] font-black">+{total - 8}</span>}
                </div>
                <p className="text-[10px] font-black text-white/50 tracking-widest uppercase">
                  {index + 1} / {total}
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={total <= 1}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 bg-white/10 text-white border border-white/10 pointer-events-auto"
                aria-label="Suivant"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Home Fixed - Centered at the global standard position */}
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
        .s10-shell {
          flex: 1;
          min-height: 0;
        }
        .s10-title {
          margin-bottom: clamp(0.9rem, 2vh, 1.5rem);
        }
        .s10-page-title {
          font-size: clamp(2.35rem, 5vw, 4.6rem);
        }
        .s10-result-count {
          font-size: clamp(0.72rem, 0.95vw, 0.9rem);
        }
        .s10-card-area {
          width: min(100%, 68rem);
        }
        .s10-card {
          width: min(100%, 62rem);
          margin-inline: auto;
          max-height: min(31rem, calc(100dvh - 18rem));
          padding: clamp(1.1rem, 2vw, 2rem);
        }
        .s10-card-body {
          min-height: 0;
        }
        .s10-card-title {
          font-size: clamp(2rem, 3.2vw, 3.6rem);
        }
        .s10-description-text {
          font-size: clamp(0.85rem, 1vw, 1rem);
        }
        .s10-meta-grid > div {
          padding: 0.9rem 1rem;
          border-radius: 1rem;
        }
        .s10-meta-grid > div > p:first-child {
          font-size: 0.62rem;
        }
        .s10-meta-grid > div > p:last-child,
        .s10-meta-value {
          font-size: clamp(0.84rem, 1vw, 1rem);
          line-height: 1.35;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-height: 900px) {
          .s10-card {
            max-height: min(28rem, calc(100dvh - 16rem));
          }
        }
        @media (max-height: 820px) {
          .s10-shell {
            padding-top: 1rem;
            padding-bottom: 0.5rem;
          }
          .s10-page-title {
            font-size: clamp(2rem, 4.1vw, 3.6rem);
            line-height: 0.94;
          }
          .s10-result-count {
            font-size: 0.72rem;
          }
          .s10-card {
            width: min(100%, 56rem);
            max-height: min(24.5rem, calc(100dvh - 14rem));
            border-radius: 1.75rem;
            padding: 1.1rem 1.25rem;
          }
          .s10-card-badge {
            margin-bottom: 0.75rem;
          }
          .s10-card-title {
            font-size: clamp(1.7rem, 2.5vw, 2.5rem);
            margin-bottom: 1rem;
            padding-right: 0;
          }
          .s10-description {
            margin-bottom: 1rem;
            gap: 0.35rem;
          }
          .s10-section-label,
          .s10-meta-grid > div > p:first-child,
          .s10-meta-label {
            font-size: 0.58rem;
          }
          .s10-description-text,
          .s10-meta-grid > div > p:last-child,
          .s10-meta-value {
            font-size: 0.8rem;
            line-height: 1.42;
          }
          .s10-meta-grid {
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          .s10-meta-grid > div {
            padding: 0.78rem 0.9rem;
          }
          .s10-cta-row {
            padding-top: 0.85rem;
          }
          .s10-pagination {
            padding-bottom: 3rem;
          }
        }
        @media (max-height: 720px) {
          .s10-page-title {
            font-size: clamp(1.8rem, 3.5vw, 3rem);
          }
          .s10-card {
            width: min(100%, 52rem);
            max-height: min(21.5rem, calc(100dvh - 12.5rem));
            padding: 0.95rem 1rem;
          }
          .s10-card-title {
            font-size: clamp(1.45rem, 2.1vw, 2rem);
            margin-bottom: 0.75rem;
          }
          .s10-description-text,
          .s10-meta-grid > div > p:last-child,
          .s10-meta-value {
            font-size: 0.75rem;
            line-height: 1.35;
          }
          .s10-meta-grid {
            gap: 0.6rem;
          }
          .s10-meta-grid > div {
            padding: 0.7rem 0.8rem;
          }
          .s10-cta-row button {
            font-size: 0.82rem;
          }
          .s10-pagination {
            padding-bottom: 2.75rem;
          }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
