// src/pages/dashboard/view/usersView.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import {
  FaPlus, FaTrash, FaSearch,
  FaExclamationTriangle, FaUserShield, FaUser, FaEdit, FaKey, FaUserCheck, FaUserTimes, FaLock
} from "react-icons/fa";
import { 
  Download, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  X, Mail, Phone, MapPin
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  resetUserPassword,
  deleteUser,
} from "../../../services/user.services";
import { FaEye, FaEyeSlash, FaCheck, FaTimes as FaTimesCircle } from "react-icons/fa";

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
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col border border-gray-100">
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

// ── Password Criteria ────────────────────────────────────────────────────────
const PASSWORD_CRITERIA = [
  { key: "minLength", regex: /.{8,}/, label: "8+ caractères" },
  { key: "uppercase", regex: /[A-Z]/, label: "Majuscule" },
  { key: "lowercase", regex: /[a-z]/, label: "Minuscule" },
  { key: "digit", regex: /\d/, label: "Chiffre" },
  { key: "special", regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, label: "Symbole" },
];

const validatePassword = (pass) => {
  return {
    minLength: /.{8,}/.test(pass),
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    digit: /\d/.test(pass),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
  };
};

// ── Modale Utilisateur ───────────────────────────────────────────────────────────
const UserModal = ({ formData, isEditing, onClose, onSubmit, onChange, loadingSave, isFormValid }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };

  const passValidation = validatePassword(formData.mot_de_passe);
  const passMatch = formData.mot_de_passe === formData.confirmation_mot_de_passe && formData.confirmation_mot_de_passe !== "";

  return (
    <ModalShell
      title={isEditing ? "Modifier l'administrateur" : "Ajouter un administrateur"}
      icon={isEditing ? FaEdit : FaPlus}
      onClose={onClose}
      footer={<>
        <BtnCancel onClick={onClose} />
        <BtnPrimary onClick={handleSubmit} loading={loadingSave} disabled={!isFormValid()}>
          {isEditing ? "Enregistrer" : "Ajouter"}
        </BtnPrimary>
      </>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatInput 
            id="nom"
            name="nom"
            label="Nom *"
            value={formData.nom}
            onChange={(e) => onChange('nom')(e)}
          />
          <FloatInput 
            id="prenom"
            name="prenom"
            label="Prénom *"
            value={formData.prenom}
            onChange={(e) => onChange('prenom')(e)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatInput 
            id="nom_utilisateur"
            name="nom_utilisateur"
            label="Nom d'utilisateur *"
            value={formData.nom_utilisateur}
            onChange={(e) => onChange('nom_utilisateur')(e)}
          />
          <FloatInput 
            id="email"
            name="email"
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email')(e)}
          />
        </div>

        {!isEditing && (
          <>
            {/* Section Mot de passe - Uniquement à la création */}
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FloatInput 
                    id="mot_de_passe"
                    name="mot_de_passe"
                    label="Mot de passe *"
                    type={showPass ? "text" : "password"}
                    value={formData.mot_de_passe}
                    onChange={(e) => onChange('mot_de_passe')(e)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-[18px] text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>

                <div className="relative">
                  <FloatInput 
                    id="confirmation_mot_de_passe"
                    name="confirmation_mot_de_passe"
                    label="Confirmation *"
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmation_mot_de_passe}
                    onChange={(e) => onChange('confirmation_mot_de_passe')(e)}
                    error={formData.confirmation_mot_de_passe && !passMatch ? "Les mots de passe ne correspondent pas" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[18px] text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Critères de mot de passe */}
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Critères de sécurité</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {PASSWORD_CRITERIA.map(criterion => (
                    <div key={criterion.key} className="flex items-center gap-1.5">
                      {passValidation[criterion.key] ? (
                        <FaCheck size={10} className="text-green-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 border border-gray-300 rounded-full" />
                      )}
                      <span className={`text-[11px] font-medium ${passValidation[criterion.key] ? 'text-green-600' : 'text-gray-400'}`}>
                        {criterion.label}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {passMatch ? (
                        <FaCheck size={10} className="text-green-500" />
                      ) : (
                        <FaTimesCircle size={10} className={formData.confirmation_mot_de_passe ? "text-red-400" : "text-gray-300"} />
                      )}
                      <span className={`text-[11px] font-bold ${passMatch ? 'text-green-600' : 'text-gray-400'}`}>
                        Match
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </ModalShell>
  );
};

// ── Modale Réinitialisation Mot de Passe ──────────────────────────────────────
const ResetPasswordModal = ({ user, onClose, onSubmit, loading }) => {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const validation = validatePassword(pass);
  const isValid = Object.values(validation).every(Boolean);
  const isMatch = pass === confirm && confirm !== "";

  return (
    <ModalShell
      title={`Réinitialiser le mot de passe`}
      icon={FaKey}
      onClose={onClose}
      footer={<>
        <BtnCancel onClick={onClose} />
        <BtnPrimary onClick={() => onSubmit(pass)} loading={loading} disabled={!isValid || !isMatch}>
          Réinitialiser
        </BtnPrimary>
      </>}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Vous réinitialisez le mot de passe de <strong>{user.prenom} {user.nom}</strong>.
        </p>
        <div className="relative">
          <FloatInput 
            id="new_pass"
            label="Nouveau mot de passe *"
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[18px] text-gray-400">
            {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
        <FloatInput 
          id="confirm_pass"
          label="Confirmer le mot de passe *"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={confirm && !isMatch ? "Les mots de passe ne correspondent pas" : ""}
        />
        
        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Critères requis</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {PASSWORD_CRITERIA.map(criterion => (
                <div key={criterion.key} className="flex items-center gap-1.5">
                  {validation[criterion.key] ? <FaCheck size={10} className="text-green-500" /> : <div className="w-2.5 h-2.5 border border-gray-300 rounded-full" />}
                  <span className={`text-[11px] font-medium ${validation[criterion.key] ? 'text-green-600' : 'text-gray-400'}`}>{criterion.label}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
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

// ── Carte utilisateur — vue mobile ───────────────────────────────────────────────
const UserCard = ({ user, currentUserId, onEdit, onReset, onToggle, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
          {user.prenom[0]}{user.nom[0]}
        </div>
        <span className="text-xs font-bold text-gray-400">ID {user.id}</span>
      </div>
      <div className="flex items-center gap-1">
        {user.id === currentUserId ? (
          <span className="text-xs text-gray-400 italic px-2">Moi</span>
        ) : (
          <div className="flex gap-1">
            <button onClick={() => onEdit(user)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition" title="Modifier"><FaEdit size={14}/></button>
            <button onClick={() => onReset(user)} className="p-1.5 rounded hover:bg-amber-100 text-amber-600 transition" title="Mot de passe"><FaKey size={14}/></button>
            <button onClick={() => onToggle(user)} className={`p-1.5 rounded transition ${user.est_actif ? 'hover:bg-orange-100 text-orange-600' : 'hover:bg-green-100 text-green-600'}`} title={user.est_actif ? "Désactiver" : "Activer"}>
              {user.est_actif ? <FaUserTimes size={14}/> : <FaUserCheck size={14}/>}
            </button>
            <button onClick={() => onDelete(user)} className="p-1.5 rounded hover:bg-red-100 text-red-600 transition" title="Supprimer"><FaTrash size={14}/></button>
          </div>
        )}
      </div>
    </div>
    <div className="space-y-2">
      <div>
        <p className="text-xs text-gray-400">Nom & Prénom</p>
        <p className="text-sm font-semibold text-gray-900">{user.prenom} {user.nom}</p>
      </div>
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail size={12} className="text-gray-400" /> {user.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <FaUserShield size={12} className="text-blue-500" /> {user.role === 'admin' ? 'Administrateur' : user.role}
        </div>
        <div>
          {user.est_actif ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              Actif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
              Désactivé
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ── Export ───────────────────────────────────────────────────────────────
const exportToExcel = (data) => {
  const worksheetData = [
    ['ID', 'NOM', 'PRENOM', 'NOM UTILISATEUR', 'EMAIL', 'ROLE', 'TELEPHONE', 'ADRESSE'],
    ...data.map(u => [u.id, u.nom, u.prenom, u.nom_utilisateur, u.email, u.role, u.telephone, u.adresse])
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
  XLSX.writeFile(wb, `utilisateurs_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportToPDF = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('LISTE DES UTILISATEURS', 14, 20);
  const tableData = data.map(u => [u.id.toString(), `${u.prenom} ${u.nom}`, u.email, u.role]);
  autoTable(doc, {
    startY: 25,
    head: [['ID', 'Nom & Prénom', 'Email', 'Rôle']],
    body: tableData,
  });
  doc.save(`utilisateurs_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  
  const [formData, setFormData] = useState({ 
    nom: "", 
    prenom: "", 
    email: "", 
    mot_de_passe: "",
    confirmation_mot_de_passe: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  const showToast = (message, type = "success") => {
    toast[type](message, { position: "top-right", autoClose: 3000, theme: "colored" });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        showToast("Erreur lors du chargement des utilisateurs", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nom_utilisateur.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    const sortable = [...filteredUsers];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [filteredUsers, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedUsers.slice(start, start + perPage);
  }, [sortedUsers, currentPage, perPage]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  const handleInputChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const isFormValid = () => {
    if (editingId) {
      return formData.nom.trim() !== "" && formData.prenom.trim() !== "" && formData.nom_utilisateur.trim() !== "" && formData.email.trim() !== "";
    }
    const passValidation = validatePassword(formData.mot_de_passe);
    const isPassValid = Object.values(passValidation).every(Boolean);
    const isPassMatch = formData.mot_de_passe === formData.confirmation_mot_de_passe;

    return (
      formData.nom.trim() !== "" && 
      formData.prenom.trim() !== "" && 
      formData.nom_utilisateur.trim() !== "" && 
      formData.email.trim() !== "" && 
      isPassValid && 
      isPassMatch
    );
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        nom_utilisateur: user.nom_utilisateur,
        email: user.email,
        mot_de_passe: "",
        confirmation_mot_de_passe: ""
      });
    } else {
      setEditingId(null);
      setFormData({ 
        nom: "", 
        prenom: "", 
        nom_utilisateur: "", 
        email: "", 
        mot_de_passe: "",
        confirmation_mot_de_passe: ""
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!isFormValid()) return;
    setLoadingSave(true);
    try {
      if (editingId) {
        const updated = await updateUser(editingId, formData);
        setUsers(users.map(u => u.id === editingId ? updated : u));
        showToast("Utilisateur mis à jour");
      } else {
        const created = await createUser(formData);
        setUsers([created, ...users]);
        showToast("Utilisateur créé");
      }
      setShowModal(false);
    } catch (error) { 
      showToast(error.response?.data?.message || "Erreur", "error"); 
    } finally { setLoadingSave(false); }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.est_actif;
    try {
      await toggleUserStatus(user.id, newStatus);
      setUsers(users.map(u => u.id === user.id ? { ...u, est_actif: newStatus } : u));
      showToast(`Utilisateur ${newStatus ? 'activé' : 'désactivé'}`);
    } catch { showToast("Erreur statut", "error"); }
  };

  const handleResetPassword = async (newPass) => {
    setLoadingSave(true);
    try {
      await resetUserPassword(resettingUser.id, newPass);
      showToast("Mot de passe réinitialisé");
      setResettingUser(null);
    } catch { showToast("Erreur réinitialisation", "error"); }
    finally { setLoadingSave(false); }
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteUser(deleteItem.id);
      setUsers(users.filter(u => u.id !== deleteItem.id));
      showToast("Utilisateur supprimé avec succès");
      setDeleteItem(null);
    } catch (error) { 
        const message = error.response?.data?.message || "Erreur lors de la suppression";
        showToast(message, "error"); 
    }
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
    <div className="min-h-[100dvh] bg-white p-0">
      <ToastContainer />
      {showModal && (
        <UserModal 
          formData={formData}
          isEditing={!!editingId}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave} onChange={handleInputChange}
          loadingSave={loadingSave} isFormValid={isFormValid}
        />
      )}
      {resettingUser && (
        <ResetPasswordModal 
          user={resettingUser}
          onClose={() => setResettingUser(null)}
          onSubmit={handleResetPassword}
          loading={loadingSave}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          title="Suppression d'utilisateur"
          message={`Voulez-vous vraiment supprimer l'utilisateur "${deleteItem.prenom} ${deleteItem.nom}" ? Cette action est irréversible.`}
          confirmText="Supprimer" confirmColor="red"
          onConfirm={handleConfirmDelete} onClose={() => setDeleteItem(null)}
          loading={loadingDelete}
        />
      )}

      <div className="max-w-screen-2xl mx-auto space-y-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[clamp(1.125rem,2vw,1.5rem)] font-black text-gray-900 flex items-center gap-3">
               Gestion des Utilisateurs
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">{totalItems} utilisateur{totalItems > 1 ? 's' : ''} au total</p>
          </div>
          <button onClick={handleOpenModal} className="flex w-full sm:w-auto items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition">
            <FaPlus /> 
            <span>Ajouter un admin</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                type="text" 
                placeholder="Rechercher par nom, email, utilisateur..." 
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
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
              <ExportMenu onExport={handleExport} filteredData={sortedUsers} />
            </div>
          </div>

          {/* Table View */}
          <div className="hidden md:block overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('id')}>
                    <div className="flex items-center justify-center">ID {getSortIcon('id')}</div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('nom')}>
                    <div className="flex items-center justify-center">Utilisateur {getSortIcon('nom')}</div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('email')}>
                    <div className="flex items-center justify-center">Contact {getSortIcon('email')}</div>
                  </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-16 text-center text-gray-500">Chargement...</td></tr>
                ) : paginatedUsers.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-gray-500">Aucun utilisateur trouvé</td></tr>
                ) : paginatedUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium text-center">{u.id}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold text-gray-900">{u.prenom} {u.nom}</span>
                        <span className="text-xs text-gray-500">@{u.nom_utilisateur}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5"><Mail size={13} className="text-gray-400" /> {u.email}</span>
                        {u.telephone && <span className="text-xs text-gray-500 flex items-center gap-1.5"><Phone size={13} className="text-gray-400" /> {u.telephone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {u.role === 'admin' ? 'Administrateur' : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.est_actif ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Désactivé
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        {u.id === currentUser.id ? (
                           <span className="text-xs text-gray-400 italic px-2 self-center">Moi</span>
                        ) : (
                          <>
                            <button onClick={() => handleOpenModal(u)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition" title="Modifier"><FaEdit size={15}/></button>
                            <button onClick={() => setResettingUser(u)} className="p-1.5 rounded hover:bg-amber-100 text-amber-600 transition" title="Mot de passe"><FaKey size={15}/></button>
                            <button onClick={() => handleToggleStatus(u)} className={`p-1.5 rounded transition ${u.est_actif ? 'hover:bg-orange-100 text-orange-600' : 'hover:bg-green-100 text-green-600'}`} title={u.est_actif ? "Désactiver" : "Activer"}>
                              {u.est_actif ? <FaUserTimes size={15}/> : <FaUserCheck size={15}/>}
                            </button>
                            <button onClick={() => setDeleteItem(u)} className="p-1.5 rounded hover:bg-red-100 text-red-600 transition" title="Supprimer"><FaTrash size={15}/></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-3 space-y-3">
            {paginatedUsers.map(u => (
              <UserCard 
                key={u.id} 
                user={u} 
                currentUserId={currentUser.id} 
                onEdit={handleOpenModal}
                onReset={setResettingUser}
                onToggle={handleToggleStatus}
                onDelete={setDeleteItem}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500">Affichage de {startItem} à {endItem} sur {totalItems} utilisateur{totalItems > 1 ? 's' : ''}</span>
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
