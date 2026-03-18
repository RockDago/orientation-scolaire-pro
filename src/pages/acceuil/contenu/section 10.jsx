import { useState, useRef, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllMetiers } from "../../../services/metier.services";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[200px] lg:w-[280px] object-contain" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 400 100"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
        >
          <rect
            x="50"
            y="35"
            width="40"
            height="65"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="135"
            y="30"
            width="50"
            height="70"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="195"
            y="45"
            width="35"
            height="55"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="278"
            y="38"
            width="42"
            height="62"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="330"
            y="50"
            width="30"
            height="50"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
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

const NIVEAUX_COURTS = ["Bac+2", "Bac+3"];
const NIVEAUX_LONGS = ["Bac+4", "Bac+5", "Bac+6", "Bac+7", "Bac+8"];

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filtrerMetiers(metiers, reponseDomaine, reponseEtudes) {
  return metiers.filter((metier) => {
  
    if (reponseDomaine) {
      const domaineNorm = normalize(reponseDomaine);
      const metierDomNorm = normalize(metier.domaine);
      const mentionNorm = normalize(metier.mention);
      if (metierDomNorm !== domaineNorm && mentionNorm !== domaineNorm) return false;
    }
  
    if (reponseEtudes) {
      const niveau = (metier.niveau || "").trim(); 
      if (reponseEtudes === "court") {
        if (!NIVEAUX_COURTS.includes(niveau)) return false;
      } else if (reponseEtudes === "long") {
        if (!NIVEAUX_LONGS.includes(niveau)) return false;
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
      className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col"
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

      <div className="relative z-10 flex flex-col h-full w-full px-4 sm:px-8 pt-4 pb-3">
        {/* Header simple */}
        <div className="flex items-center justify-between shrink-0 mb-0">
          <button
            onClick={onRetour}
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-0"
            aria-label="Retour"
          >
            <IoArrowBackCircleOutline size={42} />
          </button>
        </div>

        {/* Titre giant */}
        <div className="mb-6 lg:mb-4">
          <h1 className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-2 uppercase">
            Métiers<br />Suggérés
          </h1>
          {!loading && (
            <p className="text-xs sm:text-sm text-white/60 font-black tracking-widest uppercase">
              {total} résultat{total > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Zone de la carte */}
        <div
          className="flex-1 flex flex-col w-full max-w-2xl mx-auto min-h-0"
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
              className="flex-1 flex flex-col rounded-3xl p-6 sm:p-8 slide-in overflow-hidden mb-4"
              key={metier.id || index}
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {metier.mention && metier.mention !== "—" && (
                  <div className="mb-4">
                    <span
                      className="inline-block text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.20)",
                        color: "white",
                      }}
                    >
                      {metier.mention}
                    </span>
                  </div>
                )}

                <h2 className="text-2xl sm:text-4xl lg:text-3xl font-black text-white leading-tight mb-4 pr-4">
                  {metier.label}
                </h2>

                {metier.description && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-black text-white/50 uppercase tracking-widest">Description</p>
                    <p className="text-sm sm:text-lg lg:text-base text-white/90 leading-relaxed font-medium">
                      {metier.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {metier.niveau && (
                    <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Niveau Requis</p>
                      <p className="text-white font-bold text-sm">{metier.niveau}</p>
                    </div>
                  )}
                  {metier.serie && (
                    <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Série</p>
                      <p className="text-white font-bold text-sm">{metier.serie}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-4">
                <button
                  onClick={handleVoirParcours}
                  className="w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 hover:shadow-2xl active:scale-95 shadow-lg"
                  style={{ background: "white", color: "#1250c8" }}
                >
                  Découvrir le parcours
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination & Home */}
        {!loading && total > 0 && (
          <div className="shrink-0 pt-2 pb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto w-full px-2 mb-4">
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
          <HiOutlineHome size={30} />
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
