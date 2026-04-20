// src/pages/dashboard/view/metiersView.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaPlusCircle,
} from "react-icons/fa";
import { 
  Download, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  X
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  getAllMetiers,
  createMetier,
  updateMetier,
  deleteMetier,
} from "../../../services/metier.services";
import { getAllMentions } from "../../../services/mention.services";
import { getAllParcours } from "../../../services/parcours.services";
import { getAllSeries } from "../../../services/serie.services";
import { getAllDomaines } from "../../../services/domaine.services";

const niveauOptions = ["Bac+2", "Bac+3", "Bac+4", "Bac+5", "Bac+8"];

const emptyForm = {
  label: "",
  description: "",
  parcours: [], // Parcours d'études possibles (multiple)
  mention: [],
  domaine: [],
  serie: [], // Série recommandée (multiple)
  niveau: [],
  parcoursFormation: [], // Parcours de formation (multiple)
};

// ── Configuration ─────────────────────────────────────────────────────────────
const PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

// ── Badges ────────────────────────────────────────────────────────────────────
const TONES = {
  gray:   "bg-gray-100 text-gray-600",
  blue:   "bg-blue-50  text-blue-700",
  green:  "bg-green-50  text-green-700",
  red:    "bg-red-50    text-red-700",
  orange: "bg-orange-50 text-orange-700",
  purple: "bg-purple-50 text-purple-700",
};

const Pill = ({ children, tone = "gray" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${TONES[tone]}`}>
    {children}
  </span>
);

// ── Menu Export ───────────────────────────────────────────────────────────────
const ExportMenu = ({ onExport, filteredMetiers }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition">
        <Download size={15} className="text-blue-600" />
        <span className="hidden sm:inline">Exporter</span>
        <ChevronDown size={14} className={`transition-transform duration-200 text-blue-600 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          <button onClick={() => { onExport("excel", filteredMetiers); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors">
            <FileSpreadsheet size={17} className="text-green-600" /> Excel (.xlsx)
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { onExport("pdf", filteredMetiers); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors">
            <FileText size={17} className="text-red-600" /> PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ── FloatInput (version animée) avec astérisque rouge ─────────────────────────
const FloatInput = ({ id, name, label, value, onChange, type = "text", error, disabled, className = "", min, maxLength, rows }) => {
  const isLabelArray = Array.isArray(label);
  const displayLabel = isLabelArray ? label[0] : label;
  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div className="relative">
      <InputComponent
        type={type !== "textarea" ? type : undefined}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        maxLength={maxLength}
        rows={rows}
        className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
          ${error ? "border-red-500" : "border-gray-300 focus:border-blue-600"}
          ${disabled ? "bg-gray-50 cursor-not-allowed" : ""} ${className}`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
          ${error ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}`}
      >
        {displayLabel.includes('*') ? (
          <>
            {displayLabel.replace('*', '')}
            <span className="text-red-500 ml-0.5">*</span>
          </>
        ) : displayLabel}
      </label>
      {error && <p className="text-[10px] text-red-500 absolute -bottom-5 left-0">{error}</p>}
    </div>
  );
};

// ── SearchableSelect Component ──────────────────────────────────────────────
const SearchableSelect = ({ label, value, options, onChange, disabled, error, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return (options || []).filter(opt => 
      (opt.label || opt).toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = (options || []).find(opt => (opt.value || opt) === value);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 cursor-pointer transition-colors
          ${error ? "border-red-500" : isOpen ? "border-blue-600" : "border-gray-300"}
          ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400" : ""}`}
      >
        <span className="block truncate">
          {selectedOption ? (selectedOption.label || selectedOption) : "Sélectionner..."}
        </span>
        <ChevronDown 
          size={14} 
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} 
        />
        <label
          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 pointer-events-none
            ${selectedOption || isOpen ? "scale-75 -translate-y-4" : ""}
            ${error ? "text-red-500" : isOpen ? "text-blue-600" : "text-gray-500"}`}
        >
          {label.includes('*') ? (
            <>
              {label.replace('*', '')}
              <span className="text-red-500 ml-0.5">*</span>
            </>
          ) : label}
        </label>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] overflow-hidden max-h-60 flex flex-col">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-100 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => (
                <div
                  key={opt.id || opt.value || opt || i}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors
                    ${(opt.value || opt) === value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  onClick={() => {
                    onChange({ target: { name: id, value: (opt.value || opt) } });
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label || opt}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center italic">Aucun résultat</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── MultiSelect Component ──────────────────────────────────────────────
const MultiSelect = ({ label, values = [], options = [], onAdd, onRemove, id, placeholder = "Ajouter..." }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleAdd = () => {
    if (selectedValue) {
      onAdd(selectedValue);
      setSelectedValue("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 border-b-2 border-blue-500 pb-1.5 w-fit">
        {label} <span className="text-red-500">*</span>
      </h3>

      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-lg border border-gray-200">
        {(values || []).map((val, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm transition-shadow"
          >
            <span className="text-xs text-gray-700 font-medium">{val}</span>
            <button
              onClick={() => onRemove(val)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              type="button"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
        {(values || []).length === 0 && (
          <span className="text-gray-400 text-xs w-full text-center py-2 italic">
            Aucun élément ajouté
          </span>
        )}
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <SearchableSelect
            id={id}
            label={placeholder}
            value={selectedValue}
            options={(options || [])
              .filter((opt) => !(values || []).includes(opt.label || opt))
              .map((opt) => ({ value: opt.label || opt, label: opt.label || opt }))}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </div>
        <button
          onClick={handleAdd}
          className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition flex items-center gap-2 whitespace-nowrap"
          type="button"
          disabled={!selectedValue}
        >
          <FaPlusCircle size={14} />
          Ajouter
        </button>
      </div>
    </div>
  );
};

// ── ModalShell — fond blanc pur ───────────────────────────────────────────────
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full sm:max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="flex items-center gap-2 sm:gap-3">
          {Icon && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon size={15} className="text-blue-600" />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-50 p-1.5 sm:p-2 rounded-lg transition">
          <X size={17} className="text-gray-500" />
        </button>
      </div>
      <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-gray-900 bg-white">{children}</div>
      {footer && (
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-white flex justify-end gap-2 flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  </div>
);

const BtnCancel  = ({ onClick }) => (
  <button type="button" onClick={onClick} className="px-3 sm:px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs sm:text-sm font-medium transition">Annuler</button>
);
const BtnPrimary = ({ onClick, children, loading, disabled }) => (
  <button 
    type="button" 
    onClick={onClick} 
    disabled={disabled || loading}
    className={`px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Enregistrement...</span>
      </div>
    ) : children}
  </button>
);

// ── Modale métier ───────────────────────────────────────────────────────────
const MetierModal = ({ 
  isEditing, formData, onClose, onSubmit, onChange, loadingSave, isFormValid,
  mentionOptions, parcoursOptions, serieOptions, domaineOptions,
  handleAddCollection, handleRemoveCollection,
  newParcoursFormation, setNewParcoursFormation, handleAddParcoursFormation, handleRemoveParcoursFormation
}) => {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };

  return (
    <ModalShell
      title={isEditing ? 'Modifier le métier' : 'Ajouter un métier'}
      icon={isEditing ? FaEdit : FaPlus}
      onClose={onClose}
      footer={<>
        <BtnCancel onClick={onClose} />
        <BtnPrimary onClick={handleSubmit} loading={loadingSave} disabled={!isFormValid()}>
          {isEditing ? 'Modifier' : 'Ajouter'}
        </BtnPrimary>
      </>}
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Informations générales */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 w-fit">
            Informations générales
          </h3>

          <div className="space-y-6">
            <FloatInput 
              id="label"
              name="label"
              label="Métier *"
              value={formData.label}
              onChange={(e) => onChange('label')(e)}
            />

            <FloatInput 
              id="description"
              name="description"
              label="Description *"
              value={formData.description}
              onChange={(e) => onChange('description')(e)}
              type="textarea"
              rows={3}
            />
          </div>
        </div>

        {/* Sections multi-valeurs */}
        <div className="space-y-10">
          {/* Domaines */}
          <MultiSelect 
            label="Domaines"
            id="domaine_select"
            placeholder="Sélectionner un domaine"
            values={formData.domaine}
            options={domaineOptions}
            onAdd={(val) => handleAddCollection('domaine', val)}
            onRemove={(val) => handleRemoveCollection('domaine', val)}
          />

          {/* Mentions */}
          <MultiSelect 
            label="Mentions"
            id="mention_select"
            placeholder="Sélectionner une mention"
            values={formData.mention}
            options={mentionOptions}
            onAdd={(val) => handleAddCollection('mention', val)}
            onRemove={(val) => handleRemoveCollection('mention', val)}
          />

          {/* Niveaux */}
          <MultiSelect 
            label="Niveaux"
            id="niveau_select"
            placeholder="Sélectionner un niveau"
            values={formData.niveau}
            options={niveauOptions}
            onAdd={(val) => handleAddCollection('niveau', val)}
            onRemove={(val) => handleRemoveCollection('niveau', val)}
          />

          {/* Parcours d'études possibles */}
          <MultiSelect 
            label="Parcours d'études possibles"
            id="parcours_select"
            placeholder="Sélectionner un parcours"
            values={formData.parcours}
            options={parcoursOptions}
            onAdd={(val) => handleAddCollection('parcours', val)}
            onRemove={(val) => handleRemoveCollection('parcours', val)}
          />

          {/* Séries recommandées */}
          <MultiSelect 
            label="Séries recommandées"
            id="serie_select"
            placeholder="Sélectionner une série"
            values={formData.serie}
            options={serieOptions.map(s => s.code)}
            onAdd={(val) => handleAddCollection('serie', val)}
            onRemove={(val) => handleRemoveCollection('serie', val)}
          />

          {/* Parcours de formation */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 w-fit">
              Parcours de formation <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2 font-normal">(Vous pouvez ajouter plusieurs parcours)</span>
            </h3>

            {/* Liste des parcours ajoutés */}
            <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-gray-50 rounded-lg border border-gray-200">
              {formData.parcoursFormation.map((parcours) => (
                <div
                  key={parcours}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm text-gray-700 font-medium">{parcours}</span>
                  <button
                    onClick={() => handleRemoveParcoursFormation(parcours)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
              {formData.parcoursFormation.length === 0 && (
                <span className="text-gray-400 text-sm w-full text-center py-4">
                  Aucun parcours de formation ajouté
                </span>
              )}
            </div>

            {/* Ajout d'un nouveau parcours */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Saisir un parcours de formation"
                value={newParcoursFormation}
                onChange={(e) => setNewParcoursFormation(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddParcoursFormation();
                  }
                }}
              />
              <button
                onClick={handleAddParcoursFormation}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition flex items-center gap-2 whitespace-nowrap"
                type="button"
              >
                <FaPlusCircle size={16} />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

// ── Modale de confirmation ────────────────────────────────────────────────────
const CONFIRM_COLORS = {
  blue:"bg-blue-600 hover:bg-blue-700", red:"bg-red-600 hover:bg-red-700",
  orange:"bg-orange-600 hover:bg-orange-700", green:"bg-green-600 hover:bg-green-700"
};

const ConfirmModal = ({ title, message, icon: Icon, onConfirm, onClose, confirmText = "Confirmer", confirmColor = "blue", loading }) => (
  <ModalShell 
    title={title} 
    icon={Icon || FaExclamationTriangle} 
    onClose={onClose}
    footer={<>
      <BtnCancel onClick={onClose} />
      <button 
        onClick={onConfirm} 
        disabled={loading}
        className={`px-3 sm:px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition ${confirmColor === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Suppression...</span>
          </div>
        ) : confirmText}
      </button>
    </>}>
    <p className="text-sm text-gray-600">{message}</p>
  </ModalShell>
);

// ── Carte métier — vue mobile ───────────────────────────────────────────────
const MetierCard = ({ metier, onEdit, onDelete }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onEdit(metier)}
  >
    {/* Ligne 1 : ID + actions */}
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400">ID {metier.id}</span>
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit(metier)}
          className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition" title="Modifier">
          <FaEdit size={14} className="text-blue-600" />
        </button>
        <button onClick={() => onDelete(metier)}
          className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition" title="Supprimer">
          <FaTrash size={14} className="text-red-600" />
        </button>
      </div>
    </div>

    {/* Infos principales */}
    <div>
      <p className="text-sm font-semibold text-gray-900">{metier.label}</p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{metier.description}</p>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-1 border-t border-gray-100 pt-2">
      {Array.isArray(metier.domaine) && metier.domaine.map((d, i) => (
        <Pill key={i} tone="blue">{d}</Pill>
      ))}
      {Array.isArray(metier.mention) && metier.mention.map((m, i) => (
        <Pill key={i} tone="green">{m}</Pill>
      ))}
      {Array.isArray(metier.niveau) && metier.niveau.map((n, i) => (
        <Pill key={i} tone="purple">{n}</Pill>
      ))}
    </div>

    {/* Séries */}
    {metier.serie && Array.isArray(metier.serie) && metier.serie.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {metier.serie.map((s) => (
          <span key={s} className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
            {s}
          </span>
        ))}
      </div>
    )}
  </div>
);

// ── Export Excel professionnel avec XLSX ───────────────────────────────────
const exportToExcel = (data) => {
  try {
    const worksheetData = [
      ['ID', 'MÉTIER', 'DESCRIPTION', 'DOMAINES', 'MENTIONS', 'NIVEAUX', 'SÉRIES', 'PARCOURS ÉTUDES', 'PARCOURS FORMATION'],
      ...data.map(m => [
        m.id,
        m.label,
        m.description,
        (m.domaine || []).join(', '),
        (m.mention || []).join(', '),
        (m.niveau || []).join(', '),
        (m.serie || []).join(', '),
        (m.parcours || []).join(', '),
        (m.parcoursFormation || []).join(', ')
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    ws['!cols'] = [
      { wch: 8 },  // ID
      { wch: 30 }, // Métier
      { wch: 40 }, // Description
      { wch: 20 }, // Mention
      { wch: 12 }, // Niveau
      { wch: 25 }, // Séries
      { wch: 30 }, // Parcours études
      { wch: 30 }  // Parcours formation
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Métiers');
    XLSX.writeFile(wb, `metiers_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error("Erreur génération Excel:", error);
    throw error;
  }
};

// ── Export PDF professionnel avec jsPDF et autoTable ──────────────────────
const exportToPDF = (data) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text('LISTE DES MÉTIERS', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const dateStr = `Exporté le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
    doc.text(dateStr, 14, 28);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 280, 32);

    const tableData = data.map(m => [
      m.id.toString(),
      m.label,
      m.description,
      (m.domaine || []).join(', '),
      (m.mention || []).join(', '),
      (m.niveau || []).join(', '),
      (m.serie || []).join(', '),
      (m.parcours || []).join(', '),
      (m.parcoursFormation || []).join(', ')
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['ID', 'Métier', 'Description', 'Domaines', 'Mentions', 'Niveaux', 'Séries', 'Parcours études', 'Parcours formation']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 25 },
        2: { halign: 'left', cellWidth: 40 },
        3: { halign: 'left', cellWidth: 25 },
        4: { halign: 'left', cellWidth: 25 },
        5: { halign: 'left', cellWidth: 20 },
        6: { halign: 'left', cellWidth: 20 },
        7: { halign: 'left', cellWidth: 30 },
        8: { halign: 'left', cellWidth: 30 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: 14, right: 14 },
      styles: {
        overflow: 'linebreak',
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      didDrawPage: () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Page ${i} sur ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      }
    });

    const finalY = doc.lastAutoTable.finalY || 200;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "italic");
    doc.text(`Total : ${data.length} métier(s)`, 14, finalY + 10);

    doc.save(`metiers_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    throw error;
  }
};

export default function MetiersView() {
  const [metiers, setMetiers] = useState([]);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [serieOptions, setSerieOptions] = useState([]);
  const [domaineOptions, setDomaineOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Pagination et tri
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  
  const [formData, setFormData] = useState(emptyForm);
  const [newParcoursFormation, setNewParcoursFormation] = useState("");

  // ── Toast ──────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // ── Chargement initial : tout en parallèle ─────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [metiersData, mentionsData, parcoursData, seriesData, domainesData] =
        await Promise.all([
          getAllMetiers(searchTerm),
          getAllMentions(),
          getAllParcours(),
          getAllSeries(),
          getAllDomaines(),
        ]);

      // S'assurer que parcoursFormation, serie et parcours sont toujours des tableaux
      const metiersWithArray = metiersData.map((metier) => ({
        ...metier,
        parcours: Array.isArray(metier.parcours) ? metier.parcours : [],
        parcoursFormation: Array.isArray(metier.parcoursFormation) ? metier.parcoursFormation : [],
        serie: Array.isArray(metier.serie) ? metier.serie : [],
      }));

      setMetiers(metiersWithArray);
      setMentionOptions(mentionsData);
      setParcoursOptions(parcoursData);
      setSerieOptions(seriesData);
      setDomaineOptions(domainesData);
    } catch (error) {
      showToast("Erreur lors du chargement des données", "error");
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Recherche avec debounce ────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const delay = setTimeout(async () => {
      try {
        const data = await getAllMetiers(searchTerm);
        // S'assurer que parcoursFormation, serie et parcours sont toujours des tableaux
        const metiersWithArray = data.map((metier) => ({
          ...metier,
          parcours: Array.isArray(metier.parcours) ? metier.parcours : [],
          parcoursFormation: Array.isArray(metier.parcoursFormation) ? metier.parcoursFormation : [],
          serie: Array.isArray(metier.serie) ? metier.serie : [],
        }));
        setMetiers(metiersWithArray);
        setCurrentPage(1);
      } catch {
        showToast("Erreur lors de la recherche", "error");
      }
    }, 400);
    return () => clearTimeout(delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Tri et pagination ───────────────────────────────────────────────
  const sortedMetiers = useMemo(() => {
    const sortable = [...metiers];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [metiers, sortConfig]);

  const paginatedMetiers = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedMetiers.slice(start, start + perPage);
  }, [sortedMetiers, currentPage, perPage]);

  const totalItems = metiers.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);
  const hasFilter = !!searchTerm;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const requestSort = (key) => setSortConfig(prev => ({ 
    key, 
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' 
  }));

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <div className="inline-flex flex-col ml-1 opacity-30"><ChevronUp size={10} className="text-gray-500"/><ChevronDown size={10} className="-mt-1 text-gray-500"/></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp size={13} className="ml-1 text-blue-600"/> : <ChevronDown size={13} className="ml-1 text-blue-600"/>;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // ── Validation ─────────────────────────────────────────────────────
  const isFormValid = () =>
    (formData.label || "").trim() !== "" &&
    (formData.description || "").trim() !== "" &&
    (formData.parcours || []).length > 0 &&
    (formData.mention || []).length > 0 &&
    (formData.domaine || []).length > 0 &&
    (formData.serie || []).length > 0 &&
    (formData.niveau || []).length > 0 &&
    (formData.parcoursFormation || []).length > 0;

  // ── Gestion formulaire ─────────────────────────────────────────────
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCollection = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const handleRemoveCollection = (field, valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(v => v !== valueToRemove)
    }));
  };

  const handleAddParcoursFormation = () => {
    if (newParcoursFormation.trim() === "") {
      showToast("Veuillez saisir un parcours de formation", "error");
      return;
    }
    if (formData.parcoursFormation.includes(newParcoursFormation.trim())) {
      showToast("Ce parcours existe déjà", "error");
      return;
    }
    setFormData(prev => ({
      ...prev,
      parcoursFormation: [...prev.parcoursFormation, newParcoursFormation.trim()]
    }));
    setNewParcoursFormation("");
  };

  const handleRemoveParcoursFormation = (pfToRemove) => {
    setFormData(prev => ({
      ...prev,
      parcoursFormation: prev.parcoursFormation.filter(pf => pf !== pfToRemove)
    }));
  };

  // ── Ouvrir modal ───────────────────────────────────────────────────
  const handleOpenModal = (metier = null) => {
    if (metier) {
      setEditingId(metier.id);
      setFormData({
        label: metier.label,
        description: metier.description,
        parcours: Array.isArray(metier.parcours) ? metier.parcours : [],
        mention: Array.isArray(metier.mention) ? metier.mention : [],
        domaine: Array.isArray(metier.domaine) ? metier.domaine : [],
        serie: Array.isArray(metier.serie) ? metier.serie : [],
        niveau: Array.isArray(metier.niveau) ? metier.niveau : [],
        parcoursFormation: Array.isArray(metier.parcoursFormation) ? metier.parcoursFormation : [],
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setNewParcoursFormation("");
    setShowModal(true);
  };

  const handleRowClick = (metier, e) => { 
    if (e.target.closest('button')) return; 
    handleOpenModal(metier); 
  };
const handleSave = async () => {
  if (!isFormValid()) {
    showToast("Veuillez remplir tous les champs obligatoires", "error");
    return;
  }

  // ✅ Deep copy pour éviter les problèmes de référence sur les tableaux
  const payload = {
    label:             formData.label,
    description:       formData.description,
    mention:           formData.mention,
    domaine:           formData.domaine,
    niveau:            formData.niveau,
    parcours:          [...formData.parcours],
    serie:             [...formData.serie],
    parcoursFormation: [...formData.parcoursFormation],
  };

  console.log("=== [handleSave] payload envoyé à PHP ===", JSON.stringify(payload, null, 2));
  console.log("  label:", payload.label);
  console.log("  description:", payload.description);
  console.log("  mention:", payload.mention);
  console.log("  domaine:", payload.domaine);
  console.log("  niveau:", payload.niveau);
  console.log("  parcours:", payload.parcours);
  console.log("  serie:", payload.serie);
  console.log("  parcoursFormation:", payload.parcoursFormation);

  setLoadingSave(true);
  try {
    let result;
    if (editingId) {
      result = await updateMetier(editingId, payload);
      console.log("=== [updateMetier] réponse PHP ===", result);
      showToast("Métier modifié avec succès", "success");
    } else {
      result = await createMetier(payload);
      console.log("=== [createMetier] réponse PHP ===", result);
      showToast("Métier ajouté avec succès", "success");
    }

    setShowModal(false);
    setFormData(emptyForm);
    setNewParcoursFormation("");

    await fetchData();

  } catch (error) {
    console.error("=== [handleSave] ERREUR ===", error.response?.data || error);
    const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
    showToast(message, "error");
  } finally {
    setLoadingSave(false);
  }
};


  // ── Supprimer ──────────────────────────────────────────────────────
  const handleDeleteClick = (metier) => {
    setDeleteItem(metier);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteMetier(deleteItem.id);
      setMetiers(metiers.filter((m) => m.id !== deleteItem.id));
      showToast("Métier supprimé avec succès", "success");
      setDeleteItem(null);
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      showToast(message, "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
  };

  // ── Export ─────────────────────────────────────────────────────────
  const handleExport = (type, data) => {
    if (type === 'excel') {
      try {
        exportToExcel(data);
        showToast(`Export Excel réussi ! (${data.length} entrées)`);
      } catch(e) { 
        console.error("Erreur export Excel:", e);
        showToast("Erreur export Excel : " + e.message, "error"); 
      }
    } else {
      try {
        exportToPDF(data);
        showToast(`Export PDF réussi ! (${data.length} entrées)`);
      } catch(e) { 
        console.error("Erreur export PDF:", e);
        showToast("Erreur export PDF : " + e.message, "error"); 
      }
    }
  };

  // Colonnes du tableau
  const COLS = [
    { key: 'id', label: 'ID' },
    { key: 'label', label: 'Métier' },
    { key: 'domaine', label: 'Domaine' },
    { key: 'description', label: 'Description' },
    { key: 'mention', label: 'Mention' },
    { key: 'niveau', label: 'Niveau' },
  ];

  // ── Rendu ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white p-0">
      <ToastContainer />

      {/* Modales */}
      {showModal && (
        <MetierModal 
          isEditing={!!editingId}
          formData={formData}
          onClose={() => { setShowModal(false); resetForm(); }}
          onSubmit={handleSave}
          onChange={handleInputChange}
          loadingSave={loadingSave}
          isFormValid={isFormValid}
          mentionOptions={mentionOptions}
          parcoursOptions={parcoursOptions}
          serieOptions={serieOptions}
          domaineOptions={domaineOptions}
          handleAddCollection={handleAddCollection}
          handleRemoveCollection={handleRemoveCollection}
          newParcoursFormation={newParcoursFormation}
          setNewParcoursFormation={setNewParcoursFormation}
          handleAddParcoursFormation={handleAddParcoursFormation}
          handleRemoveParcoursFormation={handleRemoveParcoursFormation}
        />
      )}
      
      {deleteItem && (
        <ConfirmModal
          title="Confirmer la suppression"
          message={`Voulez-vous vraiment supprimer le métier "${deleteItem.label}" ? Cette action est irréversible.`}
          icon={FaExclamationTriangle}
          confirmText="Supprimer"
          confirmColor="red"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteItem(null)}
          loading={loadingDelete}
        />
      )}

      <div className="max-w-screen-2xl mx-auto space-y-4">

        {/* En-tête */}
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-gray-900">
              Gestion des métiers
            </h1>
            <p className="text-xs sm:text-sm mt-0.5 text-gray-500">
              {totalItems} métier{totalItems > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition"
          >
            <FaPlus size={15} className="text-white" />
            <span className="hidden sm:inline">Ajouter un métier</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>

        {/* Bloc principal */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                type="text"
                placeholder="Rechercher un métier..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-20 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Barre d'actions (Afficher X entrées + Export) */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Afficher</span>
                <select 
                  value={perPage} 
                  onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PER_PAGE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <span className="text-xs text-gray-500">entrées</span>
                {hasFilter && (
                  <button 
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 whitespace-nowrap"
                  >
                    <X size={12} className="text-gray-600" /> Réinitialiser
                  </button>
                )}
              </div>
              <ExportMenu onExport={handleExport} filteredMetiers={paginatedMetiers} />
            </div>
            {loading && (
              <div className="mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* VUE CARTE — mobile */}
          <div className="md:hidden p-3 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Chargement...</span>
                </div>
              </div>
            ) : paginatedMetiers.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-gray-400 opacity-50">
                <FaSearch size={24}/>
                <span className="text-sm">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucun métier disponible"}
                </span>
              </div>
            ) : paginatedMetiers.map(metier => (
              <MetierCard 
                key={metier.id || metier.label} 
                metier={metier} 
                onEdit={handleOpenModal} 
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* VUE TABLEAU — tablette et desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  {COLS.map(({ key, label }) => (
                    <th 
                      key={key}
                      className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-600 cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => requestSort(key)}
                    >
                      <div className="flex items-center justify-center">
                        {label}
                        {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Chargement...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedMetiers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <FaSearch size={24}/>
                        <span className="text-sm">
                          {searchTerm ? "Aucun résultat trouvé" : "Aucun métier disponible"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedMetiers.map((metier) => (
                  <tr 
                    key={metier.id || metier.label}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={(e) => handleRowClick(metier, e)}
                  >
                    <td className="px-3 py-3 text-sm text-gray-900 font-medium text-center">{metier.id}</td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center truncate max-w-[200px]" title={metier.label}>{metier.label}</td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {Array.isArray(metier.domaine) && metier.domaine.map((d, i) => (
                          <Pill key={i} tone="blue">{d}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center max-w-xs truncate">{metier.description}</td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {Array.isArray(metier.mention) && metier.mention.map((m, i) => (
                          <Pill key={i} tone="green">{m}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {Array.isArray(metier.niveau) && metier.niveau.map((n, i) => (
                          <Pill key={i} tone="purple">{n}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(metier); }}
                          className="p-1.5 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition" 
                          title="Modifier"
                        >
                          <FaEdit size={15} className="text-blue-600" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(metier); }}
                          className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition" 
                          title="Supprimer"
                        >
                          <FaTrash size={15} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 order-2 sm:order-1">
                Affichage de {startItem} à {endItem} sur {totalItems} métier{totalItems > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={15} className="text-blue-600" />
                </button>
                
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="text-sm text-gray-500 px-1">…</span>
                  ) : (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        currentPage === p 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={15} className="text-blue-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}