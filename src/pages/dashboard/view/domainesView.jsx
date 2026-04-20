// src/pages/dashboard/view/domainesView.jsx
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
  getAllDomaines,
  createDomaine,
  updateDomaine,
  deleteDomaine,
} from "../../../services/domaine.services";

// ── Configuration ─────────────────────────────────────────────────────────────
const PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

// ── Menu Export ───────────────────────────────────────────────────────────────
const ExportMenu = ({ onExport, filteredData }) => {
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
          <button onClick={() => { onExport("excel", filteredData); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors">
            <FileSpreadsheet size={17} className="text-green-600" /> Excel (.xlsx)
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { onExport("pdf", filteredData); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors">
            <FileText size={17} className="text-red-600" /> PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ── FloatInput ─────────────────────────────────────────────────────────────
const FloatInput = ({ id, name, label, value, onChange, type = "text", error, disabled, className = "", min, maxLength, rows }) => {
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

// ── ModalShell ───────────────────────────────────────────────────────────────
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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

// ── Modale domaine ───────────────────────────────────────────────────────────
const DomaineModal = ({ isEditing, formData, onClose, onSubmit, onChange, loadingSave, isFormValid }) => {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };

  return (
    <ModalShell
      title={isEditing ? 'Modifier le domaine' : 'Ajouter un domaine'}
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
        <FloatInput 
          id="label"
          name="label"
          label="Domaine *"
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
      </form>
    </ModalShell>
  );
};

// ── Modale de confirmation ────────────────────────────────────────────────────
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

// ── Carte domaine — vue mobile ───────────────────────────────────────────────
const DomaineCard = ({ domaine, onEdit, onDelete }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onEdit(domaine)}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400">ID {domaine.id}</span>
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit(domaine)}
          className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition" title="Modifier">
          <FaEdit size={14} className="text-blue-600" />
        </button>
        <button onClick={() => onDelete(domaine)}
          className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition" title="Supprimer">
          <FaTrash size={14} className="text-red-600" />
        </button>
      </div>
    </div>
    <div className="space-y-2">
      <div>
        <p className="text-xs text-gray-400">Domaine</p>
        <p className="text-sm font-semibold text-gray-900">{domaine.label}</p>
      </div>
      <div className="border-t border-gray-100 pt-2">
        <p className="text-xs text-gray-400">Description</p>
        <p className="text-sm text-gray-700 line-clamp-2">{domaine.description}</p>
      </div>
    </div>
  </div>
);

// ── Export ───────────────────────────────────────────────────────────────
const exportToExcel = (data) => {
  const worksheetData = [
    ['ID', 'DOMAINE', 'DESCRIPTION'],
    ...data.map(d => [d.id, d.label, d.description])
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(wb, ws, 'Domaines');
  XLSX.writeFile(wb, `domaines_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportToPDF = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('LISTE DES DOMAINES', 14, 20);
  const tableData = data.map(d => [d.id.toString(), d.label, d.description]);
  autoTable(doc, {
    startY: 25,
    head: [['ID', 'Domaine', 'Description']],
    body: tableData,
  });
  doc.save(`domaines_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default function DomainesView() {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  
  const [formData, setFormData] = useState({ label: "", description: "" });

  const showToast = (message, type = "success") => {
    toast[type](message, { position: "top-right", autoClose: 3000, theme: "colored" });
  };

  const fetchDomaines = async () => {
    setLoading(true);
    try {
      const data = await getAllDomaines(searchTerm);
      setDomaines(data);
    } catch (error) {
      showToast("Erreur lors du chargement des domaines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDomaines(); }, []);

  useEffect(() => {
    if (loading) return;
    const delaySearch = setTimeout(async () => {
      try {
        const data = await getAllDomaines(searchTerm);
        setDomaines(data);
        setCurrentPage(1);
      } catch { showToast("Erreur lors de la recherche", "error"); }
    }, 400);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const sortedDomaines = useMemo(() => {
    const sortable = [...domaines];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [domaines, sortConfig]);

  const paginatedDomaines = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedDomaines.slice(start, start + perPage);
  }, [sortedDomaines, currentPage, perPage]);

  const totalItems = domaines.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);
  const hasFilter = !!searchTerm;

  const handleInputChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const isFormValid = () => formData.label.trim() !== "" && formData.description.trim() !== "";

  const handleOpenModal = (d = null) => {
    if (d) { setEditingId(d.id); setFormData({ label: d.label, description: d.description }); }
    else { setEditingId(null); setFormData({ label: "", description: "" }); }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!isFormValid()) return;
    setLoadingSave(true);
    try {
      if (editingId) {
        const updated = await updateDomaine(editingId, formData);
        setDomaines(domaines.map(d => d.id === editingId ? updated : d));
        showToast("Domaine modifié avec succès");
      } else {
        const created = await createDomaine(formData);
        setDomaines([...domaines, created]);
        showToast("Domaine ajouté avec succès");
      }
      setShowModal(false);
    } catch (error) { 
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
      showToast(message, "error"); 
    }
    finally { setLoadingSave(false); }
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteDomaine(deleteItem.id);
      setDomaines(domaines.filter(d => d.id !== deleteItem.id));
      showToast("Domaine supprimé avec succès");
      setDeleteItem(null);
    } catch (error) { showToast("Erreur lors de la suppression", "error"); }
    finally { setLoadingDelete(false); }
  };

  const requestSort = (key) => setSortConfig(prev => ({ 
    key, 
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' 
  }));

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <div className="inline-flex flex-col ml-1 opacity-30"><ChevronUp size={10} className="text-gray-500"/><ChevronDown size={10} className="-mt-1 text-gray-500"/></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp size={13} className="ml-1 text-blue-600"/> : <ChevronDown size={13} className="ml-1 text-blue-600"/>;
  };

  const handleExport = (type, data) => {
    if (type === 'excel') exportToExcel(data);
    else exportToPDF(data);
    showToast(`Export ${type.toUpperCase()} réussi !`);
  };

  return (
    <div className="min-h-screen bg-white p-0">
      <ToastContainer />
      {showModal && (
        <DomaineModal 
          isEditing={!!editingId} formData={formData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave} onChange={handleInputChange}
          loadingSave={loadingSave} isFormValid={isFormValid}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          title="Suppression"
          message={`Voulez-vous vraiment supprimer le domaine "${deleteItem.label}" ?`}
          confirmText="Supprimer" confirmColor="red"
          onConfirm={handleConfirmDelete} onClose={() => setDeleteItem(null)}
          loading={loadingDelete}
        />
      )}

      <div className="max-w-screen-2xl mx-auto space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">Gestion des domaines</h1>
            <p className="text-xs sm:text-sm text-gray-500">{totalItems} domaine{totalItems > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition">
            <FaPlus /> 
            <span className="hidden sm:inline">Ajouter un domaine</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                type="text" 
                placeholder="Rechercher un domaine..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-9 pr-12 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

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
                <span className="text-xs text-gray-500 sm:inline hidden">entrées</span>
              </div>
              <ExportMenu onExport={handleExport} filteredData={paginatedDomaines} />
            </div>
          </div>

          {/* Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('id')}>
                    <div className="flex items-center justify-center">ID {getSortIcon('id')}</div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('label')}>
                    <div className="flex items-center justify-center">Domaine {getSortIcon('label')}</div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="py-16 text-center text-gray-500">Chargement...</td></tr>
                ) : paginatedDomaines.map(d => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => handleOpenModal(d)}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-center">{d.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold truncate max-w-[200px]" title={d.label}>{d.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center max-w-xs truncate">{d.description}</td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-1">
                        <button onClick={() => handleOpenModal(d)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition"><FaEdit size={15}/></button>
                        <button onClick={() => setDeleteItem(d)} className="p-1.5 rounded hover:bg-red-100 text-red-600 transition"><FaTrash size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-3 space-y-3">
            {paginatedDomaines.map(d => (
              <DomaineCard key={d.id} domaine={d} onEdit={handleOpenModal} onDelete={setDeleteItem} />
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500">Affichage de {startItem} à {endItem} sur {totalItems} domaine{totalItems > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"><ChevronLeft size={15}/></button>
              <span className="text-xs font-medium px-2">Page {currentPage} sur {totalPages || 1}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"><ChevronRight size={15}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
