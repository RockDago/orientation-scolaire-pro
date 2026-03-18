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
        <div>
          <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Description du métier</p>
          <p className="text-white/95 text-sm leading-relaxed">{metier.description}</p>
        </div>

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

        {metier.serie?.length > 0 && (
          <div>
            <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-2">Séries recommandées</p>
            <div className="flex flex-wrap gap-2">
              {metier.serie.map((p, i) => (
                <span key={i} className="text-[12px] bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full">
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

/* ── Icône décorative : carte géographique stylisée ── */
function DecoSVG() {
  return (
    <>
      <div className="absolute top-0 right-0 pointer-events-none opacity-25 z-0 origin-top-right">
        <img src={pictoExplorer} alt="" className="w-[260px] object-contain opacity-80" />
      </div>

      {/* Ligne ondulée subtile */}
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
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  /* ── VUE MULTIPLE RÉSULTATS ── */
  if (isMultipleResults) {
    return (
      <div className="relative w-full h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <DecoSVG />
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]"><BuildingSVG /></div>

        {/* Deux colonnes — même hauteur grâce à h-screen et overflow-hidden */}
        <div className="relative z-10 flex flex-col lg:flex-row flex-1 overflow-hidden" style={{ height: "calc(100vh - 0px)" }}>

          {/* Gauche */}
          <div className="flex flex-col w-full lg:w-1/2 xl:w-[52%] px-6 sm:px-10 lg:px-14 pt-6 pb-4 h-full">
            <button onClick={onRetour} className="text-white/80 hover:text-white transition-colors w-12 h-12 flex items-center justify-center shrink-0 mb-4" aria-label="Retour">
              <IoArrowBackCircleOutline size={42} />
            </button>
            <div className="shrink-0 mb-4">
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">{metier.label}</h1>
              <p className="text-white/80 text-sm font-semibold mt-2 uppercase tracking-widest">
                {metier.results.length} métier{metier.results.length > 1 ? "s" : ""} trouvé{metier.results.length > 1 ? "s" : ""}
              </p>
            </div>
            {/* Liste scrollable qui prend tout l'espace restant */}
            <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-3 pr-2 pb-20 min-h-0">
              {metier.results.map((item) => {
                const active = selectedMetier?.id === item.id;
                return (
                  <div key={item.id} onClick={() => setSelectedMetier(item)}
                    className={`rounded-2xl p-4 border cursor-pointer transition-all ${active ? "bg-white/20 border-white/50 shadow-lg" : "bg-white/10 border-white/20 hover:bg-white/15"}`}>
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
          </div>

          {/* Droite — exactement même hauteur que la gauche */}
          <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 pb-20 h-full overflow-hidden">
            {selectedMetier && (
              <div className="w-full h-full">
                <MetierDetailPanel metier={selectedMetier} />
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <button onClick={onHome} className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm" aria-label="Accueil">
            <HiOutlineHome size={30} />
          </button>
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
    <div className="relative w-full h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1550cc] via-[#1e72d8] via-[#30b8a4] via-[#7dc922] to-[#9ed418] overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <DecoSVG />
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]"><BuildingSVG /></div>

      {/* Deux colonnes — même hauteur via h-screen */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 overflow-hidden" style={{ height: "calc(100vh - 0px)" }}>

        {/* Gauche */}
        <div className="flex flex-col w-full lg:w-1/2 xl:w-[52%] px-6 sm:px-10 lg:px-14 pt-6 pb-4 h-full">
          <button onClick={onRetour} className="text-white/80 hover:text-white transition-colors w-12 h-12 flex items-center justify-center shrink-0 mb-4" aria-label="Retour">
            <IoArrowBackCircleOutline size={42} />
          </button>
          <div className="shrink-0">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mt-1 mb-1">{m?.label || "Métier"}</h1>
            <div className="inline-block bg-white/90 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-800 mb-4 lg:mb-3">
              {m?.mention || "Formation"}
            </div>
          </div>
          {/* Parcours scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin-white pb-24 min-h-0">
            {m?.parcoursFormation && m.parcoursFormation.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <h2 className="text-white font-black text-base uppercase tracking-wide mb-3">Parcours de formation</h2>
                <div className="space-y-4">
                  {m.parcoursFormation.map((etape, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 bg-white/25 border border-white/40 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-black">{index + 1}</span>
                        </div>
                        {index < m.parcoursFormation.length - 1 && <div className="w-px flex-1 min-h-[20px] bg-white/20 mt-1.5" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-white/95 text-sm leading-relaxed pt-1">{etape}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Mobile uniquement */}
            <div className="lg:hidden mt-6">
              {m && <MetierDetailPanel metier={m} />}
            </div>
          </div>
        </div>

        {/* Droite — exactement même hauteur que la gauche */}
        <div className="hidden lg:flex relative z-10 flex-1 px-8 xl:px-12 py-10 pb-24 h-full overflow-hidden">
          {m && (
            <div className="w-full h-full">
              <MetierDetailPanel metier={m} />
            </div>
          )}
        </div>
      </div>

      {/* Bouton carte */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-6 pointer-events-none flex justify-center">
        <button onClick={() => onVoirCarte(m)}
          className="w-full bg-[#1250c8] hover:bg-[#1a3ea8] text-white font-black py-4 px-6 lg:py-3 rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 pointer-events-auto">
          <span className="text-sm">Établissements proposant ce parcours</span>
          <HiOutlineArrowRight size={18} />
        </button>
      </div>

      {/* Home */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <button onClick={onHome} className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm" aria-label="Accueil">
          <HiOutlineHome size={30} />
        </button>
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