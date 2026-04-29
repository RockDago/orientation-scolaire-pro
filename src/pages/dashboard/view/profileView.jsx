// src/pages/dashboard/view/profileView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaClock,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaLock,
  FaSave,
  FaUserCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { 
  Download, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  X
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getProfile,
  updateProfile,
  getLocalUser,
} from "../../../services/profile.services";

// Badges
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

// FloatInput
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

// BtnPrimary
const BtnPrimary = ({ onClick, children, loading, disabled, type = "button", icon: Icon }) => (
  <button 
    type={type}
    onClick={onClick} 
    disabled={disabled || loading}
    className={`px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Chargement...</span>
      </>
    ) : (
      <>
        {Icon && <Icon size={15} className="text-white" />}
        {children}
      </>
    )}
  </button>
);

const BtnSecondary = ({ onClick, children, disabled, type = "button" }) => (
  <button 
    type={type}
    onClick={onClick} 
    disabled={disabled}
    className={`px-3 sm:px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const BtnEdit = ({ onClick, children, isEditing }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
      isEditing 
        ? "text-red-600 hover:bg-red-50" 
        : "text-blue-600 hover:bg-blue-50"
    }`}
  >
    {isEditing ? <FaTimes size={12} /> : <FaEdit size={12} />}
    {children}
  </button>
);

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [previewImage, setPreviewImage] = useState(null);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

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

  // Charger le profil depuis l'API au montage du composant
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Essayer d'abord depuis le localStorage pour un affichage immédiat
        const localUser = getLocalUser();
        if (localUser) setUserData(localUser);

        // Puis récupérer la version fraîche depuis l'API
        const apiUser = await getProfile();
        setUserData(apiUser);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token invalide, rediriger vers login
          setAuthError(true);
          showToast("Session expirée, veuillez vous reconnecter", "error");
          navigate("/login");
          return;
        }
        showToast("Impossible de charger le profil", "error");
        console.error("Erreur chargement profil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);


  const tabs = [
    { key: "personal", label: "Informations personnelles" },
    { key: "security", label: "Sécurité" },
  ];

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  if (!userData && !authError) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <span className="text-sm text-gray-500">Profil introuvable.</span>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white p-0">
      <ToastContainer />

       <div className="max-w-screen-2xl mx-auto space-y-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">

        {/* En-tête du profil */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">
          <div className="flex items-start gap-4 flex-wrap sm:items-center sm:gap-5">
            <div>
              <div className="relative inline-block">
                <div className="w-[clamp(64px,9vw,82px)] h-[clamp(64px,9vw,82px)] rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-white">
                      {userData.prenom?.[0]}
                      {userData.nom?.[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informations utilisateur */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold text-gray-900 m-0">
                  {userData.nom} {userData.prenom} 
                </h1>
          
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <FaUserCircle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  @{userData.nom_utilisateur}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-sm shadow-green-500/20" />
                <span className="text-xs text-gray-500">En ligne</span>
              </div>

              {userData.adresse && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {userData.adresse}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carte principale avec onglets */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Navigation par onglets */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white px-3 sm:px-5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 sm:px-5 sm:py-3.5 ${
                  activeTab === tab.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu de l'onglet */}
          <div className="p-4 sm:p-5 lg:p-6">
            {activeTab === "personal" && (
              <PersonalInfoForm
                userData={userData}
                setUserData={setUserData}
                showToast={showToast}
              />
            )}
            {activeTab === "security" && (
              <SecurityForm userData={userData} showToast={showToast} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Informations Personnelles
const PersonalInfoForm = ({ userData, setUserData, showToast }) => {
  const [editInfo, setEditInfo] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const [formData, setFormData] = useState({
    username: userData.nom_utilisateur || "",
    nom: userData.nom || "",
    prenom: userData.prenom || "",
    email: userData.email || "",
    telephone: userData.telephone || "",
    code_postal: userData.code_postal || "",
    adresse: userData.adresse || "",
    role: userData.role || "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInfoForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = "Requis";
    if (!formData.nom.trim()) newErrors.nom = "Requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!validateInfoForm()) return;
    setLoadingInfo(true);
    try {
      const updated = await updateProfile(formData);
      setUserData(updated);
      showToast("Informations mises à jour avec succès", "success");
      setEditInfo(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      showToast(message, "error");
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!validateContactForm()) return;
    setLoadingContact(true);
    try {
      const updated = await updateProfile(formData);
      setUserData(updated);
      showToast("Contacts mis à jour avec succès", "success");
      setEditContact(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      showToast(message, "error");
    } finally {
      setLoadingContact(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Informations personnelles */}
      <form onSubmit={handleSubmitInfo}>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              Informations personnelles
            </h3>
            <BtnEdit
              onClick={() => {
                setEditInfo(!editInfo);
                setErrors({});
              }}
              isEditing={editInfo}
            >
              {editInfo ? "Annuler" : "Modifier"}
            </BtnEdit>
          </div>

          {!editInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Nom d'utilisateur
                </label>
                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                  <FaUserCircle className="text-gray-400" size={12} />
                  {userData.nom_utilisateur || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Rôle
                </label>
                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                  <FaUserTag className="text-gray-400" size={12} />
                  <Pill tone="blue">{userData.role || "—"}</Pill>
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Nom
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.nom || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Prénom
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.prenom || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Adresse
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.adresse || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Code postal
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.code_postal || "—"}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mb-4">
              <FloatInput
                id="username"
                name="username"
                label="Nom d'utilisateur *"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
              />
              <div className="relative">
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer cursor-not-allowed"
                  disabled
                  placeholder=" "
                />
                <label className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 text-gray-500">
                  Rôle
                </label>
              </div>
              <FloatInput
                id="nom"
                name="nom"
                label="Nom *"
                value={formData.nom}
                onChange={handleInputChange}
                error={errors.nom}
              />
              <FloatInput
                id="prenom"
                name="prenom"
                label="Prénom *"
                value={formData.prenom}
                onChange={handleInputChange}
                error={errors.prenom}
              />
              <FloatInput
                id="adresse"
                name="adresse"
                label="Adresse"
                value={formData.adresse}
                onChange={handleInputChange}
              />
              <FloatInput
                id="code_postal"
                name="code_postal"
                label="Code postal"
                value={formData.code_postal}
                onChange={handleInputChange}
              />
            </div>
          )}

          {editInfo && (
            <div className="flex justify-end gap-2.5 mt-5">
              <BtnSecondary
                onClick={() => {
                  setEditInfo(false);
                  setErrors({});
                }}
              >
                Annuler
              </BtnSecondary>
              <BtnPrimary
                type="submit"
                loading={loadingInfo}
                disabled={loadingInfo}
                icon={FaSave}
              >
                Enregistrer
              </BtnPrimary>
            </div>
          )}
        </div>
      </form>

      {/* Section Contacts */}
      <form onSubmit={handleSubmitContact}>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              Contacts
            </h3>
            <BtnEdit
              onClick={() => {
                setEditContact(!editContact);
                setErrors({});
              }}
              isEditing={editContact}
            >
              {editContact ? "Annuler" : "Modifier"}
            </BtnEdit>
          </div>

          <div className="space-y-4">
            {/* Téléphone */}
            <div className="flex items-start gap-3 py-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaPhone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Téléphone
                </div>
                {editContact ? (
                  <FloatInput
                    id="telephone"
                    name="telephone"
                    label="Téléphone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {userData.telephone || "—"}
                    </span>
                    {userData.telephone && (
                      <span className="w-[18px] h-[18px] bg-green-600 rounded-full inline-flex items-center justify-center text-white text-[10px]">
                        <FaCheck size={8} />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 py-3">
              <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Email
                </div>
                {editContact ? (
                  <FloatInput
                    id="email"
                    name="email"
                    label="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {userData.email || "—"}
                    </span>
                    <span className="w-[18px] h-[18px] bg-green-600 rounded-full inline-flex items-center justify-center text-white text-[10px]">
                      <FaCheck size={8} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editContact && (
            <div className="flex justify-end gap-2.5 mt-5">
              <BtnSecondary
                onClick={() => {
                  setEditContact(false);
                  setErrors({});
                }}
              >
                Annuler
              </BtnSecondary>
              <BtnPrimary
                type="submit"
                loading={loadingContact}
                disabled={loadingContact}
                icon={FaSave}
              >
                Enregistrer
              </BtnPrimary>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// Composant Sécurité
const SecurityForm = ({ showToast }) => {
  const [passwords, setPasswords] = useState({
    passwordCurrent: "",
    passwordNew: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loadingPassword, setLoadingPassword] = useState(false);

  const passwordCriteria = [
    { key: "minLength", regex: /.{8,}/, label: "8 caractères" },
    { key: "uppercase", regex: /[A-Z]/, label: "Majuscule" },
    { key: "lowercase", regex: /[a-z]/, label: "Minuscule" },
    { key: "digit", regex: /\d/, label: "Chiffre" },
    {
      key: "validSymbols",
      regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      label: "Symbole",
    },
  ];

  const validatePasswordCriteria = (p) => ({
    minLength: /.{8,}/.test(p),
    uppercase: /[A-Z]/.test(p),
    lowercase: /[a-z]/.test(p),
    digit: /\d/.test(p),
    validSymbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  });

  const passwordValidation = validatePasswordCriteria(passwords.passwordNew);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    passwords.passwordNew === passwords.passwordConfirm &&
    passwords.passwordConfirm !== "";
  const passwordsDontMatch =
    passwords.passwordNew !== "" &&
    passwords.passwordConfirm !== "" &&
    passwords.passwordNew !== passwords.passwordConfirm;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwords.passwordCurrent.trim()) newErrors.passwordCurrent = "Requis";
    if (!passwords.passwordNew.trim()) newErrors.passwordNew = "Requis";
    else if (!isPasswordValid) newErrors.passwordNew = "Mot de passe faible";
    if (!passwords.passwordConfirm.trim()) newErrors.passwordConfirm = "Requis";
    else if (passwords.passwordNew !== passwords.passwordConfirm)
      newErrors.passwordConfirm = "Ne correspond pas";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoadingPassword(true);
    try {
      const { changePassword } =
        await import("../../../services/profile.services");
      await changePassword(passwords.passwordCurrent, passwords.passwordNew);
      showToast("Mot de passe mis à jour avec succès", "success");
      setPasswords({
        passwordCurrent: "",
        passwordNew: "",
        passwordConfirm: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur lors du changement de mot de passe";
      showToast(message, "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const PasswordInput = ({ field, label, visKey }) => (
    <div className="relative">
      <input
        type={showPassword[visKey] ? "text" : "password"}
        name={field}
        value={passwords[field]}
        onChange={handlePasswordChange}
        className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-white border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
          ${errors[field] ? "border-red-500" : "border-gray-300 focus:border-blue-600"}`}
        placeholder=" "
      />
      <label
        htmlFor={field}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
          ${errors[field] ? "text-red-500" : "text-gray-500 peer-focus:text-blue-600"}`}
      >
        {label}
      </label>
      <button
        type="button"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        onClick={() => togglePasswordVisibility(visKey)}
      >
        {showPassword[visKey] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
      {errors[field] && (
        <p className="text-[10px] text-red-500 absolute -bottom-5 left-0">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mot de passe */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Changer le mot de passe
        </h3>

        <div className="space-y-5">
          <PasswordInput
            field="passwordCurrent"
            label="Mot de passe actuel *"
            placeholder="Entrez votre mot de passe actuel"
            visKey="current"
          />

          <PasswordInput
            field="passwordNew"
            label="Nouveau mot de passe *"
            placeholder="Minimum 8 caractères"
            visKey="new"
          />

          <PasswordInput
            field="passwordConfirm"
            label="Confirmer le nouveau mot de passe *"
            placeholder="Répétez le nouveau mot de passe"
            visKey="confirm"
          />
        </div>

        {/* Critères de sécurité */}
        <div className="mt-5">
          <label className="block text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Critères de sécurité
          </label>
          <div className="flex flex-wrap gap-2">
            {passwordCriteria.map((item) => {
              const met = passwordValidation[item.key];
              return (
                <span
                  key={item.key}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                    met
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-gray-50 text-gray-400 border border-gray-200"
                  }`}
                >
                  <FaCheck size={7} /> {item.label}
                </span>
              );
            })}
          </div>
          {passwordsMatch && (
            <p className="text-[11px] text-green-600 mt-2 flex items-center gap-1">
              <FaCheck size={10} /> Les mots de passe correspondent.
            </p>
          )}
          {passwordsDontMatch && (
            <p className="text-[11px] text-red-500 mt-2">
              Les mots de passe ne correspondent pas.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <BtnPrimary
            type="submit"
            loading={loadingPassword}
            disabled={loadingPassword}
            icon={FaLock}
          >
            Mettre à jour
          </BtnPrimary>
        </div>
      </div>
    </form>
  );
};

export default ProfileView;
