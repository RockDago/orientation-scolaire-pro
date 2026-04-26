import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaUser,
} from "react-icons/fa";

const Navbar = ({ collapsed, user, onMobileMenuClick }) => {
  const { uuid } = useParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  return (
    <header
      className="fixed top-0 right-0 h-16 md:h-20 bg-white dark:bg-zinc-900 shadow-sm z-30 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-zinc-700 transition-all duration-300 text-gray-900 dark:text-zinc-100"
      style={{ left: window.innerWidth >= 1024 ? (collapsed ? "5rem" : "18rem") : "0" }}
    >
      <div className="absolute inset-0 pointer-events-none lg:hidden" />

      <div className="flex items-center">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center space-x-3 md:space-x-6">
        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
              <span className="font-bold text-xs">
                {userData.prenom?.[0]?.toUpperCase() || userData.nom?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-700 dark:text-zinc-100">
                {userData.prenom || userData.nom || "Admin"}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                {formatRole(userData.role)}
              </div>
            </div>
            <FaChevronDown
              className={`text-gray-400 dark:text-zinc-400 text-xs hidden md:block transition-transform duration-200 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 z-50 overflow-hidden py-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
                <p className="font-semibold text-sm text-gray-800 dark:text-zinc-100">
                  {userData.prenom || ""} {userData.nom || ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                  {userData.email || ""}
                </p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-1">
                  {formatRole(userData.role)}
                </p>
              </div>

              <Link
                to={`/dashboard/admin/profile/${uuid}`}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-800/40 hover:text-blue-600 transition-colors border-b border-gray-100 dark:border-zinc-700"
              >
                <FaUser className="text-sm" />
                <span>Mon Profil</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="flex w-full items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {isDarkMode ? (
                  <FaSun className="text-sm text-yellow-500" />
                ) : (
                  <FaMoon className="text-sm text-zinc-500" />
                )}
                <span>{isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
