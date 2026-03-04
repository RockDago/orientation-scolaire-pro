import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { IoArrowBackCircleOutline } from "react-icons/io5";

// ─── Régions par métier ───────────────────────────────────────────────────────
const REGIONS_PAR_METIER = {
  "architecte":       ["analamanga", "haute-matsiatra", "atsinanana", "boeny"],
  "avocat":           ["analamanga", "boeny", "atsinanana", "diana"],
  "data-analyst":     ["analamanga", "haute-matsiatra", "atsinanana", "vakinankaratra"],
  "designer":         ["analamanga", "atsinanana", "diana"],
  "infirmier":        ["analamanga", "boeny", "atsinanana", "haute-matsiatra", "vakinankaratra", "sofia"],
  "ingenieur-civil":  ["analamanga", "haute-matsiatra", "atsinanana", "vakinankaratra"],
  "ingenieur-info":   ["analamanga", "haute-matsiatra", "atsinanana", "boeny", "diana", "vakinankaratra"],
  "marketing":        ["analamanga", "atsinanana", "boeny", "diana"],
  "medecin":          ["analamanga", "boeny", "atsinanana", "haute-matsiatra", "vakinankaratra"],
  "pilote":           ["analamanga"],
  "pharmacien":       ["analamanga", "boeny", "atsinanana"],
  "technicien-aero":  ["analamanga", "atsinanana"],
};

const ETABLISSEMENTS_PAR_REGION = {
  diana: 4, sava: 2, sofia: 3, boeny: 8,
  analanjirofo: 2, betsiboka: 1, "alaotra-mangoro": 3, melaky: 1,
  bongolava: 2, itasy: 2, analamanga: 48, atsinanana: 7,
  menabe: 2, vakinankaratra: 6, "amoron-i-mania": 2, vatovavy: 1,
  "haute-matsiatra": 5, fitovinany: 1, ihorombe: 1, "atsimo-atsinanana": 1,
  "atsimo-andrefana": 3, androy: 1, anosy: 2,
};

const REGION_LABELS = {
  diana: "Diana", sava: "Sava", sofia: "Sofia", boeny: "Boeny",
  analanjirofo: "Analanjirofo", betsiboka: "Betsiboka",
  "alaotra-mangoro": "Alaotra Mangoro", melaky: "Melaky",
  bongolava: "Bongolava", itasy: "Itasy", analamanga: "Analamanga",
  atsinanana: "Atsinanana", menabe: "Menabe", vakinankaratra: "Vakinankaratra",
  "amoron-i-mania": "Amoron'i Mania", vatovavy: "Vatovavy",
  "haute-matsiatra": "Haute Matsiatra", fitovinany: "Fitovinany",
  ihorombe: "Ihorombe", "atsimo-atsinanana": "Atsimo-Atsinanana",
  "atsimo-andrefana": "Atsimo-Andrefana", androy: "Androy", anosy: "Anosy",
};

const NAME_TO_ID = {
  Diana: "diana", Sava: "sava", Sofia: "sofia", Boeny: "boeny",
  Analanjirofo: "analanjirofo", Betsiboka: "betsiboka",
  "Alaotra Mangoro": "alaotra-mangoro", "Alaotra-Mangoro": "alaotra-mangoro",
  Melaky: "melaky", Bongolava: "bongolava", Itasy: "itasy",
  Analamanga: "analamanga", Atsinanana: "atsinanana", Menabe: "menabe",
  Vakinankaratra: "vakinankaratra", "Amoron'i Mania": "amoron-i-mania",
  "Amoron I Mania": "amoron-i-mania", Vatovavy: "vatovavy",
  "Vatovavy-Fitovinany": "vatovavy", "Haute Matsiatra": "haute-matsiatra",
  "Haute-Matsiatra": "haute-matsiatra", Fitovinany: "fitovinany",
  Ihorombe: "ihorombe", "Atsimo-Atsinanana": "atsimo-atsinanana",
  "Atsimo Atsinanana": "atsimo-atsinanana", "Atsimo-Andrefana": "atsimo-andrefana",
  "Atsimo Andrefana": "atsimo-andrefana", Androy: "androy", Anosy: "anosy",
};

const GEOJSON_URLS = [
  "https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/CGAZ/MDG/ADM1/geoBoundaries-MDG-ADM1.geojson",
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson",
];

// ─── Palette couleurs ─────────────────────────────────────────────────────────
const C = {
  // Régions actives → Bleu azur (rgb 21, 95, 170)
  active:        { fill: "#155faa", stroke: "#0e3d7a", weight: 1.8 },
  // Survol région active → bleu azur plus clair
  activeHover:   { fill: "#2979c8", stroke: "#1a5299", weight: 2.2 },
  // Régions inactives → gris-bleu clair
  inactive:      { fill: "#dde8f5", stroke: "#90b8d8", weight: 1.2 },
  // Survol région inactive
  inactiveHover: { fill: "#c5d8ee", stroke: "#6ea4cc", weight: 1.5 },
};

