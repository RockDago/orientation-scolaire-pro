import React, { useEffect, useRef, useState, useCallback } from "react";
import Chart from "chart.js/auto";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Calendar,
  BarChart2,
  Clock,
  Search,
  Globe,
  Briefcase,
  TrendingUp,
  Activity,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { getDashboardData } from "../../../services/dashboard.services";
import Button from "../../../components/ui/boutton";

// Couleurs graphiques
const chartColors = [
  { border: "#3b82f6", background: "rgba(59,130,246,0.1)" },
  { border: "#10b981", background: "rgba(16,185,129,0.1)" },
  { border: "#f59e0b", background: "rgba(245,158,11,0.1)" },
  { border: "#ef4444", background: "rgba(239,68,68,0.1)" },
  { border: "#8b5cf6", background: "rgba(139,92,246,0.1)" },
  { border: "#06b6d4", background: "rgba(6,182,212,0.1)" },
];

const pieColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#94a3b8",
  "#64748b",
];

// Composants UI locaux (car PageLoader est manquant)
const SimpleLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Chargement...</p>
  </div>
);

const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onClick,
  isActive,
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all duration-200 
      ${
        isActive
          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/30"
          : "border-slate-100 hover:shadow-md hover:border-slate-200"
      }`}
  >
    <div className="flex justify-between items-start">
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-wider truncate ${
            isActive ? "text-blue-700" : "text-slate-400"
          }`}
        >
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 truncate">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      <div
        className="p-2 flex-shrink-0 ml-2 flex items-center justify-center"
      >
        {(() => {
          if (React.isValidElement(icon)) return icon;
          const IconComponent = icon;
          if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
             try {
               return <IconComponent size={24} className={color.replace('bg-', 'text-')} />;
             } catch (e) {
               return <span className="text-xl">{String(icon)}</span>;
             }
          }
          return <span className="text-xl">{icon}</span>;
        })()}
      </div>
    </div>
  </div>
);

// Format date pour input type="date"
const formatDateForInput = (date) => {
  return date.toISOString().split("T")[0];
};

