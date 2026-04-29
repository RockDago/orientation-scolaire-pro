import { useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getMetierById, getAllMetiersCache } from "../../../services/metier.services";
import BuildingSVG from "./BuildingSVG";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-20 z-0 origin-top-right">
        <img src={pictoOrientation} alt="" className="w-[160px] lg:w-[280px] object-contain" />
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function Section11({ metier, onRetour, onVoirFormations, onHome }) {
  const navigate = useNavigate();
  const [metierDetails, setMetierDetails] = useState(metier || null);
  const [loading,        setLoading]       = useState(false);

  useEffect(() => {
    if (!metier) return;

    const normalize = (str) => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // Helper pour normaliser un champ qui peut être array ou string
    const normalizeField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field.map(normalize);
      return [normalize(String(field))];
    };

    const loadDetails = async () => {
      if (metier.parcoursFormation?.length > 0) {
        setMetierDetails(metier);
      } else if (metier.id && typeof metier.id === "number") {
        setLoading(true);
        try {
          const details = await getMetierById(metier.id);
          setMetierDetails(details);
        } catch (err) {
          console.error("Erreur chargement détails métier:", err);
          setMetierDetails(metier);
        } finally {
          setLoading(false);
        }
      } else {
        setMetierDetails(metier);
      }
    };

    loadDetails();
  }, [metier?.id, metier?.domaine, metier?.mention]);

  const m = metierDetails;

  const parcours =
    m?.parcoursFormation?.length > 0
      ? m.parcoursFormation
      : m?.parcours?.length > 0
      ? m.parcours
      : ["Aucun parcours disponible pour ce métier."];

  const handleVoirFormations = () => {
    if (!m) return;
    onVoirFormations?.({
      id:          m.id,
      label:       m.label,
      mention:     m.mention,
      niveau:      m.niveau,
      description: m.description,
      serie:       m.serie       || null,
      parcours:    m.parcours    || null,
      categorie:   m.categorie   || null,
    });
  };

  if (loading) {
    return (
      <div className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
        <GradBg />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
          </div>
          <p className="text-white font-black text-xl">Chargement du parcours…</p>
          <p className="text-white/60 text-sm">{metier?.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>

      <div className="s11-shell relative z-10 flex flex-col h-full w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-4 overflow-hidden">
        {/* Retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center p-0 mb-4"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Zone scrollable */}
        <div className="s11-scroll flex-1 min-h-0 overflow-y-auto py-2 pb-36 sm:pb-40 scrollbar-hide">
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2"
            style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
          >
            Parcours de formation
          </span>

          <div className="s11-title-wrap mb-8">
            <p className="text-[11px] sm:text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">Formation sélectionnée :</p>
            <h1 className="s11-title text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight break-words">
              {m?.label || "—"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {m?.niveau && (
              <span className="bg-[#155faa]/60 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Niveau : {Array.isArray(m.niveau) ? m.niveau.join(", ") : m.niveau}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="s11-steps w-full max-w-2xl flex flex-col gap-0 mb-4">
              {parcours.map((etape, i) => (
                <div key={i} className="flex items-stretch gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 z-10"
                      style={{
                        background: i === parcours.length - 1 ? "white" : "rgba(255,255,255,0.25)",
                        color:      i === parcours.length - 1 ? "#1250c8" : "white",
                        border:     "2px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < parcours.length - 1 && (
                      <div
                        className="w-0.5 flex-1 my-1"
                        style={{ background: "rgba(255,255,255,0.3)", minHeight: "20px" }}
                      />
                    )}
                  </div>
                  <div
                    className="flex-1 rounded-2xl px-4 py-3 mb-2"
                    style={{
                      background: i === parcours.length - 1
                        ? "rgba(255,255,255,0.20)"
                        : "rgba(255,255,255,0.10)",
                      border: i === parcours.length - 1
                        ? "1px solid rgba(255,255,255,0.45)"
                        : "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug break-words">
                      {etape}
                    </p>
                    {i === parcours.length - 1 && (
                      <div className="flex items-center gap-1 mt-1">
                        <FiCheckCircle size={12} style={{ color: "#1a3ea8" }} />
                        <span className="text-[10px] sm:text-[11px] font-semibold" style={{ color: "#1a3ea8" }}>
                          Objectif final
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Boutons bas - Fixés en bas */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md px-6 pointer-events-none flex justify-center">
        <button
          onClick={handleVoirFormations}
          className="w-full bg-[#1250c8] hover:bg-[#1a3ea8] text-white border-none rounded-full px-6 py-3.5 sm:py-4 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-xl transition-all font-black text-[clamp(0.78rem,1vw,0.95rem)] active:scale-95 pointer-events-auto"
        >
          <span>Établissements proposant ce parcours</span>
          <FiArrowRight size={18} />
        </button>
      </div>

      {/* Home Fixed - Centered */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
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
        .s11-shell {
          flex: 1;
          min-height: 0;
        }
        .s11-title {
          font-size: clamp(2rem, 4.7vw, 4.2rem);
        }
        @media (max-height: 840px) {
          .s11-title-wrap {
            margin-bottom: 1.25rem;
          }
          .s11-title {
            font-size: clamp(1.7rem, 3.8vw, 3rem);
          }
          .s11-steps {
            max-width: 44rem;
          }
          .s11-steps > div {
            gap: 0.75rem;
          }
          .s11-steps > div > div:last-child {
            padding: 0.65rem 0.85rem;
          }
          .s11-steps p {
            font-size: 0.8rem;
          }
        }
        @media (max-height: 720px) {
          .s11-title {
            font-size: clamp(1.45rem, 3.3vw, 2.4rem);
          }
          .s11-scroll {
            padding-bottom: 8.5rem;
          }
          .s11-steps > div > div:last-child {
            padding: 0.6rem 0.75rem;
          }
          .s11-steps p {
            font-size: 0.74rem;
            line-height: 1.35;
          }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