function buildStyle(id, isHovered, activeRegions) {
  const isActive = activeRegions.includes(id);
  const s = isActive
    ? (isHovered ? C.activeHover   : C.active)
    : (isHovered ? C.inactiveHover : C.inactive);
  return {
    fillColor:   s.fill,
    fillOpacity: 1,
    color:       s.stroke,
    weight:      s.weight,
    opacity:     1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Section5({ metier, onRetour, onSelectRegion }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const mapRef        = useRef(null);
  const leafletMapRef = useRef(null);
  const layersRef     = useRef({});
  const activeRef     = useRef([]);

  const activeRegions = metier?.id ? (REGIONS_PAR_METIER[metier.id] || []) : [];
  useEffect(() => { activeRef.current = activeRegions; }, [activeRegions.join(",")]);

  const applyAllStyles = () => {
    Object.entries(layersRef.current).forEach(([id, layer]) => {
      layer.setStyle(buildStyle(id, false, activeRef.current));
    });
  };

  // ── Init Leaflet ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) return resolve(window.L);
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => resolve(window.L);
      document.head.appendChild(s);
    });

    const initMap = async () => {
      const L = await loadLeaflet();
      if (!mapRef.current || leafletMapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [-20, 46.8], zoom: 5, zoomControl: false,
        attributionControl: false, dragging: true,
        scrollWheelZoom: true, doubleClickZoom: true, touchZoom: true,
        renderer: L.svg({ padding: 0.5 }),
      });
      leafletMapRef.current = map;
      let loaded = false;

      for (const url of GEOJSON_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          let features = data.features || [];
          const hasMG = features.some(
            f => f.properties?.admin === "Madagascar" ||
                 f.properties?.iso_a2 === "MG" ||
                 f.properties?.adm0_a3 === "MDG"
          );
          if (hasMG)
            features = features.filter(
              f => f.properties?.admin === "Madagascar" ||
                   f.properties?.iso_a2 === "MG" ||
                   f.properties?.adm0_a3 === "MDG"
            );
          if (features.length === 0) continue;

          const geoLayer = L.geoJSON({ type: "FeatureCollection", features }, {
            style: (feature) => {
              const props = feature.properties || {};
              const name  = props.shapeName || props.name || props.NAME_1 || props.ADM1_EN || "";
              const id    = NAME_TO_ID[name] || name.toLowerCase().replace(/[''\s]+/g, "-").replace(/--+/g, "-");
              return buildStyle(id, false, activeRef.current);
            },
            onEachFeature: (feature, layer) => {
              const props   = feature.properties || {};
              const name    = props.shapeName || props.name || props.NAME_1 || props.ADM1_EN || "";
              const id      = NAME_TO_ID[name] || name.toLowerCase().replace(/[''\s]+/g, "-").replace(/--+/g, "-");
              layersRef.current[id] = layer;

              const label    = REGION_LABELS[id] || name;
              const isActive = activeRef.current.includes(id);
              const count    = ETABLISSEMENTS_PAR_REGION[id] || 0;

              layer.bindTooltip(
                `<div style="font-family:'Sora',sans-serif;font-size:12px;font-weight:700;padding:4px 10px;line-height:1.6">
                  <span style="color:#ffffff">${label}</span>
                  ${isActive
                    ? `<br/><span style="font-size:10px;font-weight:600;color:#a3c8f0">${count} établissement${count > 1 ? "s" : ""}</span>`
                    : ""}
                </div>`,
                { sticky: true, direction: "top", offset: [0, -4] }
              );

              layer.on("click", () => {
                if (!activeRef.current.includes(id)) return;
                onSelectRegion?.(id);
              });

              layer.on("mouseover", () => {
                layer.setStyle(buildStyle(id, true, activeRef.current));
                const el = layer.getElement?.();
                if (el) el.style.cursor = activeRef.current.includes(id) ? "pointer" : "default";
              });

              layer.on("mouseout", () => {
                layer.setStyle(buildStyle(id, false, activeRef.current));
              });
            },
          }).addTo(map);

          map.fitBounds(geoLayer.getBounds(), { padding: [60, 60], maxZoom: 8 });
          loaded = true;
          setLoading(false);
          break;
        } catch (e) {
          console.warn("GeoJSON failed:", url, e);
        }
      }

      if (!loaded) {
        setError("Impossible de charger la carte.\nVérifiez votre connexion.");
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        layersRef.current = {};
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMapRef.current) applyAllStyles();
  }, [activeRegions.join(",")]);

  const zoomIn  = () => leafletMapRef.current?.zoomIn();
  const zoomOut = () => leafletMapRef.current?.zoomOut();

  const metierLabel = metier?.label || "ce parcours";
  const activeCount = activeRegions.length;

  return (
    <div className="relative w-full h-screen overflow-hidden font-['Sora']">
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── Fond dégradé ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0d47c4] via-[#1a7ec0] via-[#1ea8a8] via-[#60c030] to-[#9ed820]" />

      {/* ── Déco cercles ── */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none z-[1]" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-blue-500/20 pointer-events-none z-[1]" />

      {/* ── Silhouette ville bas ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2] opacity-10">
        <svg width="100%" height="90" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="8"   y="45" width="28" height="45" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="42"  y="26" width="38" height="64" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="50"  y="14" width="22" height="12" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="86"  y="34" width="26" height="56" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="118" y="18" width="48" height="72" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="130" y="6"  width="24" height="12" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="172" y="30" width="34" height="60" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="212" y="44" width="26" height="46" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="244" y="28" width="40" height="62" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="290" y="40" width="28" height="50" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="324" y="50" width="22" height="40" stroke="white" strokeWidth="1.2" fill="none"/>
          <rect x="352" y="36" width="36" height="54" stroke="white" strokeWidth="1.2" fill="none"/>
        </svg>
      </div>

      {/* ── Carte Leaflet (plein écran) ── */}
      <div className="absolute inset-0 z-10">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* ── Bouton Retour ── */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onRetour}
            className="text-white/85 hover:text-white transition-colors drop-shadow-lg"
            aria-label="Retour"
          >
            <IoArrowBackCircleOutline size={46} />
          </button>
        </div>
      </div>

      {/* ── Panneau info gauche ── */}
      <div className="absolute top-[82px] left-5 z-20 pointer-events-none max-w-[190px]">
        <h1 className="text-4xl lg:text-5xl font-black text-white leading-none drop-shadow-md">Régions</h1>
        <p className="text-xs text-white/80 font-semibold mt-1.5 leading-snug line-clamp-2 drop-shadow">
          {metierLabel}
        </p>

        {/* Légende (2 entrées seulement) */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-sm shrink-0 shadow-sm"
              style={{ background: C.active.fill, border: `1.5px solid ${C.active.stroke}` }}
            />
            <span className="text-[11px] text-white font-bold drop-shadow">
              {activeCount} région{activeCount > 1 ? "s" : ""} disponible{activeCount > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-sm shrink-0"
              style={{ background: C.inactive.fill, border: `1.5px solid ${C.inactive.stroke}` }}
            />
            <span className="text-[11px] text-white/65 font-medium">Non disponible</span>
          </div>
        </div>

        <p className="text-[11px] text-white/55 mt-3 leading-relaxed">
          Cliquez sur une<br />région bleue pour voir<br />les établissements
        </p>
      </div>

      {/* ── Zoom ── */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-3">
          <button
            onClick={zoomIn}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm text-white shadow-lg"
            aria-label="Zoom in"
          >
            <HiOutlineZoomIn size={22} />
          </button>
          <button
            onClick={zoomOut}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm text-white shadow-lg"
            aria-label="Zoom out"
          >
            <HiOutlineZoomOut size={22} />
          </button>
        </div>
      </div>

      {/* ── Home ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => navigate("/acceuil/orientation")}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm text-white shadow-lg"
            aria-label="Accueil"
          >
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {(loading || error) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/25 backdrop-blur-sm">
          {loading && (
            <>
              <div className="w-9 h-9 border-[3px] border-white/20 border-t-white rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-white">Chargement de la carte…</p>
            </>
          )}
          {error && !loading && (
            <p className="text-sm font-semibold text-red-200 text-center bg-black/40 px-5 py-3 rounded-2xl whitespace-pre-line">
              {error}
            </p>
          )}
        </div>
      )}

      <style>{`
        .leaflet-container {
          background: transparent !important;
          font-family: 'Sora', sans-serif !important;
        }
        .leaflet-pane,
        .leaflet-overlay-pane,
        .leaflet-map-pane,
        .leaflet-tile-pane {
          background: transparent !important;
        }
        .leaflet-control-attribution { display: none !important; }

        .leaflet-overlay-pane svg  { shape-rendering: geometricPrecision !important; }
        .leaflet-overlay-pane path {
          shape-rendering: geometricPrecision !important;
          vector-effect: non-scaling-stroke !important;
          outline: none !important;
        }
        /* Supprime le rectangle de sélection au clic */
        .leaflet-overlay-pane path:focus,
        .leaflet-interactive:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* Tooltip */
        .leaflet-tooltip {
          background: rgba(8, 20, 60, 0.90) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
          color: white !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.35) !important;
          border-radius: 10px !important;
          padding: 2px 0 !important;
        }
        .leaflet-tooltip::before { display: none !important; }
      `}</style>
    </div>
  );
}
