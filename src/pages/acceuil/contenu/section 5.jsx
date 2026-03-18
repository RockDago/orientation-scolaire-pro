import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import BuildingSVG from "./BuildingSVG";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { searchMetier } from "../../../services/metier.services";
import {
  getAllEtablissementsCache,
  recordEtablissementSelection,
} from "../../../services/etablissement.services";

const REGION_LABELS = {
  diana:               "Diana",
  sava:                "Sava",
  sofia:               "Sofia",
  boeny:               "Boeny",
  analanjirofo:        "Analanjirofo",
  betsiboka:           "Betsiboka",
  "alaotra-mangoro":   "Alaotra Mangoro",
  melaky:              "Melaky",
  bongolava:           "Bongolava",
  itasy:               "Itasy",
  analamanga:          "Analamanga",
  atsinanana:          "Atsinanana",
  menabe:              "Menabe",
  vakinankaratra:      "Vakinankaratra",
  "amoron-i-mania":    "Amoron'i Mania",
  vatovavy:            "Vatovavy",
  "haute-matsiatra":   "Haute Matsiatra",
  fitovinany:          "Fitovinany",
  ihorombe:            "Ihorombe",
  "atsimo-atsinanana": "Atsimo-Atsinanana",
  "atsimo-andrefana":  "Atsimo-Andrefana",
  androy:              "Androy",
  anosy:               "Anosy",
};

const NAME_TO_ID = {
  Diana:                 "diana",
  Sava:                  "sava",
  Sofia:                 "sofia",
  Boeny:                 "boeny",
  Analanjirofo:          "analanjirofo",
  Betsiboka:             "betsiboka",
  "Alaotra Mangoro":     "alaotra-mangoro",
  "Alaotra-Mangoro":     "alaotra-mangoro",
  Melaky:                "melaky",
  Bongolava:             "bongolava",
  Itasy:                 "itasy",
  Analamanga:            "analamanga",
  Atsinanana:            "atsinanana",
  Menabe:                "menabe",
  Vakinankaratra:        "vakinankaratra",
  "Amoron'i Mania":      "amoron-i-mania",
  "Amoron I Mania":      "amoron-i-mania",
  Vatovavy:              "vatovavy",
  "Vatovavy-Fitovinany": "vatovavy",
  "Haute Matsiatra":     "haute-matsiatra",
  "Haute-Matsiatra":     "haute-matsiatra",
  Fitovinany:            "fitovinany",
  Ihorombe:              "ihorombe",
  "Atsimo-Atsinanana":   "atsimo-atsinanana",
  "Atsimo Atsinanana":   "atsimo-atsinanana",
  "Atsimo-Andrefana":    "atsimo-andrefana",
  "Atsimo Andrefana":    "atsimo-andrefana",
  Androy:                "androy",
  Anosy:                 "anosy",
};

function normalizeRegionId(name) {
  return (
    NAME_TO_ID[name] ||
    name.toLowerCase().replace(/[''\s]+/g, "-").replace(/--+/g, "-")
  );
}

