import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import BuildingSVG from "./BuildingSVG";
import { getAllMetiers } from "../../../services/metier.services";

const NIVEAUX_COURTS = [
  "bac+2",
  "bac+3",
  "bac +2",
  "bac +3",
  "licence",
  "bts",
  "dut",
  "dts",
  "deug",
  "diplome d'etat",
];

const NIVEAUX_LONGS = [
  "bac+4",
  "bac+5",
  "bac+6",
  "bac+7",
  "bac+8",
  "bac +4",
  "bac +5",
  "bac +6",
  "bac +7",
  "bac +8",
  "master",
  "doctorat",
  "ingenieur",
  "mba",
  "dea",
  "dess",
];

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

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
      const inDomaine = fieldContainsNorm(metier.domaine, domaineNorm);
      const inMention = fieldContainsNorm(metier.mention, domaineNorm);

      if (!inDomaine && !inMention) return false;
    }

    if (reponseEtudes) {
      const niveauxRaw = Array.isArray(metier.niveau)
        ? metier.niveau
        : metier.niveau
          ? [metier.niveau]
          : [];

      const niveauxNorm = niveauxRaw.map((n) => normalize(String(n)));

      if (reponseEtudes === "court") {
        if (
          !niveauxNorm.some((n) =>
            NIVEAUX_COURTS.some((court) => n.includes(court) || court.includes(n)),
          )
        ) {
          return false;
        }
      } else if (reponseEtudes === "long") {
        if (
          !niveauxNorm.some((n) =>
            NIVEAUX_LONGS.some((long) => n.includes(long) || long.includes(n)),
          )
        ) {
          return false;
        }
      }
    }

    return true;
  });
}

function MetierDetailPanel({ metier, onVoirParcours }) {
  if (!metier) return null;

  return (
    <div className="relative h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 p-4 sm:p-6 xl:p-8 flex flex-col overflow-hidden">
      <div className="shrink-0 mb-4">
        <h2 className="text-white font-black text-lg sm:text-2xl leading-tight uppercase mb-2">
          {metier.label}
        </h2>

        {metier.niveau && (
          <span className="inline-block text-white text-[10px] sm:text-xs font-bold bg-[#155faa]/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            Niveau : {Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-4 pr-2">
        <div>
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">
            Description du metier
          </p>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed">{metier.description}</p>
        </div>

        {metier.mention && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">
              Mention
            </p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(metier.mention) ? metier.mention : [metier.mention]).map((item, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-white/15 border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {metier.parcours?.length > 0 && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">
              Parcours d'etudes possibles
            </p>
            <div className="flex flex-wrap gap-2">
              {metier.parcours.map((item, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-white/15 border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {metier.serie?.length > 0 && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">
              Series recommandees
            </p>
            <div className="flex flex-wrap gap-2">
              {metier.serie.map((item, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-white/20 border border-white/30 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-6 flex justify-end">
        <button
          onClick={() => onVoirParcours?.(metier)}
          className="text-white font-bold uppercase tracking-wide text-sm hover:text-white/80 transition-colors"
        >
          Parcours
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
  const [index, setIndex] = useState(0);
  const [metiersFiltres, setMetiersFiltres] = useState([]);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadEtFiltrer = async () => {
      setLoading(true);
      setMetiersFiltres([]);
      setIndex(0);

      try {
        const tous = await getAllMetiers();
        if (cancelled) return;

        const filtres = filtrerMetiers(tous, reponseDomaine, reponseEtudes);
        if (!cancelled) {
          setMetiersFiltres(filtres);
        }
      } catch (err) {
        console.error("Erreur chargement metiers:", err);
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
    if (Math.abs(diff) > 40) {
      diff > 0 ? handleNext() : handlePrev();
    }
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

  if (loading) {
    return (
      <div className="relative w-full min-h-screen font-['Sora'] flex items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] to-[#a0d820]">
        <div className="text-white text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base sm:text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="relative z-10 flex-1 min-h-0 overflow-hidden h-full">
        <div className="hidden lg:flex flex-row flex-1 min-h-0 overflow-hidden h-full">
          <div className="flex flex-col w-1/2 xl:w-[52%] px-10 lg:px-14 pt-12 h-full min-h-0 overflow-hidden">
          <button
            onClick={onRetour}
            className="text-white/80 hover:text-white transition-colors w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 mb-6"
            aria-label="Retour"
          >
            <IoArrowBackCircleOutline size={42} />
          </button>

          <div className="shrink-0 mb-6">
            <h1 className="text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight uppercase">
              Metiers suggeres
            </h1>
            <p className="text-white/80 text-[clamp(0.72rem,0.95vw,0.95rem)] font-semibold mt-2 uppercase tracking-widest">
              {total} resultat{total > 1 ? "s" : ""} trouve{total > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-3 pr-2 pb-20 min-h-0">
            {total === 0 ? (
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/85 text-sm">Aucun metier trouve.</p>
              </div>
            ) : (
              metiersFiltres.map((item, i) => {
                const active = index === i;

                return (
                  <button
                    type="button"
                    key={item.id || i}
                    onClick={() => setIndex(i)}
                    className={`w-full rounded-2xl p-4 border text-left transition-all ${
                      active
                        ? "bg-white/20 border-white/50"
                        : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h3 className="font-bold text-white text-[clamp(0.88rem,1.15vw,1.05rem)] leading-snug uppercase">
                        {item.label}
                      </h3>
                      {item.niveau && (
                        <span className="text-[9px] sm:text-[10px] bg-white/25 text-white px-2 py-1 rounded-full shrink-0 font-bold">
                          {Array.isArray(item.niveau) ? item.niveau.join(", ") : item.niveau}
                        </span>
                      )}
                    </div>
                    <p className="text-white/75 text-[clamp(0.72rem,0.9vw,0.82rem)] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </button>
                );
              })
            )}
          </div>
          </div>

          <div className="flex-1 px-8 xl:px-12 pt-40 pb-10 h-full overflow-hidden">
            {metier && (
              <MetierDetailPanel metier={metier} onVoirParcours={handleVoirParcoursInternal} />
            )}
          </div>
        </div>

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

            <div className="mb-6">
              <h1 className="text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight uppercase">
                Metiers suggeres
              </h1>
              <p className="text-xs sm:text-sm text-white/60 font-black tracking-widest uppercase mt-1">
                {total} resultat{total > 1 ? "s" : ""} trouve{total > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div
            className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto min-h-0 px-6"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {total === 0 ? (
              <div className="rounded-3xl p-8 flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md">
                <p className="text-white/85 text-center text-base">Aucun resultat.</p>
              </div>
            ) : (
              metier && (
                <div className="slide-in max-h-full overflow-hidden flex flex-col" key={metier.id || index}>
                  <MetierDetailPanel metier={metier} onVoirParcours={handleVoirParcoursInternal} />
                </div>
              )
            )}
          </div>

          {total > 0 && (
            <div className="shrink-0 pt-4 pb-20 px-6">
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
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                    {index + 1} / {total}
                  </p>
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

      <div className="hidden lg:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]">
        <button
          onClick={onHome}
          className="text-white hover:text-white/80 transition-colors bg-black/10 p-2 rounded-full backdrop-blur-sm shadow-lg"
          aria-label="Accueil"
        >
          <HiOutlineHome size={30} />
        </button>
      </div>

      <style>{`
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
