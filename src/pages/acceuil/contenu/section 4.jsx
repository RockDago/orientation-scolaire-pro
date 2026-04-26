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
  FiUsers,
  FiChevronRight,
  FiMail,
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

  const getAdmission = (type) =>
    type === "Public" ? "Concours d'entrée" : "Sur dossier / entretien";

  const formatPhone = (phone) => {
    if (!phone) return "";
    let cleaned = String(phone).replace(/\s/g, "").replace(/-/g, "");
    if (cleaned.length === 10 && cleaned.startsWith("0")) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith("261")) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10, 12)}`;
    }
    return phone;
  };

  const toDisplay = (val, isPhone = false, isList = true) => {
    if (!val) return "";
    if (Array.isArray(val)) {
      if (val.length === 1) return isPhone ? formatPhone(val[0]) : val[0];
      if (!isList) return val.map(item => isPhone ? formatPhone(item) : item).join(", ");
      return (
        <ul className="list-disc list-inside space-y-1">
          {val.map((item, i) => (
            <li key={i} className="leading-tight">
              {isPhone ? formatPhone(item) : item}
            </li>
          ))}
        </ul>
      );
    }
    return isPhone ? formatPhone(val) : String(val);
  };

  const mentionDisplay = toDisplay(fiche.mention);
  const parcoursDisplay = toDisplay(fiche.parcours);
  const niveauDisplay = toDisplay(fiche.niveau);
  const admissionDisplay = toDisplay(fiche.admission || getAdmission(fiche.type));
  const contactDisplay = toDisplay(fiche.contact, true);

  const fields = [
    { icon: <FiAward className="text-indigo-500" />, label: "Mention", value: mentionDisplay },
    { icon: <FiBook className="text-emerald-500" />, label: "Parcours", value: parcoursDisplay },
    { icon: <FiAward className="text-purple-500" />, label: "Niveau", value: niveauDisplay },
    { icon: <FiUsers className="text-rose-500" />, label: "Admission", value: admissionDisplay },
    { icon: <FiPhone className="text-amber-500" />, label: "Contact", value: contactDisplay },
    { icon: <FiMail className="text-blue-400" />, label: "Email", value: fiche.email },
    { icon: <FiMapPin className="text-orange-500" />, label: "Localisation", value: `${fiche.ville || fiche.region || fiche.province}, Madagascar` },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col sm:items-center sm:justify-center sm:p-6">
      {/* Backdrop for Desktop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm hidden sm:block" onClick={onClose} />
      
      <div 
        className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[90dvh] animate-in fade-in zoom-in duration-300"
        style={{
          background: "linear-gradient(160deg,#0f1e50 0%,#0e3a6e 30%,#0a6655 65%,#2a7a10 100%)"
        }}
      >
        {/* Top Rainbow Border */}
        <div 
          className="h-1 w-full flex-shrink-0" 
          style={{ background: "linear-gradient(90deg,#1250c8,#28b090,#a0d820)" }} 
        />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-black/10 backdrop-blur-md">
          <div className="min-w-0">
            <span className="inline-block text-[9px] font-black tracking-widest uppercase text-white/90 bg-white/10 px-2.5 py-1 rounded-full mb-2 border border-white/10">
              Fiche Établissement
            </span>
            <h2 className="text-[clamp(1rem,1.5vw,1.35rem)] font-black text-white leading-tight">
              {fiche.nom}
            </h2>
            <p className="mt-1.5 text-[clamp(0.72rem,0.95vw,0.85rem)] text-white/60 flex items-center gap-1.5 font-medium">
              <FiMapPin size={12} className="text-white/40" />
              {fiche.ville || fiche.region || fiche.province}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
          >
            <FiX size={20} className="text-white/60 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar-dark">
          {/* Description Section */}
          {fiche.description && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">À propos</h4>
              <p className="text-[clamp(0.82rem,1vw,0.95rem)] text-white/80 leading-relaxed italic border-l-4 border-blue-500/50 pl-4 bg-white/5 py-3 rounded-r-xl">
                "{fiche.description}"
              </p>
            </div>
          )}

          {/* Details List (Simplified) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {fields.map(({ icon, label, value }) => (
              <div key={label} className="flex gap-4 group">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-lg transition-transform group-hover:scale-110">
                  <div className="text-white/80">{icon}</div>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
                  <div className="text-[clamp(0.78rem,0.95vw,0.9rem)] font-bold text-white/90 leading-relaxed">
                    {value || "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
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

        // Helper: vérifie si un champ JSON (array ou string) contient une valeur
        const fieldContains = (field, value) => {
          if (!field || !value) return false;
          const valLower = value.toLowerCase().trim();
          if (Array.isArray(field)) {
            return field.some((item) => 
              String(item).toLowerCase().trim() === valLower ||
              String(item).toLowerCase().trim().includes(valLower) ||
              valLower.includes(String(item).toLowerCase().trim())
            );
          }
          const fieldLower = String(field).toLowerCase().trim();
          return fieldLower === valLower || fieldLower.includes(valLower) || valLower.includes(fieldLower);
        };

        const data = tous.filter((e) => {
          if (metierLabel) {
            // e.metier peut être un tableau JSON ["Développeur web", ...] ou une string
            if (!fieldContains(e.metier, metierLabel)) return false;
          } else if (reponseDomaine) {
            // e.mention peut être un tableau JSON ["Informatique", ...] ou une string
            // On cherche aussi dans e.domaine
            const inMention = fieldContains(e.mention, reponseDomaine);
            const inDomaine = fieldContains(e.domaine, reponseDomaine);
            if (!inMention && !inDomaine) return false;
          }
          if (regionLabel) {
            const regionLower = regionLabel.toLowerCase().trim();
            const regionOk = (e.region && e.region.toLowerCase().trim() === regionLower) ||
                             (e.province && e.province.toLowerCase().trim() === regionLower);
            if (!regionOk) return false;
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
      if (filterType !== "Tous" && e.type !== filterType) return false;
      if (filterNiveau !== "Tous") {
        const target = filterNiveau.toLowerCase();
        if (Array.isArray(e.niveau)) {
          if (!e.niveau.some(n => String(n).toLowerCase().includes(target))) return false;
        } else if (!e.niveau || !String(e.niveau).toLowerCase().includes(target)) {
          return false;
        }
      }
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
      className="relative w-full min-h-[100dvh] overflow-hidden font-['Sora'] flex flex-col"
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

      <div className="relative z-10 flex flex-col flex-1 min-h-0 h-full w-full px-4 sm:px-10 pt-4 sm:pt-6 pb-4 overflow-hidden">
        {/* Bouton retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center mb-4 p-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={32} className="sm:hidden" />
          <IoArrowBackCircleOutline size={42} className="hidden sm:block" />
        </button>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin-white pr-1 pb-24 sm:pb-28">
          <div className="mb-6">
            <h1 className="text-[clamp(1.35rem,3vw,2.2rem)] font-black text-white leading-tight tracking-tight mb-1">
              UNIVERSITÉS<br className="sm:hidden" /> & INSTITUTS
            </h1>
            <p className="text-[clamp(0.72rem,0.95vw,0.85rem)] text-white/70 font-medium mb-3 max-w-2xl leading-relaxed">
              Découvrez les établissements d'enseignement supérieur proposant des formations adaptées à votre profil et vos ambitions professionnelles.
            </p>
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
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
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
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 mb-8 lg:mb-6">
            {etablissementsFiltres.length > 0 ? (
              etablissementsFiltres.map((etab, i) => (
                <button
                  key={etab.id || i}
                  type="button"
                  onClick={() => handleSelectEtablissement(etab)}
                  className="group w-full text-left rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background:    "rgba(255,255,255,0.98)",
                    backdropFilter: "blur(4px)",
                    border:        "1px solid rgba(255,255,255,0.7)",
                  }}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{
                          background:
                            etab.type === "Public"
                              ? "linear-gradient(135deg,#1250c8,#28b090)"
                              : "linear-gradient(135deg,#28b090,#a0d820)",
                        }}
                      />
                      <span className="font-bold text-[13px] text-gray-900 leading-tight break-words flex-1">
                        {etab.nom}
                      </span>
                    </div>
                    <FiChevronRight
                      size={14}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: etab.type === "Public" ? "rgba(18,80,200,0.12)" : "rgba(40,176,144,0.12)",
                        color:      etab.type === "Public" ? "#1250c8"              : "#0a6655",
                      }}
                    >
                      {etab.type}
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold flex items-center gap-0.5">
                      <FiMapPin size={8} />
                      {etab.ville || etab.region || etab.province}
                    </span>
                  </div>

                  {etab.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                      {etab.description}
                    </p>
                  )}

                  {etab.mention && (
                    <p className="text-[10px] text-blue-600/70 font-semibold line-clamp-1 border-t border-gray-100 pt-1.5 mt-0.5">
                      {Array.isArray(etab.mention) ? etab.mention.join(", ") : etab.mention}
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
            <HiOutlineHome size={26} className="sm:hidden" />
            <HiOutlineHome size={30} className="hidden sm:block" />
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
