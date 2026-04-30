import { useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import BuildingSVG from "./BuildingSVG";
import { HiOutlineHome, HiOutlineArrowRight } from "react-icons/hi";
import pictoExplorer from "../../../assets/picto_Explorer.png";
import { useNavigate } from "react-router-dom";
import { getAllMetiers, getMetierById } from "../../../services/metier.services";
import { findMetierBySlug } from "../../../utils/slug";



function MetierDetailPanel({ metier }) {
  if (!metier) return null;

  return (
    <div className="relative h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 p-4 sm:p-6 xl:p-8 flex flex-col overflow-hidden">
      {/* Titre & badges */}
      <div className="shrink-0 mb-3 sm:mb-5">

        <div className="flex flex-wrap gap-1.5 sm:gap-2">

          {metier.niveau && (
            <span className="text-white text-[10px] sm:text-xs font-bold bg-[#155faa]/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
              Niveau : {Array.isArray(metier.niveau) ? metier.niveau.join(", ") : metier.niveau}
            </span>
          )}
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-4 sm:space-y-5 pr-2">
        <div>
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
            Description du métier
          </p>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed">{metier.description}</p>
        </div>

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
    </div>
  );
}



function DecoSVG() {
  return (
    <>
      <div className="absolute top-0 right-0 pointer-events-none opacity-25 z-0 origin-top-right">
        {/* Icône déco réduite sur petit mobile */}
        <img src={pictoExplorer} alt="" className="w-[160px] sm:w-[260px] object-contain opacity-80" />
      </div>
      <div className="absolute top-[42%] left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </>
  );
}



export default function Section3({ metier, onRetour, onVoirCarte, slugFromUrl, onMetierLoaded, onHome }) {
  const navigate = useNavigate();
  const [selectedMetier, setSelectedMetier] = useState(metier);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setSelectedMetier(metier); }, [metier]);

  useEffect(() => {
    const loadMetierDetails = async () => {
      if (metier?.parcoursFormation?.length > 0) { setSelectedMetier(metier); return; }
      if (metier?.id && typeof metier.id === "number") {
        setLoading(true);
        try {
          const details = await getMetierById(metier.id);
          setSelectedMetier(details);
          onMetierLoaded?.(details);
        } catch (e) { console.error(e); } finally { setLoading(false); }
        return;
      }
      if (slugFromUrl) {
        setLoading(true);
        try {
          const allMetiers = await getAllMetiers();
          const found = findMetierBySlug(slugFromUrl, allMetiers);
          if (found) {
            const details = await getMetierById(found.id);
            setSelectedMetier(details);
            onMetierLoaded?.(details);
          }
        } catch (e) { console.error(e); } finally { setLoading(false); }
      }
    };
    loadMetierDetails();
  }, [metier?.id, slugFromUrl, onMetierLoaded]);

  const m = selectedMetier;
  const isMultipleResults = metier?.isDomaine && metier?.results?.length > 0;


  /* ── Loading ── */
  if (loading) {
    return (
      <div className="relative w-full min-h-screen font-['Sora'] flex items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] to-[#a0d820]">
        <div className="text-white text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-base sm:text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }


  /* ── VUE MULTIPLE RÉSULTATS ── */
  if (isMultipleResults) {
    return (
      <div className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <DecoSVG />
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]"><BuildingSVG /></div>

        <div className="relative z-10 flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden h-full">

          {/* ── Gauche ── */}
          <div className="flex flex-col w-full lg:w-1/2 xl:w-[52%] px-4 sm:px-10 lg:px-14 pt-4 sm:pt-6 h-full min-h-0 overflow-hidden">

            {/* Bouton retour — icône réduite sur mobile */}
            <button
              onClick={onRetour}
              className="text-white/80 hover:text-white transition-colors w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 mb-3 sm:mb-4"
              aria-label="Retour"
            >
              <IoArrowBackCircleOutline size={32} className="sm:hidden" />
              <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
            </button>

            <div className="shrink-0 mb-3 sm:mb-4">
              <h1 className="text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight">
                {metier.label}
              </h1>
              <p className="text-white/80 text-[clamp(0.72rem,0.95vw,0.95rem)] font-semibold mt-1.5 sm:mt-2 uppercase tracking-widest">
                {metier.results.length} métier{metier.results.length > 1 ? "s" : ""} trouvé{metier.results.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Liste scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-2.5 sm:space-y-3 pr-2 pb-20 min-h-0">
              {metier.results.map((item) => {
                const active = selectedMetier?.id === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedMetier(item)}
                    className={`rounded-2xl p-3 sm:p-4 border cursor-pointer transition-all ${active ? "bg-white/20 border-white/50" : "bg-white/10 border-white/20 hover:bg-white/15"}`}
                    aria-pressed={active}
                  >
                    <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                      <h3 className="font-bold text-white text-[clamp(0.88rem,1.15vw,1.05rem)] leading-snug">{item.label}</h3>
                      <span className="text-[9px] sm:text-[10px] bg-white/25 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shrink-0 ml-2 font-bold">
                        {Array.isArray(item.niveau) ? item.niveau.join(", ") : item.niveau}
                      </span>
                    </div>
                    <p className="text-white/75 text-[clamp(0.72rem,0.9vw,0.82rem)] leading-relaxed line-clamp-2">{item.description}</p>

                  </button>
                );
              })}
            </div>

            {/* Bouton Home ancré en bas */}
            <div className="shrink-0 flex justify-center py-2.5 sm:py-3 z-10">
              <button
                onClick={onHome}
                className="text-white hover:text-white/80 transition-colors shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm"
                aria-label="Accueil"
              >
                <HiOutlineHome size={26} className="sm:hidden" />
                <HiOutlineHome size={30} className="hidden sm:block" />
              </button>
            </div>
          </div>

          {/* ── Droite ── */}
          <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 pb-10 h-full overflow-hidden">
            {selectedMetier && (
              <div className="w-full h-full">
                <MetierDetailPanel metier={selectedMetier} />
              </div>
            )}
          </div>
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


  /* ── VUE SIMPLE ── */
  return (
      <div className="relative w-full h-[100dvh] min-h-[100dvh] font-['Sora'] flex flex-col bg-gradient-to-br from-[#1550cc] via-[#1e72d8] via-[#30b8a4] via-[#7dc922] to-[#9ed418] overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <DecoSVG />
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]"><BuildingSVG /></div>

      <div className="relative z-10 flex flex-col lg:flex-row flex-1 min-h-0 h-full overflow-hidden">

        {/* ── Gauche ── */}
        <div className="flex flex-col w-full lg:w-1/2 xl:w-[52%] px-4 sm:px-10 lg:px-14 pt-4 sm:pt-6 h-full min-h-0 overflow-hidden">

          {/* Bouton retour */}
          <button
            onClick={onRetour}
            className="text-white/80 hover:text-white transition-colors w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 mb-3 sm:mb-4"
            aria-label="Retour"
          >
            {/* Deux tailles d'icône : petite sur xs, grande sur sm+ */}
            <IoArrowBackCircleOutline size={28} className="sm:hidden" />
            <IoArrowBackCircleOutline size={38} className="hidden sm:block" />
          </button>

            {/* Titre */}
            <div className="shrink-0 mb-2.5 sm:mb-3">
              <h1 className="text-[clamp(1.85rem,4.8vw,3.7rem)] font-black text-white leading-tight tracking-tight mt-0.5 mb-1 uppercase">
                {m?.label || "Métier"}
              </h1>

            </div>

          {/* Zone scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin-white min-h-0 pr-2 pb-24 sm:pb-28">
            {/* Mobile uniquement : Détails du métier (description, niveau, etc.) */}
            <div className="lg:hidden mb-4 sm:mb-6">
              {m && <MetierDetailPanel metier={m} />}
            </div>

            {/* Parcours de formation (Timeline) - Affiché en bas sur mobile, et normalement sur desktop */}
            {m?.parcoursFormation && m.parcoursFormation.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/15">
                <h2 className="text-white font-black text-[clamp(0.85rem,1vw,1rem)] uppercase tracking-wide mb-2.5 sm:mb-3">
                  Parcours de formation
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {m.parcoursFormation.map((etape, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/25 border border-white/40 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-black">{index + 1}</span>
                        </div>
                        {index < m.parcoursFormation.length - 1 && (
                          <div className="w-px flex-1 min-h-[16px] sm:min-h-[20px] bg-white/20 mt-1.5" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className="text-white/95 text-[clamp(0.78rem,0.95vw,0.94rem)] leading-relaxed pt-1">{etape}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutons ancrés en bas */}
          <div className="shrink-0 flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 z-10">
            <button
              onClick={() => onVoirCarte(m)}
              className="w-full max-w-xs bg-[#1250c8] hover:bg-[#1a3ea8] text-white font-black py-2.5 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-[clamp(0.75rem,0.9vw,0.9rem)]"
            >
              <span className="text-[clamp(0.75rem,0.9vw,0.9rem)]">Établissements</span>
              <HiOutlineArrowRight size={15} className="sm:hidden" />
              <HiOutlineArrowRight size={17} className="hidden sm:block" />
            </button>
            <button
              onClick={onHome}
              className="text-white hover:text-white/80 transition-colors shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm"
              aria-label="Accueil"
            >
              <HiOutlineHome size={26} className="sm:hidden" />
              <HiOutlineHome size={30} className="hidden sm:block" />
            </button>
          </div>
        </div>

        {/* ── Droite ── */}
        <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 pb-10 h-full overflow-hidden">
          {m && (
            <div className="w-full h-full">
              <MetierDetailPanel metier={m} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.22s ease-out both; }
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
      `}</style>
    </div>
  );
}