export default function Section5({ metier, reponseDomaine, onRetour, onSelectRegion, onHome }) {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [activeRegions, setActiveRegions] = useState([]);
  const [etablissementsParRegion, setEtablissementsParRegion] = useState({});
  const [regionToProvince, setRegionToProvince] = useState({});

  useEffect(() => {
    const loadRegions = async () => {
      setLoading(true);
      if (!metier?.label && !reponseDomaine) {
        setActiveRegions([]);
        setEtablissementsParRegion({});
        setRegionToProvince({});
        setLoading(false);
        return;
      }

      try {
        const tous = await getAllEtablissementsCache();
        const metierLabel = metier?.label || "";

        const filtered = tous.filter((e) => {
          if (reponseDomaine && !metierLabel) {
            return e.mention?.toLowerCase() === reponseDomaine.toLowerCase();
          }
          return e.metier?.toLowerCase() === metierLabel.toLowerCase();
        });

        const regionsSet    = new Set();
        const countByRegion = {};
        const regToProv     = {};

        filtered.forEach((etab) => {
          if (etab.region) {
            const regionId = normalizeRegionId(etab.region);
            regionsSet.add(regionId);
            countByRegion[regionId] = (countByRegion[regionId] || 0) + 1;
            // On garde le label original du province
            if (!regToProv[regionId]) {
              regToProv[regionId] = etab.province || "Madagascar";
            }
          }
        });

        const newActiveRegions = Array.from(regionsSet);
        setActiveRegions(newActiveRegions);
        setEtablissementsParRegion(countByRegion);
        setRegionToProvince(regToProv);

        if (metier?.id && metier?.label) {
          searchMetier(metier.id, metier.label).catch(console.error);
        }
      } catch (err) {
        console.error("Erreur chargement régions:", err);
        setActiveRegions([]);
        setEtablissementsParRegion({});
        setRegionToProvince({});
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, [metier?.label, metier?.id, reponseDomaine]);

  const handleSelectRegion = (regionId) => {
    const regionLabel = REGION_LABELS[regionId] || regionId;
    try {
      recordEtablissementSelection(
        metier?.label || "Formation",
        regionLabel,
        "Région sélectionnée",
      ).catch(console.error);
    } catch (error) {
      console.error("Erreur tracking:", error);
    }
    onSelectRegion?.(regionId);
  };

  const metierLabel = metier?.label || (reponseDomaine ? `Formation en ${reponseDomaine}` : "ce parcours");

  // On ne garde que les régions qui ont des résultats
  const sortedRegionIds = [...activeRegions].sort((a, b) => 
    REGION_LABELS[a].localeCompare(REGION_LABELS[b])
  );

  return (
    <div className="relative w-full min-h-screen font-['Sora'] flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />


      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>


      <div className="relative z-10 flex flex-col w-full px-5 sm:px-8 pt-5 pb-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-0">
          <button
            onClick={onRetour}
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-0"
            aria-label="Retour"
          >
            <IoArrowBackCircleOutline size={42} />
          </button>
        </div>

        {/* Titre giant */}
        <div className="mb-4 lg:mb-3">
          <h1 className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-2 uppercase">
            Choisir une<br />Région
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-bold tracking-widest uppercase">
            {activeRegions.length} région{activeRegions.length > 1 ? "s" : ""} disponible{activeRegions.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Info parcours */}
        <div className="mb-4 lg:mb-3">
          <p className="text-xs text-white/70 font-semibold mb-1">Métier sélectionné :</p>
          <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <p className="text-white font-bold text-sm leading-tight">{metierLabel}</p>
          </div>
        </div>

        {/* Zone scrollable des régions */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2 scrollbar-hide">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white font-bold text-sm">Chargement des régions…</p>
             </div>
          ) : sortedRegionIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-w-6xl mx-auto">
              {sortedRegionIds.map((id) => {
                const count = etablissementsParRegion[id] || 0;
                const label = REGION_LABELS[id];
                const province = regionToProvince[id];

                return (
                  <button
                    key={id}
                    onClick={() => handleSelectRegion(id)}
                    className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col gap-2 bg-white/15 hover:bg-white/25 border-white/40 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    style={{ border: "1px solid" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                       <div className="flex items-center gap-2">
                          <FiMapPin size={16} className="text-white" />
                          <div className="text-left">
                            <span className="font-bold text-sm text-white block leading-tight">{label}</span>
                            <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">{province}</span>
                          </div>
                       </div>
                       <FiChevronRight size={14} className="text-white/50 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="mt-1">
                        <p className="text-[11px] font-bold text-white/80">
                          {count} établissement{count > 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Effet au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                <FiMapPin size={32} className="text-white/40" />
              </div>
              <p className="text-white font-black text-xl mb-2">Aucun établissement trouvé</p>
              <p className="text-white/60 text-sm max-w-xs mx-auto">
                Désolé, nous n'avons trouvé aucun établissement pour cette formation dans les régions répertoriées.
              </p>
              <button 
                onClick={onRetour}
                className="mt-6 px-8 py-3.5 bg-[#1250c8] text-white rounded-full font-black text-sm lg:text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Retour
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* Home Fixed - Centered */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <button
            onClick={onHome}
            className="text-white hover:text-white/80 transition-colors pointer-events-auto shadow-lg bg-black/10 rounded-full p-2 backdrop-blur-sm"
            aria-label="Accueil"
          >
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