export default function DashboardAdminView() {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [customFilter, setCustomFilter] = useState({
    startDate: "2000-01-01",
    endDate: formatDateForInput(new Date()),
    label: "Depuis le début",
    period: "all"
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("presets");

  const fetchDash = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardData(
        customFilter.period,
        customFilter.startDate,
        customFilter.endDate
      );
      setDashData(data);
    } catch (err) {
      console.error("Erreur dashboard:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDash();
  }, [customFilter]);

  useEffect(() => {
    if (dashData && !loading) {
      initializeCharts();
    }
    return () => destroyCharts();
  }, [dashData, loading]);

  const destroyCharts = () => {
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();
  };

  const initializeCharts = () => {
    destroyCharts();
    
    // Create a color map for métiers to keep them consistent across charts
    const colorMap = {};
    if (dashData?.charts?.top_metiers) {
      dashData.charts.top_metiers.forEach((m, i) => {
        colorMap[m.name || m.label] = pieColors[i % pieColors.length];
      });
    }

    initLineChart();
    initBarChart(colorMap);
    initPieChart(colorMap);
  };

  const initLineChart = () => {
    if (!lineChartRef.current || !dashData?.charts?.monthly_visibility) return;
    const ctx = lineChartRef.current.getContext("2d");
    const data = dashData.charts.monthly_visibility;
    lineChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map(d => d.month || d.mois || d.label),
        datasets: [{
          label: "Nombre de vues",
          data: data.map(d => d.visites || d.views || 0),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { 
            beginAtZero: true, 
            grid: { borderDash: [2, 4] }, 
            ticks: { 
              font: { size: 10 },
              precision: 0,
              callback: (value) => Math.floor(value) === value ? value : null
            } 
          }
        }
      }
    });
  };

  const initBarChart = (colorMap) => {
    if (!barChartRef.current || !dashData?.charts?.search_details) return;
    const ctx = barChartRef.current.getContext("2d");
    const { labels, datasets } = dashData.charts.search_details;
    
    // Add colors to datasets based on colorMap
    const coloredDatasets = datasets.map((ds) => ({
      ...ds,
      backgroundColor: colorMap[ds.label] || "#cbd5e1",
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }));

    barChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: coloredDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { 
            display: true, 
            position: 'top',
            labels: { usePointStyle: true, boxWidth: 8, font: { size: 9 } }
          },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { 
            stacked: false,
            grid: { display: false }, 
            ticks: { font: { size: 10, weight: 'bold' } } 
          },
          y: { 
            stacked: false,
            beginAtZero: true,
            grid: { borderDash: [2, 4], color: '#f1f5f9' },
            ticks: { font: { size: 10 } },
            title: {
              display: true,
              text: "VOLUME DE RECHERCHES",
              font: { size: 10, weight: 'bold' },
              color: '#94a3b8'
            }
          }
        }
      }
    });
  };

  const initPieChart = (colorMap) => {
    if (!pieChartRef.current || !dashData?.charts?.top_metiers) return;
    const ctx = pieChartRef.current.getContext("2d");
    const data = dashData.charts.top_metiers.slice(0, 5);
    const total = data.reduce((s, d) => s + (d.value || 0), 0);
    pieChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map(d => d.name || d.label),
        datasets: [{
          data: data.map(d => d.value || 0),
          backgroundColor: data.map(d => colorMap[d.name || d.label] || "#cbd5e1"),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, font: { size: 9 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${ctx.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, chartArea: { top, bottom, left, right } } = chart;
          ctx.save();
          const centerX = (left + right) / 2;
          const centerY = (top + bottom) / 2;
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Total Number
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(total.toString(), centerX, centerY - 5);
          
          // "Total" Label
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('TOTAL', centerX, centerY + 12);
          ctx.restore();
        }
      }]
    });
  };

  const applyPresetFilter = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate = null, endDate = formatDateForInput(now), period = "all", label = "Tous";

    switch (preset) {
      case "today": startDate = formatDateForInput(today); period = "today"; label = "Aujourd'hui"; break;
      case "yesterday": {
        const y = new Date(today); y.setDate(today.getDate() - 1);
        startDate = formatDateForInput(y); endDate = formatDateForInput(y); period = "custom"; label = "Hier"; break;
      }
      case "week": {
        const s = new Date(today); s.setDate(today.getDate() - 7);
        startDate = formatDateForInput(s); period = "7j"; label = "7 derniers jours"; break;
      }
      case "month": {
        const s = new Date(today); s.setDate(today.getDate() - 30);
        startDate = formatDateForInput(s); period = "30j"; label = "30 derniers jours"; break;
      }
      case "year": {
        const s = new Date(today.getFullYear(), 0, 1);
        startDate = formatDateForInput(s); period = "this_year"; label = "Cette année"; break;
      }
      case "all": startDate = "2000-01-01"; period = "all"; label = "Toutes les périodes"; break;
    }

    setCustomFilter({ startDate, endDate, period, label });
    setShowDatePicker(false);
    setDatePickerMode("presets");
  };

  const applyCustomFilter = () => {
    setCustomFilter(prev => ({ ...prev, period: "custom", label: "Personnalisé" }));
    setShowDatePicker(false);
  };

  if (loading && !dashData) return <SimpleLoader />;

  const stats = dashData?.stats || {};

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="w-full mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Tableau de bord
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Analyse des performances
            </p>
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 bg-white w-full md:w-auto justify-center"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setDatePickerMode("presets");
              }}
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold">{customFilter.label}</span>
              {(customFilter.startDate !== "2000-01-01") && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-72 md:min-w-80">
                {datePickerMode === "presets" ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Périodes</h4>
                      <button onClick={() => setDatePickerMode("custom")} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase">Personnalisé</button>
                    </div>
                    <div className="space-y-1">
                      {["today", "yesterday", "week", "month", "year", "all"].map(p => (
                        <button key={p} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 rounded text-xs font-bold text-gray-700" onClick={() => applyPresetFilter(p)}>
                          {p === "today" ? "Aujourd'hui" : p === "yesterday" ? "Hier" : p === "week" ? "7 derniers jours" : p === "month" ? "30 derniers jours" : p === "year" ? "Cette année" : "Depuis le début"}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Date personnalisée</h4>
                    <div className="space-y-2">
                      <input type="date" value={customFilter.startDate || ""} onChange={(e) => setCustomFilter(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-bold" />
                      <input type="date" value={customFilter.endDate || ""} onChange={(e) => setCustomFilter(p => ({ ...p, endDate: e.target.value }))} className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-bold" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={applyCustomFilter} className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">Appliquer</button>
                      <button onClick={() => setDatePickerMode("presets")} className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">Retour</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <KPICard title="Vues totales" value={stats.total_views || 0} subtitle="Toutes les pages" icon={Globe} color="bg-blue-500" />
          <KPICard title="Métier le plus recherché" value={stats.top_metier?.value || 0} subtitle={stats.top_metier?.name || "N/A"} icon={Briefcase} color="bg-emerald-500" />
        </div>



        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-4">Visibilité temporelle</h3>
            <div className="h-56 md:h-64 w-full">
              <canvas ref={lineChartRef} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-4">Répartition</h3>
            <div className="h-56 md:h-64 w-full flex items-center justify-center">
              <canvas ref={pieChartRef} />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 w-full">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-4">Détails de recherches</h3>
          <div className="h-56 md:h-64 w-full">
            <canvas ref={barChartRef} />
          </div>
        </div>


      </div>
    </div>
  );
}
