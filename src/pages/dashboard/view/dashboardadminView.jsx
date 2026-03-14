// C:\xampp\htdocs\orientation-scolaire-professionnelle\frontend\src\pages\dashboard\view\dashboardadminView.jsx

import React, { useState, useEffect } from "react";
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
  PiCalendarBlank,
  PiCaretDown,
  PiX,
  PiPencilSimple,
} from "react-icons/pi";
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

const formatDateToFR = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Fonction utilitaire pour extraire les stats de manière robuste
const extractStats = (data) => {
  if (!data) {
    return {
      totalViews: 0,
      trendViews: 0,
      topMetier: null
    };
  }

  console.log("Données brutes reçues:", data);
  console.log("Structure stats:", data.stats);
  console.log("Structure totale:", JSON.stringify(data, null, 2));

  // Essayer différentes structures possibles
  let totalViews = 0;
  let trendViews = 0;
  let topMetier = null;

  // Cas 1: data.stats existe (structure actuelle)
  if (data.stats) {
    totalViews = data.stats.total_views ?? data.stats.totalViews ?? data.stats.views ?? 0;
    trendViews = data.stats.trend_views ?? data.stats.trendViews ?? data.stats.trend ?? 0;
    topMetier = data.stats.top_metier ?? data.stats.topMetier ?? null;
  }
  // Cas 2: data.total_views directement dans la racine
  else if (data.total_views !== undefined || data.totalViews !== undefined) {
    totalViews = data.total_views ?? data.totalViews ?? 0;
    trendViews = data.trend_views ?? data.trendViews ?? data.trend ?? 0;
    topMetier = data.top_metier ?? data.topMetier ?? null;
  }
  // Cas 3: data.views directement
  else if (data.views !== undefined) {
    totalViews = data.views;
    trendViews = data.trend ?? 0;
    topMetier = data.top_metier ?? data.topMetier ?? null;
  }

  console.log("Valeurs extraites:", { totalViews, trendViews, topMetier });

  return {
    totalViews: Number(totalViews) || 0,
    trendViews: Number(trendViews) || 0,
    topMetier: topMetier
  };
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

  const W = 580,
    H = 230;
  const PL = 46,
    PR = 22,
    PT = 22,
    PB = 30;
  const cW = W - PL - PR,
    cH = H - PT - PB;

  // Calcul dynamique des valeurs min et max
  const allValues = pts.map((d) => d.v);
  const minV = 0; // Toujours commencer à 0
  const maxV = allValues.length > 0 ? Math.max(...allValues) : 1000;

  const xP = (i) => PL + (i / (pts.length - 1 || 1)) * cW;
  const yP = (v) => PT + cH - ((v - minV) / (maxV - minV || 1)) * cH;

  // Générer des lignes de grille
  const generateGridLines = (min, max) => {
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
  const gridLines = generateGridLines(minV, maxV);

  const lp = pts
    .map((d, i) => `${i ? "L" : "M"} ${xP(i).toFixed(1)} ${yP(d.v).toFixed(1)}`)
    .join(" ");
  const area =
    pts.length > 0
      ? `${lp} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${
          PT + cH
        } Z`
      : "";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900">
          Croissance des visibilités
        </h3>
        <p className="text-xs text-gray-500">
          Évolution mensuelle des visites sur la plateforme
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="lgLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity=".15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={PL}
              y1={yP(v)}
              x2={W - PR}
              y2={yP(v)}
              className="stroke-gray-100"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={PL - 10}
              y={yP(v) + 4}
              textAnchor="end"
              className="text-[10px] font-medium fill-gray-400"
            >
              {v >= 1000000
                ? `${(v / 1000000).toFixed(1)}M`
                : v >= 1000
                  ? `${(v / 1000).toFixed(1)}k`
                  : v}
            </text>
          </g>
        ))}

        {pts.length > 0 && (
          <>
            <path d={area} fill="url(#lgLine)" />
            <path
              d={lp}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
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
            className="cursor-pointer group"
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
              r={hov === i ? 6 : 4}
              className={`transition-all duration-300 fill-white ${
                hov === i ? "stroke-[3px]" : "stroke-2"
              }`}
              stroke="#3b82f6"
            />
            {hov === i && (
              <g className="animate-in zoom-in-95 duration-200">
                <rect
                  x={xP(i) - 35}
                  y={yP(d.v) - 40}
                  width="70"
                  height="26"
                  rx="6"
                  className="fill-gray-900 shadow-lg"
                />
                <polygon
                  points={`${xP(i) - 6},${yP(d.v) - 14.5} ${
                    xP(i) + 6
                  },${yP(d.v) - 14.5} ${xP(i)},${yP(d.v) - 8}`}
                  className="fill-gray-900"
                />
                <text
                  x={xP(i)}
                  y={yP(d.v) - 23}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-white"
                >
                  {d.v >= 1000000
                    ? `${(d.v / 1000000).toFixed(1)}M`
                    : d.v >= 1000
                      ? `${(d.v / 1000).toFixed(1)}k`
                      : d.v.toLocaleString("fr-FR")}
                </text>
              </g>
            )}
            <text
              x={xP(i)}
              y={H - 5}
              textAnchor="middle"
              className={`text-[11px] font-medium transition-colors ${
                hov === i ? "fill-gray-900 font-bold" : "fill-gray-400"
              }`}
            >
              {d.y}
            </text>
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

  const W = 580,
    H = 230;
  const PL = 42,
    PR = 18,
    PT = 22,
    PB = 34;
  const cW = W - PL - PR,
    cH = H - PT - PB;
  const bW = cW / (mapped.length || 1);
  const max = Math.max(...mapped.map((d) => d.v), 1);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900">
          Activité hebdomadaire
        </h3>
        <p className="text-xs text-gray-500">
          Vues réparties par jour de la semaine
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
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

        {[500, 1000, 1500, 2000, 2500].map((v) => {
          const y = PT + cH - (v / max) * cH;
          return (
            <g key={v}>
              <line
                x1={PL}
                y1={y}
                x2={W - PR}
                y2={y}
                className="stroke-gray-100"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={PL - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-medium fill-gray-400"
              >
                {v >= 1000 ? `${v / 1000}k` : v}
              </text>
            </g>
          );
        })}

        {mapped.map((d, i) => {
          const bH = (d.v / max) * cH;
          const x = PL + i * bW + bW * 0.2;
          const w = bW * 0.6;
          const y = PT + cH - bH;

          return (
            <g
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={PT}
                width={w}
                height={cH}
                rx="6"
                className="fill-gray-50"
              />
              <rect
                x={x}
                y={y}
                width={w}
                height={bH}
                rx="6"
                fill={`url(#bgrad${i})`}
                className="transition-all duration-300"
                opacity={hov !== null && hov !== i ? 0.4 : 1}
              />
              {hov === i && (
                <g className="animate-in zoom-in-95 duration-200">
                  <rect
                    x={x + w / 2 - 36}
                    y={y - 32}
                    width="72"
                    height="24"
                    rx="6"
                    className="fill-gray-900 shadow-lg"
                  />
                  <polygon
                    points={`${x + w / 2 - 6},${y - 8.5} ${x + w / 2 + 6},${
                      y - 8.5
                    } ${x + w / 2},${y - 2}`}
                    className="fill-gray-900"
                  />
                  <text
                    x={x + w / 2}
                    y={y - 16}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-white"
                  >
                    {d.v} vues
                  </text>
                </g>
              )}
              <text
                x={x + w / 2}
                y={H - 6}
                textAnchor="middle"
                className={`text-[11px] font-medium transition-colors ${
                  hov === i ? "fill-gray-900 font-bold" : "fill-gray-400"
                }`}
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

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900">
          Métiers les plus recherchés
        </h3>
        <p className="text-xs text-gray-500">
          Répartition par domaine (tendance du marché)
        </p>
      </div>

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
                className="transition-all duration-300 cursor-pointer stroke-white"
                strokeWidth="3"
                opacity={hov !== null && hov !== i ? 0.3 : 1}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `scale(${hov === i ? 1.04 : 1})`,
                }}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
              />
            ))}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="text-3xl font-extrabold fill-gray-900"
            >
              {total}
            </text>
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              className="text-[11px] font-semibold tracking-wider uppercase fill-gray-400"
            >
              Recherches
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
  const [chart, setChart] = useState("line");
  const [dateFilter, setDateFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [dashData, setDashData] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [error, setError] = useState(null);

  const fetchDash = async () => {
    setLoadingDash(true);
    setError(null);
    try {
      console.log("Fetching dashboard data with filter:", dateFilter);
      const data = await getDashboardData(
        dateFilter,
        dateFilter === "custom" ? customStartDate : null,
        dateFilter === "custom" ? customEndDate : null,
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
  }, [dateFilter, customStartDate, customEndDate]);

  // Extraire les stats de manière robuste
  const stats = extractStats(dashData);

  const visibiliteGrowthData = dashData?.charts?.monthly_visibility ?? 
                               dashData?.monthly_visibility ?? 
                               dashData?.visibility ?? 
                               dashData?.charts?.monthly ?? [];

  const activityData = dashData?.charts?.weekly_activity ?? 
                       dashData?.weekly_activity ?? 
                       dashData?.activity ?? 
                       dashData?.charts?.weekly ?? [];

  const metiersRecherchesData = dashData?.charts?.top_metiers ?? 
                                 dashData?.top_metiers ?? 
                                 dashData?.metiers ?? 
                                 dashData?.charts?.top ?? [];

  // Utiliser les stats extraites
  const totalViews = stats.totalViews;
  const trendViews = stats.trendViews;
  const topMetierAPI = stats.topMetier;

  const statGlobal = {
    label: "Vues totales",
    value: totalViews,
    icon: FaGlobe,
    trend: trendViews,
    trendLabel: "vs semaine dernière",
    accentColor: "#10b981",
    suffix: "visites",
  };

  const topMetier = topMetierAPI;
  const statMetier = {
    label: topMetier ? `Top Métier : ${topMetier.name || topMetier.label || "Métier"}` : "Top Métier : —",
    value: topMetier?.value ?? topMetier?.vues ?? topMetier?.count ?? 0,
    icon: FaBriefcase,
    trend: (() => {
      const trendStr = topMetier?.croissance ?? topMetier?.trend ?? "0%";
      const num = parseInt(trendStr.toString().replace("+", "").replace("%", ""));
      return isNaN(num) ? 0 : num;
    })(),
    trendLabel: "demande en hausse",
    accentColor: "#3b82f6",
    suffix: "recherches",
  };

  const CHART_TABS = [
    { k: "line", I: PiChartLineUp, l: "Visibilité" },
    { k: "bar", I: PiChartBar, l: "Activité" },
    { k: "pie", I: PiChartPieSlice, l: "Métiers" },
  ];

  const handleFilterSelect = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsModalOpen(true);
    } else {
      setDateFilter(val);
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const handleApplyCustomDates = () => {
    setCustomStartDate(tempStartDate);
    setCustomEndDate(tempEndDate);
    setDateFilter("custom");
    setIsModalOpen(false);
  };

  const getCustomLabel = () => {
    if (customStartDate && customEndDate) {
      return `${formatDateToFR(customStartDate)} au ${formatDateToFR(
        customEndDate,
      )}`;
    }
    return "Période personnalisée...";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white font-sans text-gray-900 transition-colors duration-300">
      {/* Modal période personnalisée */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Sélectionner une période
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <PiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date de début
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyCustomDates}
                disabled={!tempStartDate || !tempEndDate}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
              className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualiser les données"
            >
              <FaSync
                className={`w-4 h-4 ${loadingDash ? "animate-spin" : ""}`}
              />
            </button>
            <div className="relative inline-block w-full sm:w-auto group z-10">
              <select
                value={dateFilter}
                onChange={handleFilterSelect}
                className="w-full sm:w-[240px] appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-10 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all cursor-pointer truncate"
              >
                <option value="today">Aujourd'hui</option>
                <option value="7j">7 derniers jours</option>
                <option value="30j">30 derniers jours</option>
                <option value="this_year">Cette année</option>
                <option value="12m">12 derniers mois</option>
                <option value="all">Depuis le début</option>
                <option value="custom" className="font-bold text-blue-600">
                  {dateFilter === "custom"
                    ? getCustomLabel()
                    : "Période personnalisée..."}
                </option>
              </select>
              <PiCalendarBlank className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors pointer-events-none" />
              <PiCaretDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {dateFilter === "custom" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                title="Modifier les dates"
              >
                <PiPencilSimple className="w-4 h-4 font-bold" />
              </button>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCardModerne {...statGlobal} />
          <StatCardModerne {...statMetier} />
        </div>

        {/* Graphiques */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border-b border-gray-100">
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
              {CHART_TABS.map(({ k, I, l }) => (
                <button
                  key={k}
                  onClick={() => setChart(k)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    chart === k
                      ? "bg-blue-50/50 text-blue-600 shadow-sm border border-blue-100/50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <I
                    className={`w-4 h-4 ${chart === k ? "animate-pulse" : ""}`}
                  />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white">
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