import React, { useState, useEffect, useRef } from "react";
import {
  FaGlobe,
  FaArrowUp,
  FaArrowDown,
  FaBriefcase,
  FaSync,
} from "react-icons/fa";
import {
  PiChartLineUp,
  PiChartBar,
  PiChartPieSlice,
} from "react-icons/pi";
import { HiOutlineCalendar } from "react-icons/hi2";
import { getDashboardData } from "../../../services/dashboard.services";

const PIE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

// ─── UTILS ────────────────────────────────────────────────────────────────────

// Fonction utilitaire pour calculer le total des vues à partir des différentes sources
const calculateTotalViews = (data) => {
  if (!data) return 0;

  let total = 0;

  // 1. Essayer d'abord les stats.total_views
  if (data.stats?.total_views) {
    total = data.stats.total_views;
  }
  // 2. Essayer les vues par page
  else if (data.charts?.views_by_page) {
    total = data.charts.views_by_page.reduce((sum, page) => sum + (page.total || 0), 0);
  }
  // 3. Essayer les données d'activité hebdomadaire
  else if (data.charts?.weekly_activity) {
    total = data.charts.weekly_activity.reduce((sum, day) => sum + (day.vues || day.views || 0), 0);
  }
  // 4. Essayer les données de visibilité mensuelle
  else if (data.charts?.monthly_visibility) {
    total = data.charts.monthly_visibility.reduce((sum, month) => sum + (month.visites || month.views || month.value || 0), 0);
  }

  return total;
};

// Fonction utilitaire pour calculer la tendance
const calculateTrend = (data) => {
  if (!data) return 0;
  
  // Essayer d'abord les stats.trend_views
  if (data.stats?.trend_views) {
    return data.stats.trend_views;
  }
  
  return 0;
};

// Fonction utilitaire pour extraire le top métier
const extractTopMetier = (data) => {
  if (!data) return null;

  // 1. Essayer depuis stats.top_metier
  if (data.stats?.top_metier) {
    return data.stats.top_metier;
  }
  
  // 2. Essayer depuis charts.top_metiers
  if (data.charts?.top_metiers && data.charts.top_metiers.length > 0) {
    return data.charts.top_metiers[0];
  }

  // 3. Retourner un objet par défaut
  return {
    name: "—",
    value: 0,
    croissance: "0%"
  };
};

// Fonction pour préparer les données du graphique d'activité hebdomadaire
const prepareWeeklyActivity = (data) => {
  if (!data) return [];
  
  // Si nous avons déjà des données formatées
  if (data.charts?.weekly_activity) {
    return data.charts.weekly_activity;
  }
  
  // Si nous avons des vues par page, on peut les formater
  if (data.charts?.views_by_page) {
    // Grouper par page ou créer des données factices pour l'affichage
    return data.charts.views_by_page.map((item, index) => ({
      day: item.page.split('/').pop() || `Page ${index + 1}`,
      vues: item.total || 0
    }));
  }
  
  return [];
};

// ─── COMPOSANT DATE RANGE PICKER ─────────────────────────────────────────────

const DateRangePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    {
      l: "Tous les résultats",
      f: () => ({ from: null, to: null, label: "Tous les résultats" }),
    },
    {
      l: "Aujourd'hui",
      f: () => {
        const d = new Date().toISOString().slice(0, 10);
        return { from: d, to: d, label: "Aujourd'hui" };
      },
    },
    {
      l: "7 derniers jours",
      f: () => {
        const e = new Date();
        const s = new Date();
        s.setDate(s.getDate() - 7);
        return {
          from: s.toISOString().slice(0, 10),
          to: e.toISOString().slice(0, 10),
          label: "7 derniers jours",
        };
      },
    },
    {
      l: "30 derniers jours",
      f: () => {
        const e = new Date();
        const s = new Date();
        s.setDate(s.getDate() - 30);
        return {
          from: s.toISOString().slice(0, 10),
          to: e.toISOString().slice(0, 10),
          label: "30 derniers jours",
        };
      },
    },
    {
      l: "Cette année",
      f: () => {
        const year = new Date().getFullYear();
        return { from: `${year}-01-01`, to: `${year}-12-31`, label: "Cette année" };
      },
    },
    {
      l: "12 derniers mois",
      f: () => {
        const e = new Date();
        const s = new Date();
        s.setFullYear(s.getFullYear() - 1);
        return {
          from: s.toISOString().slice(0, 10),
          to: e.toISOString().slice(0, 10),
          label: "12 derniers mois",
        };
      },
    },
    {
      l: "Depuis le début",
      f: () => ({ from: "2000-01-01", to: null, label: "Depuis le début" }),
    },
  ];

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-all bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-blue-500" />
        {value.label || "Période"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5l3 3 3-3"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[220px] p-1.5 rounded-xl shadow-xl animate-in fade-in duration-150 bg-white border border-gray-200"
        >
          {presets.map((p) => (
            <button
              key={p.l}
              onClick={() => {
                onChange(p.f());
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              style={{
                background:
                  value.label === p.l ? "rgba(59,130,246,0.12)" : "transparent",
                color:
                  value.label === p.l ? "#3b82f6" : "#334155",
              }}
            >
              {p.l}
              {value.label === p.l && (
                <span className="float-right text-blue-500">✓</span>
              )}
            </button>
          ))}

          <div className="mx-1.5 my-1 pt-1.5 border-t border-gray-200">
            <div className="flex gap-1">
              <input
                type="date"
                value={value.from || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    from: e.target.value,
                    to: value.to,
                    label: "Personnalisé",
                  })
                }
                className="flex-1 px-1.5 py-1 rounded-md text-xs border border-gray-200"
              />
              <input
                type="date"
                value={value.to || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    from: value.from,
                    to: e.target.value,
                    label: "Personnalisé",
                  })
                }
                className="flex-1 px-1.5 py-1 rounded-md text-xs border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STAT CARD MODERNE ────────────────────────────────────────────────────────

