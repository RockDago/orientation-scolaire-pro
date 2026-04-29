import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaExclamationCircle,
} from "react-icons/fa";

const Navbar = ({ collapsed, user, onMobileMenuClick }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  const profileRef = useRef(null);
  const userData = user || {
    prenom: "",
    nom: "Admin",
    email: "",
    role: "admin",
  };

  const formatRole = (role) => {
    if (!role) return "Administrateur";
    const roleLabels = {
      Admin: "Administrateur",
      admin: "Administrateur",
    };
    return roleLabels[role] || "Administrateur";
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);

    const savedEmail = localStorage.getItem("savedEmail");
    const rememberMe = localStorage.getItem("rememberMe");
    const visitorId = localStorage.getItem("osp_visitor_id");
    const darkMode = localStorage.getItem("darkMode");

    localStorage.clear();
    sessionStorage.clear();

    if (savedEmail) localStorage.setItem("savedEmail", savedEmail);
    if (rememberMe) localStorage.setItem("rememberMe", rememberMe);
    if (visitorId) localStorage.setItem("osp_visitor_id", visitorId);
    if (darkMode !== null) localStorage.setItem("darkMode", darkMode);

    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 md:h-20 bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-neutral-800 transition-all duration-300 text-gray-900 dark:text-neutral-100 ${
        showLogoutModal ? "z-[60]" : "z-30"
      }`}
      style={{ left: window.innerWidth >= 1024 ? (collapsed ? "5rem" : "18rem") : "0" }}
    >
      <div className="absolute inset-0 pointer-events-none lg:hidden" />

      <div className="flex items-center">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="p-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center space-x-3 md:space-x-6">


        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800 transition-all"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
              <span className="font-bold text-xs">
                {userData.prenom?.[0]?.toUpperCase() || userData.nom?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-700 dark:text-neutral-100">
                {userData.prenom || userData.nom || "Admin"}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-neutral-400">
                {formatRole(userData.role)}
              </div>
            </div>
            <FaChevronDown
              className={`text-gray-400 dark:text-neutral-400 text-xs hidden md:block transition-transform duration-200 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-800 z-50 overflow-hidden py-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                <p className="font-semibold text-sm text-gray-800 dark:text-neutral-100">
                  {userData.prenom || ""} {userData.nom || ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
                  {userData.email || ""}
                </p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-1">
                  {formatRole(userData.role)}
                </p>
              </div>

              <Link
                to="/dashboard/admin/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-neutral-800/40 hover:text-blue-600 transition-colors border-b border-gray-100 dark:border-neutral-800"
              >
                <FaUser className="text-sm" />
                <span>Mon Profil</span>
              </Link>



              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="flex w-full items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-gray-100 dark:border-neutral-800"
              >
                {isDarkMode ? (
                  <FaSun className="text-sm text-yellow-500" />
                ) : (
                  <FaMoon className="text-sm text-neutral-500" />
                )}
                <span>{isDarkMode ? "Mode Clair" : "Mode Sombre"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowLogoutModal(true);
                }}
                className="flex w-full items-center space-x-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL DE CONFIRMATION DE DÉCONNEXION ─── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-neutral-800">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
                Déconnexion
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Êtes-vous sûr de vouloir vous déconnecter de votre session d'administration ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-neutral-800 border-t border-gray-100 dark:border-neutral-800">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm shadow-red-500/30 transition-all active:scale-95"
              >
                Oui, déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
