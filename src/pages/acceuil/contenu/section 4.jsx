import { useMemo, useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import BuildingSVG from "./BuildingSVG";
import { HiOutlineHome } from "react-icons/hi";
import {
  FiX,
  FiMapPin,
  FiPhone,
  FiBook,
  FiAward,
  FiClock,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  getAllEtablissementsCache,
  recordEtablissementSelection,
} from "../../../services/etablissement.services";

const TYPES  = ["Tous", "Public", "Privé"];
const NIVEAUX = ["Tous", "Licence", "Master", "Doctorat"];

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

function FicheModal({ fiche, metier, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!fiche) return null;

  const getDuree = (niveau) => {
    if (!niveau) return "Variable";
    const n = niveau.toLowerCase();
    if (n.includes("doctorat"))                          return "7 à 11 ans (Bac +7 à +11)";
    if (n.includes("ingénieur") || n.includes("master")) return "5 ans (Bac +5)";
    if (n.includes("licence") && n.includes("master"))   return "3 à 5 ans (Bac +3 à +5)";
    if (n.includes("licence"))                           return "3 ans (Bac +3)";
    if (n.includes("dut") || n.includes("bts"))          return "2 ans (Bac +2)";
    if (n.includes("diplôme d'état"))                    return "3 ans (Bac +3)";
    return niveau;
  };

  const getAdmission = (type) =>
    type === "Public" ? "Concours d'entrée" : "Sur dossier / entretien";

  const fields = [
    { icon: <FiBook size={15} />,  label: "Établissement", value: fiche.nom },
    { icon: <FiAward size={15} />, label: "Mention",       value: fiche.mention },
    { icon: <FiBook size={15} />,  label: "Parcours",      value: fiche.parcours },
    { icon: <FiAward size={15} />, label: "Niveau",        value: fiche.niveau },
    {
      icon:  <FiClock size={15} />,
      label: "Durée",
      value: fiche.duree || getDuree(fiche.niveau),
    },
    {
      icon:  <FiUsers size={15} />,
      label: "Admission",
      value: fiche.admission || getAdmission(fiche.type),
    },
    { icon: <FiPhone size={15} />,  label: "Contact",      value: fiche.contact },
    {
      icon:  <FiMapPin size={15} />,
      label: "Localisation",
      value: `${fiche.ville || fiche.region || fiche.province}, Madagascar`,
    },
  ];

  if (metier) {
    if (metier.label) {
      fields.unshift({ icon: <FiAward size={15} />, label: "Métier",          value: metier.label });
    }
    if (metier.serie) {
      fields.push({    icon: <FiBook size={15} />,  label: "Série",           value: metier.serie });
    }
    if (metier.parcours) {
      fields.push({    icon: <FiBook size={15} />,  label: "Parcours Métier", value: metier.parcours });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background:
          "linear-gradient(160deg,#0f1e50 0%,#0e3a6e 30%,#0a6655 65%,#2a7a10 100%)",
      }}
    >
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg,#1250c8,#28b090,#a0d820)" }}
      />
      <div
        className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pt-5 pb-4 flex items-center justify-between gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="min-w-0 flex-1">
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full mb-2"
            style={{
              background: "rgba(255,255,255,0.15)",
              color:      "rgba(255,255,255,0.9)",
            }}
          >
            Fiche établissement
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug break-words">
            {fiche.nom}
          </h2>
          <div className="flex items-start gap-1.5 mt-1.5 text-white/60 text-xs">
            <FiMapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span>{fiche.ville || fiche.region || fiche.province}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <FiX size={16} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-5 custom-scrollbar-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
          {fields.map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.08)",
                border:     "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <span className="text-white/80">{icon}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                  {label}
                </p>
              </div>
              <p className="text-sm font-semibold text-white leading-snug break-words">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 9999px; }
      `}</style>
    </div>
  );
}

export default function Section4({ metier, selectedRegion, reponseDomaine, onRetour, onHome }) {
  const navigate = useNavigate();
  const [selectedEtab, setSelectedEtab] = useState(null);
  const [filterType,   setFilterType]   = useState("Tous");
  const [filterNiveau, setFilterNiveau] = useState("Tous");
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEtablissements = async () => {
      setLoading(true);
      try {
        const tous = await getAllEtablissementsCache();

        const metierLabel = metier?.label || "";
        const regionLabel = selectedRegion
          ? REGION_LABELS[selectedRegion] || selectedRegion
          : null;

        const data = tous.filter((e) => {   
          if (metierLabel) {
            if (e.metier?.toLowerCase() !== metierLabel.toLowerCase()) return false;
          } else if (reponseDomaine) {
            if (e.mention?.toLowerCase() !== reponseDomaine.toLowerCase()) return false;
          }  
          if (regionLabel) {
            if (e.region !== regionLabel && e.province !== regionLabel) return false;
          }
          return true;
        });

        setEtablissements(data);
      } catch (error) {
        console.error("Erreur chargement établissements:", error);
        setEtablissements([]);
      } finally {
        setLoading(false);
      }
    };

    loadEtablissements();
  }, [metier?.label, selectedRegion, reponseDomaine]);

  const etablissementsFiltres = useMemo(() => {
    return etablissements.filter((e) => {
      if (filterType   !== "Tous" && e.type   !== filterType)                              return false;
      if (filterNiveau !== "Tous" && !e.niveau?.toLowerCase().includes(filterNiveau.toLowerCase())) return false;
      return true;
    });
  }, [etablissements, filterType, filterNiveau]);

  const mentionLabel = metier ? metier.mention || metier.label : "Formation";
  const regionLabel  = selectedRegion
    ? REGION_LABELS[selectedRegion] || selectedRegion
    : null;

  const handleSelectEtablissement = async (etab) => {
    try {
      await recordEtablissementSelection(
        metier?.label || "Formation",
        regionLabel   || "Non spécifiée",
        etab.nom,
      );
    } catch (error) {
      console.error("Erreur tracking établissement:", error);
    }
    setSelectedEtab(etab);
  };

  if (loading) {
    return (
      <div className="relative w-full min-h-screen font-['Sora'] flex items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] to-[#c2e832]">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Chargement des établissements…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen font-['Sora'] flex flex-col"
      style={{
        background:
          "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
      }}
    >
      {/* Background Building SVG Decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
        <BuildingSVG />
      </div>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Conteneur principal avec flex column et min-height */}

      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4">
        {/* Bouton retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center mb-4 p-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin-white pr-1">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-2">
              UNIVERSITÉS<br className="sm:hidden" />&amp; INSTITUTS
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-white">
                {mentionLabel}
              </span>
              {regionLabel && (
                <span className="inline-flex items-center gap-1.5 bg-black/15 border border-white/30 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                  <FiMapPin size={11} />
                  {regionLabel}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 lg:mb-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-white/70 font-semibold">Type :</span>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={
                      filterType === t
                        ? { background: "white", color: "#1250c8" }
                        : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-white/70 font-semibold">Niveau :</span>
              <div className="flex flex-wrap gap-1.5">
                {NIVEAUX.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFilterNiveau(n)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={
                      filterNiveau === n
                        ? { background: "white", color: "#1250c8" }
                        : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            
            {(filterType !== "Tous" || filterNiveau !== "Tous") && (
              <button
                type="button"
                onClick={() => { setFilterType("Tous"); setFilterNiveau("Tous"); }}
                className="text-xs text-white/60 hover:text-white underline underline-offset-2"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <p className="text-xs text-white/60 mb-3 lg:mb-2 font-medium">
            {etablissementsFiltres.length} établissement
            {etablissementsFiltres.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-2 mb-8 lg:mb-6">
            {etablissementsFiltres.length > 0 ? (
              etablissementsFiltres.map((etab, i) => (
                <button
                  key={etab.id || i}
                  type="button"
                  onClick={() => handleSelectEtablissement(etab)}
                  className="group w-full text-left rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                  style={{
                    background:    "rgba(255,255,255,0.98)",
                    backdropFilter: "blur(4px)",
                    border:        "1px solid rgba(255,255,255,0.7)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{
                          background:
                            etab.type === "Public"
                              ? "linear-gradient(135deg,#1250c8,#28b090)"
                              : "linear-gradient(135deg,#28b090,#a0d820)",
                        }}
                      />
                      <span className="font-bold text-sm text-gray-900 leading-snug break-words flex-1">
                        {etab.nom}
                      </span>
                    </div>
                    <FiChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: etab.type === "Public" ? "rgba(18,80,200,0.12)" : "rgba(40,176,144,0.12)",
                        color:      etab.type === "Public" ? "#1250c8"              : "#0a6655",
                      }}
                    >
                      {etab.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                      <FiMapPin size={9} />
                      {etab.ville || etab.region || etab.province}
                    </span>
                  </div>

                  {etab.mention && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {etab.mention}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <div className="col-span-full">
                <div
                  className="rounded-2xl px-5 py-8 text-center text-sm text-gray-500"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                >
                  Aucun établissement trouvé pour ce métier dans cette région.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Icône Home fixée en bas */}
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

      {selectedEtab && (
        <FicheModal
          fiche={selectedEtab}
          metier={metier}
          onClose={() => setSelectedEtab(null)}
        />
      )}

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-thin-white::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin-white::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin-white::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.22);
          border-radius: 9999px;
        }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
}