function StatCardModerne({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accentColor,
  suffix = "visites",
}) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  // S'assurer que value est un nombre et formater correctement
  const displayValue = (() => {
    const num = Number(value);
    return isNaN(num) ? 0 : num.toLocaleString("fr-FR");
  })();

  return (
    <div className="relative w-full p-6 overflow-hidden transition-all duration-300 bg-white border shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] rounded-2xl border-gray-100 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] group">
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl rounded-bl-full transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {label}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isNeutral
                  ? "bg-gray-50 text-gray-600"
                  : isPositive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
              }`}
            >
              {isNeutral ? "Stable" : isPositive ? "En hausse" : "En baisse"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {displayValue}
            </span>
            <span className="text-sm font-medium text-gray-400">{suffix}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                isNeutral
                  ? "bg-gray-50/50 border-gray-100"
                  : isPositive
                    ? "bg-emerald-50/50 border-emerald-100"
                    : "bg-rose-50/50 border-rose-100"
              }`}
            >
              {isNeutral ? (
                <span className="w-3 h-3 flex items-center justify-center">
                  —
                </span>
              ) : isPositive ? (
                <FaArrowUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <FaArrowDown className="w-3 h-3 text-rose-500" />
              )}
              <span
                className={`text-sm font-bold ${
                  isNeutral
                    ? "text-gray-600"
                    : isPositive
                      ? "text-emerald-600"
                      : "text-rose-600"
                }`}
              >
                {isNeutral ? "0%" : Math.abs(trend) + "%"}
              </span>
              <span className="text-xs text-gray-500">{trendLabel}</span>
            </div>
          </div>
        </div>

        <div className="relative p-0.5 rounded-xl bg-gray-50 shadow-inner">
          <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white border border-gray-100">
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-1 mt-6 h-6">
        {[30, 45, 38, 52, 48, 65, 78].map((h, i) => (
          <div key={i} className="flex-1 flex items-end h-full">
            <div
              className={`w-full rounded-t-sm transition-all duration-500 ${
                i > 4 ? "opacity-100" : "opacity-20"
              }`}
              style={{
                height: `${h}%`,
                background: i > 4 ? accentColor : "#94a3b8",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COURBE SVG ───────────────────────────────────────────────────────────────

function LineChartSVG({ data }) {
  const [hov, setHov] = useState(null);
  
  // S'assurer que les données sont valides
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Aucune donnée disponible pour le graphique</p>
      </div>
    );
  }

  const pts = data.map((d) => ({ 
    y: d.month || d.mois || d.label || `Mois ${d.index || ''}`, 
    v: d.visites || d.views || d.vues || d.value || 0 
  }));

  const W = 700;
  const H = 260;
  const PL = 48;
  const PR = 20;
  const PT = 30;
  const PB = 42;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  // Calcul dynamique des valeurs min et max
  const allValues = pts.map((d) => d.v);
  const maxV = allValues.length > 0 ? Math.max(...allValues) : 1000;

  const xP = (i) => PL + (i / (pts.length - 1 || 1)) * cW;
  const yP = (v) => PT + cH - (v / maxV) * cH;

  // Générer des lignes de grille
  const generateGridLines = (max) => {
    if (max <= 0) return [];

    const numLines = 4;
    const step = Math.max(1, Math.ceil(max / numLines));

    const lines = [];
    for (let i = 1; i <= numLines; i++) {
      const value = i * step;
      if (value < max) {
        lines.push(value);
      } else {
        break;
      }
    }

    return lines;
  };
  const gridLines = generateGridLines(maxV);

  const lp = pts
    .map((d, i) => `${i ? "L" : "M"} ${xP(i).toFixed(1)} ${yP(d.v).toFixed(1)}`)
    .join(" ");
  const area =
    pts.length > 0
      ? `${lp} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${
          PT + cH
        } Z`
      : "";

  const gridColor = "#e2e8f0";
  const axisColor = "#64748b";
  const labelColor = "#1e293b";

  return (
    <div>
      <p className="text-xs font-bold mb-1" style={{ color: labelColor }}>
        Évolution mensuelle des visites
      </p>
      <p className="text-[11px] mb-3" style={{ color: axisColor }}>
        Janvier à décembre · nombre de visites sur la plateforme
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="lgLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity=".15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={PL}
              y1={yP(v)}
              x2={W - PR}
              y2={yP(v)}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={PL - 8}
              y={yP(v) + 4}
              textAnchor="end"
              fontSize="10"
              fill={axisColor}
              fontWeight="600"
            >
              {v >= 1000000
                ? `${(v / 1000000).toFixed(1)}M`
                : v >= 1000
                  ? `${(v / 1000).toFixed(1)}k`
                  : v}
            </text>
          </g>
        ))}

        {/* Légendes mois */}
        {pts.map((d, i) => (
          <text
            key={i}
            x={xP(i)}
            y={H - 12}
            textAnchor="middle"
            fontSize="10"
            fill={axisColor}
            fontWeight="600"
          >
            {d.y}
          </text>
        ))}

        {pts.length > 0 && (
          <>
            <path d={area} fill="url(#lgLine)" />
            <path
              d={lp}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {pts.map((d, i) => (
          <g
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            className="cursor-pointer"
          >
            <line
              x1={xP(i)}
              y1={PT}
              x2={xP(i)}
              y2={PT + cH}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="4 4"
              className={`transition-opacity duration-300 ${
                hov === i ? "opacity-30" : "opacity-0"
              }`}
            />
            <circle
              cx={xP(i)}
              cy={yP(d.v)}
              r={hov === i ? 5 : 4}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="2"
            />
            {hov === i && (
              <>
                <rect
                  x={Math.max(10, xP(i) - 35)}
                  y={8}
                  width="70"
                  height="22"
                  rx="6"
                  fill="#1e293b"
                />
                <text
                  x={xP(i)}
                  y={22}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#fff"
                >
                  {d.v >= 1000000
                    ? `${(d.v / 1000000).toFixed(1)}M`
                    : d.v >= 1000
                      ? `${(d.v / 1000).toFixed(1)}k`
                      : d.v.toLocaleString("fr-FR")}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── BARRES SVG ───────────────────────────────────────────────────────────────

function BarChartSVG({ data }) {
  const [hov, setHov] = useState(null);
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Aucune donnée disponible pour le graphique</p>
      </div>
    );
  }

  const mapped = data.map((d, i) => ({
    r: d.day || d.jour || d.label || `Jour ${d.index || ''}`,
    v: d.vues || d.views || d.value || 0,
    c: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const W = 700;
  const H = 260;
  const PL = 42;
  const PR = 18;
  const PT = 32;
  const PB = 58;
  const cW = W - PL - PR;
  const cH = H - PT - PB;
  const groupW = cW / Math.max(mapped.length, 1);
  const max = Math.max(...mapped.map((d) => d.v), 1);
  
  const gridColor = "#e2e8f0";
  const axisColor = "#64748b";
  const labelColor = "#1e293b";

  return (
    <div>
      <p className="text-xs font-bold mb-1" style={{ color: labelColor }}>
        Activité hebdomadaire
      </p>
      <p className="text-[11px] mb-3" style={{ color: axisColor }}>
        Vues réparties par jour de la semaine
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          {mapped.map((d, i) => (
            <linearGradient
              key={i}
              id={`bgrad${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={d.c} />
              <stop offset="100%" stopColor={d.c} stopOpacity=".6" />
            </linearGradient>
          ))}
        </defs>

        {/* Grille horizontale */}
        {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = Math.round(max * ratio);
          const yy = PT + cH - ratio * cH;
          return (
            <g key={idx}>
              <line
                x1={PL}
                y1={yy}
                x2={W - PR}
                y2={yy}
                stroke={gridColor}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={PL - 6}
                y={yy + 4}
                textAnchor="end"
                fontSize="9"
                fill={axisColor}
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </text>
            </g>
          );
        })}

        {mapped.map((d, i) => {
          const bW = groupW * 0.5; // Largeur des barres
          const x = PL + i * groupW + (groupW - bW) / 2;
          const bH = (d.v / max) * cH;
          const y = PT + cH - bH;
          const active = hov === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={bW}
                height={bH}
                rx="6"
                fill={`url(#bgrad${i})`}
                opacity={hov !== null && !active ? 0.35 : 1}
              />
              {active && (
                <>
                  <rect
                    x={x + bW / 2 - 26}
                    y={Math.max(6, y - 28)}
                    width="52"
                    height="20"
                    rx="6"
                    fill="#1e293b"
                  />
                  <text
                    x={x + bW / 2}
                    y={Math.max(19, y - 15)}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {d.v}
                  </text>
                </>
              )}
              <text
                x={x + bW / 2}
                y={H - 14}
                textAnchor="middle"
                fontSize="8.5"
                fill={axisColor}
                fontWeight="700"
              >
                {d.r}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── DONUT SVG ────────────────────────────────────────────────────────────────

function DonutChartSVG({ data }) {
  const [hov, setHov] = useState(null);
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Aucune donnée disponible pour le graphique</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + (d.value || d.vues || d.count || 0), 0) || 0;

  const cx = 120,
    cy = 120,
    R = 100,
    r = 65;

  const slices = data.reduce((acc, d, i) => {
    const startAngle =
      acc.length === 0 ? -Math.PI / 2 : acc[acc.length - 1].endAngle;
    const a = total > 0 ? ((d.value || d.vues || d.count || 0) / total) * 2 * Math.PI : 0;
    const endAngle = startAngle + a;

    const x1 = cx + R * Math.cos(startAngle),
      y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle),
      y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + r * Math.cos(startAngle),
      iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(endAngle),
      iy2 = cy + r * Math.sin(endAngle);
    const lg = a > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;

    acc.push({ 
      ...d, 
      path, 
      color: PIE_COLORS[i % PIE_COLORS.length], 
      endAngle,
      name: d.name || d.label || d.nom || `Métier ${i + 1}`,
      value: d.value || d.vues || d.count || 0,
      croissance: d.croissance || d.trend || d.growth || "+0%"
    });
    return acc;
  }, []);

  const axisColor = "#64748b";
  const labelColor = "#1e293b";

  return (
    <div>
      <p className="text-xs font-bold mb-1" style={{ color: labelColor }}>
        Métiers les plus recherchés
      </p>
      <p className="text-[11px] mb-3" style={{ color: axisColor }}>
        Répartition par domaine (tendance du marché)
      </p>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="relative flex-shrink-0 mx-auto md:mx-0">
          <svg
            viewBox="0 0 240 240"
            className="w-[200px] h-[200px] overflow-visible"
          >
            {slices.map((s, i) => (
              <path
                key={i}
                d={s.path}
                fill={s.color}
                className="transition-all duration-300 cursor-pointer"
                strokeWidth="3"
                stroke="#fff"
                opacity={hov !== null && hov !== i ? 0.3 : 1}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `scale(${hov === i ? 1.04 : 1})`,
                }}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
              />
            ))}
            <circle cx={cx} cy={cy} r="46" fill="#fff" />
            <text
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              fontSize="26"
              fontWeight="900"
              fill={hov !== null ? slices[hov].color : labelColor}
            >
              {hov !== null ? slices[hov].value : total}
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fontSize="9.5"
              fill={axisColor}
            >
              {hov !== null ? slices[hov].name : "recherches"}
            </text>
          </svg>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {slices.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-default ${
                hov === i
                  ? "bg-white shadow-md border-transparent scale-[1.02]"
                  : "bg-white border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-transform ${
                    hov === i ? "scale-125 shadow-sm" : ""
                  }`}
                  style={{ backgroundColor: s.color }}
                />
                <span
                  className={`text-xs font-medium truncate ${
                    hov === i ? "text-gray-900" : "text-gray-500"
                  }`}
                  title={s.name}
                >
                  {s.name}
                </span>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 pl-2">
                <span className="text-sm font-bold text-gray-900">
                  {s.value}
                </span>
                <span className="text-[10px] font-bold text-emerald-500">
                  {s.croissance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

const DashboardAdminView = () => {
  const [chart, setChart] = useState("bar"); // Mettre "bar" par défaut car il y a des données
  const [dateRange, setDateRange] = useState({
    label: "Depuis le début",
    from: "2000-01-01",
    to: null,
  });

  const [dashData, setDashData] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [error, setError] = useState(null);

  const fetchDash = async () => {
    setLoadingDash(true);
    setError(null);
    try {
      console.log("Fetching dashboard data with filter:", dateRange);
      
      // Convertir le format dateRange vers le format attendu par l'API
      const filter = dateRange.label === "Tous les résultats" ? "all" : 
                     dateRange.label === "Aujourd'hui" ? "today" :
                     dateRange.label === "7 derniers jours" ? "7j" :
                     dateRange.label === "30 derniers jours" ? "30j" :
                     dateRange.label === "Cette année" ? "this_year" :
                     dateRange.label === "12 derniers mois" ? "12m" :
                     dateRange.label === "Depuis le début" ? "all" :
                     dateRange.label === "Personnalisé" ? "custom" : "all";
      
      const data = await getDashboardData(
        filter,
        dateRange.from,
        dateRange.to,
      );
      
      console.log("Données reçues de l'API:", data);
      
      setDashData(data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError(error.message || "Erreur de chargement");
      setDashData(null);
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    fetchDash();
  }, [dateRange]);

  // Calculer les statistiques
  const totalViews = calculateTotalViews(dashData);
  const trendViews = calculateTrend(dashData);
  const topMetier = extractTopMetier(dashData);

  // Préparer les données des graphiques
  const visibiliteGrowthData = dashData?.charts?.monthly_visibility ?? [];
  const activityData = prepareWeeklyActivity(dashData);
  const metiersRecherchesData = dashData?.charts?.top_metiers ?? [];

  console.log("Statistiques calculées:", { totalViews, trendViews, topMetier });
  console.log("Données activité:", activityData);

  const statGlobal = {
    label: "Vues totales",
    value: totalViews,
    icon: FaGlobe,
    trend: trendViews,
    trendLabel: "vs période précédente",
    accentColor: "#10b981",
    suffix: "visites",
  };

  const statMetier = {
    label: topMetier?.name ? `Top Métier : ${topMetier.name}` : "Top Métier : —",
    value: topMetier?.value ?? 0,
    icon: FaBriefcase,
    trend: (() => {
      const trendStr = topMetier?.croissance ?? "0%";
      const num = parseInt(trendStr.toString().replace("+", "").replace("%", ""));
      return isNaN(num) ? 0 : num;
    })(),
    trendLabel: "demande en hausse",
    accentColor: "#3b82f6",
    suffix: "recherches",
  };

  const CHART_TABS = [
    { key: "line", icon: PiChartLineUp, label: "Visibilité" },
    { key: "bar", icon: PiChartBar, label: "Activité" },
    { key: "pie", icon: PiChartPieSlice, label: "Métiers" },
  ];

  return (
    <div className="min-h-screen p-0 bg-white font-sans text-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Vue d'ensemble
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Suivez les performances globales de la plateforme d'éducation.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-500">
                Erreur: {error}
              </p>
            )}
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDash}
              disabled={loadingDash}
              className="px-3 sm:px-4 py-2 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualiser les données"
            >
              <FaSync
                className={`w-4 h-4 ${loadingDash ? "animate-spin" : ""}`}
              />
            </button>
            
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCardModerne {...statGlobal} />
          <StatCardModerne {...statMetier} />
        </div>

        {/* Graphiques */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50/50 text-blue-600">
                <PiChartLineUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Analyses approfondies
                </h2>
                <p className="text-xs text-gray-500">
                  Visualisez les tendances et performances
                </p>
              </div>
            </div>

            <div className="flex p-1 bg-white border border-gray-100 shadow-sm rounded-xl">
              {CHART_TABS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setChart(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    chart === key
                      ? "bg-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${chart === key ? "animate-pulse" : ""}`}
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white">
            <div className="mx-auto max-w-4xl">
              {loadingDash && (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Chargement des données...</span>
                  </div>
                </div>
              )}
              {!loadingDash && (
                <>
                  {chart === "line" && visibiliteGrowthData.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Aucune donnée de visibilité disponible pour cette période.
                    </p>
                  )}
                  {chart === "line" && visibiliteGrowthData.length > 0 && (
                    <LineChartSVG data={visibiliteGrowthData} />
                  )}
                  {chart === "bar" && activityData.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Aucune donnée d'activité disponible pour cette période.
                    </p>
                  )}
                  {chart === "bar" && activityData.length > 0 && (
                    <BarChartSVG data={activityData} />
                  )}
                  {chart === "pie" && metiersRecherchesData.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Aucune recherche de métier disponible pour cette période.
                    </p>
                  )}
                  {chart === "pie" && metiersRecherchesData.length > 0 && (
                    <DonutChartSVG data={metiersRecherchesData} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminView;