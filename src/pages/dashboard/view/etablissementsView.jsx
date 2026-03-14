// src/pages/dashboard/view/etablissementsView.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaTimes, FaExclamationTriangle
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
  getAllEtablissements,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
} from "../../../services/etablissement.services";
import { getAllMentions } from "../../../services/mention.services";
import { getAllParcours } from "../../../services/parcours.services";
import { getAllMetiers } from "../../../services/metier.services";

// ── Données statiques Madagascar ───────────────────────────────────────────
const provinceRegions = {
  Antananarivo: ["Analamanga", "Itasy", "Vakinankaratra", "Bongolava"],
  Mahajanga:    ["Boeny", "Sofia", "Betsiboka", "Melaky"],
  Toliara:      ["Atsimo-Andrefana", "Androy", "Anosy", "Menabe"],
  Toamasina:    ["Atsinanana", "Alaotra-Mangoro", "Analanjirofo"],
  Fianarantsoa: [
    "Haute Matsiatra", "Amoron'i Mania", "Vatovavy",
    "Fitovinany", "Atsimo-Atsinanana", "Ihorombe"
  ],
  Antsiranana:  ["Diana", "Sava"],
};

const provinceOptions  = Object.keys(provinceRegions);
const typeOptions      = ["Public", "Privé"];
const niveauOptions    = ["Licence", "Master", "Doctorat"];
const admissionOptions = ["Concours", "Dossier", "Entretien", "Test", "Concours + Dossier"];

const niveauDureeMap = {
  Licence:  "3 ans",
  Master:   "5 ans",
  Doctorat: "8 ans",
};

const emptyForm = {
  nom:       "",
  province:  "",
  region:    "",
  type:      "Public",
  mention:   "",
  parcours:  "",
  metier:    "",
  niveau:    "",
  duree:     "",
  admission: "",
  contact:   "",
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
const ExportMenu = ({ onExport, filteredEtablissements }) => {
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
          <button onClick={() => { onExport("excel", filteredEtablissements); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors">
            <FileSpreadsheet size={17} className="text-green-600" /> Excel (.xlsx)
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { onExport("pdf", filteredEtablissements); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors">
            <FileText size={17} className="text-red-600" /> PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ── FloatInput (version animée) avec astérisque rouge ─────────────────────────
const FloatInput = ({ id, name, label, value, onChange, type = "text", error, disabled, className = "", min, maxLength, rows, options = [] }) => {
  if (type === "select") {
    return (
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
            ${error ? "border-red-500" : "border-gray-300 focus:border-blue-600"}
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""} ${className}`}
        >
          <option value="">Sélectionner</option>
          {options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
            ${error ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}`}
        >
          {label.includes('*') ? (
            <>
              {label.replace('*', '')}
              <span className="text-red-500 ml-0.5">*</span>
            </>
          ) : label}
        </label>
        {error && <p className="text-[10px] text-red-500 absolute -bottom-5 left-0">{error}</p>}
      </div>
    );
  }

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
        {label.includes('*') ? (
          <>
            {label.replace('*', '')}
            <span className="text-red-500 ml-0.5">*</span>
          </>
        ) : label}
      </label>
      {error && <p className="text-[10px] text-red-500 absolute -bottom-5 left-0">{error}</p>}
    </div>
  );
};

// ── ModalShell — fond blanc pur ───────────────────────────────────────────────
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full sm:max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
  <button type="button" onClick={onClick} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold">Annuler</button>
);
const BtnPrimary = ({ onClick, children, loading, disabled }) => (
  <button 
    type="button" 
    onClick={onClick} 
    disabled={disabled || loading}
    className={`px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-colors ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Enregistrement...</span>
      </div>
    ) : children}
  </button>
);

// ── Modale établissement ─────────────────────────────────────────────────────
const EtablissementModal = ({ 
  isEditing, formData, onClose, onSubmit, onChange, onProvinceChange, onNiveauChange, loadingSave, isFormValid,
  mentionOptions, parcoursOptions, metierOptions
}) => {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };

  return (
    <ModalShell
      title={isEditing ? "Modifier l'établissement" : "Ajouter un établissement"}
      icon={isEditing ? FaEdit : FaPlus}
      onClose={onClose}
      footer={<>
        <BtnCancel onClick={onClose} />
        <BtnPrimary onClick={handleSubmit} loading={loadingSave} disabled={!isFormValid()}>
          {isEditing ? 'Modifier' : 'Ajouter'}
        </BtnPrimary>
      </>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom (pleine largeur) */}
          <div className="md:col-span-2">
            <FloatInput 
              id="nom"
              name="nom"
              label="Nom de l'établissement *"
              value={formData.nom}
              onChange={(e) => onChange('nom')(e)}
            />
          </div>

          {/* Province */}
          <FloatInput 
            id="province"
            name="province"
            label="Province *"
            type="select"
            value={formData.province}
            onChange={(e) => onProvinceChange(e.target.value)}
            options={provinceOptions}
          />

          {/* Région */}
          <FloatInput 
            id="region"
            name="region"
            label="Région *"
            type="select"
            value={formData.region}
            onChange={(e) => onChange('region')(e)}
            disabled={!formData.province}
            options={formData.province ? provinceRegions[formData.province] : []}
          />

          {/* Type */}
          <FloatInput 
            id="type"
            name="type"
            label="Type *"
            type="select"
            value={formData.type}
            onChange={(e) => onChange('type')(e)}
            options={typeOptions}
          />

          {/* Contact */}
          <FloatInput 
            id="contact"
            name="contact"
            label="Contact *"
            value={formData.contact}
            onChange={(e) => onChange('contact')(e)}
          />

          {/* Mention */}
          <FloatInput 
            id="mention"
            name="mention"
            label="Mention *"
            type="select"
            value={formData.mention}
            onChange={(e) => onChange('mention')(e)}
            options={mentionOptions.map(m => ({ value: m.label, label: m.label }))}
          />

          {/* Parcours */}
          <FloatInput 
            id="parcours"
            name="parcours"
            label="Parcours *"
            type="select"
            value={formData.parcours}
            onChange={(e) => onChange('parcours')(e)}
            options={parcoursOptions.map(p => ({ value: p.label, label: p.label }))}
          />

          {/* Métier */}
          <FloatInput 
            id="metier"
            name="metier"
            label="Métier *"
            type="select"
            value={formData.metier}
            onChange={(e) => onChange('metier')(e)}
            options={metierOptions.map(m => ({ value: m.label, label: m.label }))}
          />

          {/* Niveau */}
          <FloatInput 
            id="niveau"
            name="niveau"
            label="Niveau *"
            type="select"
            value={formData.niveau}
            onChange={(e) => onNiveauChange(e.target.value)}
            options={niveauOptions}
          />

          {/* Durée */}
          <div className="relative">
            <input
              type="text"
              id="duree"
              name="duree"
              value={formData.duree}
              readOnly
              className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
                ${formData.niveau
                  ? "bg-blue-50 text-blue-600 font-semibold border-blue-300"
                  : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              placeholder=" "
            />
            <label
              htmlFor="duree"
              className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 text-gray-500"
            >
              Durée
              {formData.niveau && (
                <span className="ml-2 text-xs text-blue-500 font-normal">(auto)</span>
              )}
            </label>
          </div>

          {/* Admission */}
          <FloatInput 
            id="admission"
            name="admission"
            label="Admission *"
            type="select"
            value={formData.admission}
            onChange={(e) => onChange('admission')(e)}
            options={admissionOptions}
          />
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
        className={`px-4 py-2 rounded-xl text-white text-xs font-semibold ${CONFIRM_COLORS[confirmColor]} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

// ── Carte établissement — vue mobile ───────────────────────────────────────
const EtablissementCard = ({ etablissement, onEdit, onDelete }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onEdit(etablissement)}
  >
    {/* Ligne 1 : ID + actions */}
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400">ID {etablissement.id}</span>
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit(etablissement)}
          className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition" title="Modifier">
          <FaEdit size={14} className="text-blue-600" />
        </button>
        <button onClick={() => onDelete(etablissement)}
          className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition" title="Supprimer">
          <FaTrash size={14} className="text-red-600" />
        </button>
      </div>
    </div>

    {/* Infos principales */}
    <div>
      <p className="text-sm font-semibold text-gray-900">{etablissement.nom}</p>
      <p className="text-xs text-gray-500 mt-0.5">{etablissement.province} / {etablissement.region}</p>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-1 border-t border-gray-100 pt-2">
      <Pill tone={etablissement.type === "Public" ? "green" : "purple"}>
        {etablissement.type}
      </Pill>
      <Pill tone="blue">{etablissement.niveau}</Pill>
      <Pill tone="orange">{etablissement.admission}</Pill>
    </div>

    {/* Contact */}
    <p className="text-xs text-gray-600">
      <span className="font-medium">Contact:</span> {etablissement.contact}
    </p>
  </div>
);

// ── Export Excel professionnel avec XLSX ───────────────────────────────────
const exportToExcel = (data) => {
  try {
    const worksheetData = [
      ['ID', 'ÉTABLISSEMENT', 'PROVINCE', 'RÉGION', 'TYPE', 'MENTION', 'PARCOURS', 'MÉTIER', 'NIVEAU', 'DURÉE', 'ADMISSION', 'CONTACT'],
      ...data.map(e => [
        e.id,
        e.nom,
        e.province,
        e.region,
        e.type,
        e.mention,
        e.parcours,
        e.metier,
        e.niveau,
        e.duree,
        e.admission,
        e.contact
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    ws['!cols'] = [
      { wch: 8 },  // ID
      { wch: 35 }, // Établissement
      { wch: 15 }, // Province
      { wch: 20 }, // Région
      { wch: 10 }, // Type
      { wch: 20 }, // Mention
      { wch: 25 }, // Parcours
      { wch: 25 }, // Métier
      { wch: 12 }, // Niveau
      { wch: 10 }, // Durée
      { wch: 20 }, // Admission
      { wch: 20 }  // Contact
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Établissements');
    XLSX.writeFile(wb, `etablissements_${new Date().toISOString().split('T')[0]}.xlsx`);
    
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
    doc.text('LISTE DES ÉTABLISSEMENTS', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const dateStr = `Exporté le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
    doc.text(dateStr, 14, 28);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 280, 32);

    const tableData = data.map(e => [
      e.id.toString(),
      e.nom,
      e.province,
      e.region,
      e.type,
      e.mention,
      e.parcours,
      e.metier,
      e.niveau,
      e.duree,
      e.admission,
      e.contact
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['ID', 'Établissement', 'Province', 'Région', 'Type', 'Mention', 'Parcours', 'Métier', 'Niveau', 'Durée', 'Admission', 'Contact']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 1.5
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 35 },
        2: { halign: 'left', cellWidth: 20 },
        3: { halign: 'left', cellWidth: 22 },
        4: { halign: 'center', cellWidth: 12 },
        5: { halign: 'left', cellWidth: 22 },
        6: { halign: 'left', cellWidth: 25 },
        7: { halign: 'left', cellWidth: 25 },
        8: { halign: 'center', cellWidth: 15 },
        9: { halign: 'center', cellWidth: 12 },
        10: { halign: 'left', cellWidth: 22 },
        11: { halign: 'left', cellWidth: 22 }
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
    doc.text(`Total : ${data.length} établissement(s)`, 14, finalY + 10);

    doc.save(`etablissements_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    throw error;
  }
};

export default function EtablissementsView() {
  const [etablissements, setEtablissements] = useState([]);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [metierOptions, setMetierOptions] = useState([]);
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

  // ── Chargement initial ─────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [etablissementsData, mentionsData, parcoursData, metiersData] =
        await Promise.all([
          getAllEtablissements(searchTerm),
          getAllMentions(),
          getAllParcours(),
          getAllMetiers(),
        ]);
      setEtablissements(etablissementsData);
      setMentionOptions(mentionsData);
      setParcoursOptions(parcoursData);
      setMetierOptions(metiersData);
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
        const data = await getAllEtablissements(searchTerm);
        setEtablissements(data);
        setCurrentPage(1);
      } catch {
        showToast("Erreur lors de la recherche", "error");
      }
    }, 400);
    return () => clearTimeout(delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Tri et pagination ───────────────────────────────────────────────
  const sortedEtablissements = useMemo(() => {
    const sortable = [...etablissements];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [etablissements, sortConfig]);

  const paginatedEtablissements = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedEtablissements.slice(start, start + perPage);
  }, [sortedEtablissements, currentPage, perPage]);

  const totalItems = etablissements.length;
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
    formData.nom.trim() !== "" &&
    formData.province !== "" &&
    formData.region !== "" &&
    formData.type !== "" &&
    formData.mention !== "" &&
    formData.parcours !== "" &&
    formData.metier !== "" &&
    formData.niveau !== "" &&
    formData.admission !== "" &&
    formData.contact.trim() !== "";

  // ── Gestion formulaire ─────────────────────────────────────────────
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ── Synchro province → reset région ───────────────────────────────
  const handleProvinceChange = (province) => {
    setFormData({ ...formData, province, region: "" });
  };

  // ── Synchro niveau → durée automatique ────────────────────────────
  const handleNiveauChange = (niveau) => {
    setFormData({
      ...formData,
      niveau,
      duree: niveauDureeMap[niveau] ?? "",
    });
  };

  // ── Ouvrir modal ───────────────────────────────────────────────────
  const handleOpenModal = (etab = null) => {
    if (etab) {
      setEditingId(etab.id);
      setFormData({
        nom: etab.nom,
        province: etab.province,
        region: etab.region,
        type: etab.type,
        mention: etab.mention,
        parcours: etab.parcours,
        metier: etab.metier,
        niveau: etab.niveau,
        duree: etab.duree,
        admission: etab.admission,
        contact: etab.contact,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleRowClick = (etab, e) => { 
    if (e.target.closest('button')) return; 
    handleOpenModal(etab); 
  };

  // ── Sauvegarder ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!isFormValid()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    setLoadingSave(true);
    try {
      if (editingId) {
        const updated = await updateEtablissement(editingId, formData);
        setEtablissements(etablissements.map((e) =>
          e.id === editingId ? updated : e
        ));
        showToast("Établissement modifié avec succès", "success");
      } else {
        const created = await createEtablissement(formData);
        setEtablissements([...etablissements, created]);
        showToast("Établissement ajouté avec succès", "success");
      }
      setShowModal(false);
      setFormData(emptyForm);
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
      showToast(message, "error");
    } finally {
      setLoadingSave(false);
    }
  };

  // ── Supprimer ──────────────────────────────────────────────────────
  const handleDeleteClick = (etab) => {
    setDeleteItem(etab);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteEtablissement(deleteItem.id);
      setEtablissements(etablissements.filter((e) => e.id !== deleteItem.id));
      showToast("Établissement supprimé avec succès", "success");
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

  // Colonnes du tableau (simplifiées pour l'affichage)
  const COLS = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Établissement' },
    { key: 'province', label: 'Province' },
    { key: 'region', label: 'Région' },
    { key: 'type', label: 'Type' },
    { key: 'mention', label: 'Mention' },
    { key: 'niveau', label: 'Niveau' },
  ];

  // ── Rendu ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 xl:p-8">
      <ToastContainer />

      {/* Modales */}
      {showModal && (
        <EtablissementModal 
          isEditing={!!editingId}
          formData={formData}
          onClose={() => { setShowModal(false); resetForm(); }}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onProvinceChange={handleProvinceChange}
          onNiveauChange={handleNiveauChange}
          loadingSave={loadingSave}
          isFormValid={isFormValid}
          mentionOptions={mentionOptions}
          parcoursOptions={parcoursOptions}
          metierOptions={metierOptions}
        />
      )}
      
      {deleteItem && (
        <ConfirmModal
          title="Confirmer la suppression"
          message={`Voulez-vous vraiment supprimer l'établissement "${deleteItem.nom}" ? Cette action est irréversible.`}
          icon={FaExclamationTriangle}
          confirmText="Supprimer"
          confirmColor="red"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteItem(null)}
          loading={loadingDelete}
        />
      )}

      <div className="max-w-screen-2xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">

        {/* En-tête */}
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-gray-900">
              Gestion des établissements
            </h1>
            <p className="text-xs sm:text-sm mt-0.5 text-gray-500">
              {totalItems} établissement{totalItems > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition"
          >
            <FaPlus size={15} className="text-white" />
            <span className="hidden sm:inline">Ajouter un établissement</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>

        {/* Bloc principal */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Barre de recherche */}
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                type="text"
                placeholder="Rechercher un établissement..."
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
          <div className="px-3 sm:px-4 py-2 border-b border-gray-200">
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
              <ExportMenu onExport={handleExport} filteredEtablissements={paginatedEtablissements} />
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
            ) : paginatedEtablissements.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-gray-400 opacity-50">
                <FaSearch size={24}/>
                <span className="text-sm">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucun établissement disponible"}
                </span>
              </div>
            ) : paginatedEtablissements.map(etab => (
              <EtablissementCard 
                key={etab.id} 
                etablissement={etab} 
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
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Chargement...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedEtablissements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <FaSearch size={24}/>
                        <span className="text-sm">
                          {searchTerm ? "Aucun résultat trouvé" : "Aucun établissement disponible"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedEtablissements.map((etab) => (
                  <tr 
                    key={etab.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={(e) => handleRowClick(etab, e)}
                  >
                    <td className="px-3 py-3 text-sm text-gray-900 font-medium text-center whitespace-nowrap">{etab.id}</td>
                    <td className="px-3 py-3 text-sm text-gray-900 text-center whitespace-nowrap">{etab.nom}</td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center whitespace-nowrap">{etab.province}</td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center whitespace-nowrap">{etab.region}</td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <Pill tone={etab.type === "Public" ? "green" : "purple"}>
                        {etab.type}
                      </Pill>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-center whitespace-nowrap">{etab.mention}</td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <Pill tone="blue">{etab.niveau}</Pill>
                    </td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(etab); }}
                          className="p-1.5 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition" 
                          title="Modifier"
                        >
                          <FaEdit size={15} className="text-blue-600" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(etab); }}
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
            <div className="px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <span className="text-xs text-gray-500 order-2 sm:order-1">
                Affichage de {startItem} à {endItem} sur {totalItems} établissement{totalItems > 1 ? 's' : ''}
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