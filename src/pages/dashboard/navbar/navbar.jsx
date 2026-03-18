import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaUser,
  FaBars,
  FaChevronDown,
  FaSun,
} from "react-icons/fa";

const Navbar = ({ collapsed, user, onMobileMenuClick }) => {
  const { uuid } = useParams();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const userData = user || {
    name: "Admin",
    prenom: "Admin",
    nom: "Utilisateur",
    email: "admin@example.com",
    role: "admin"
  };

  const formatRole = (role) => {
    if (!role) return "Administrateur";
    const roleLabels = {
      Admin: "Administrateur",
      admin: "Administrateur",
      Requerant: "Requérant",
      Etablissement: "Établissement",
      SAE: "Service SAE",
      SICP: "Service SICP",
      CNH: "Service CNH",
      Expert: "Expert Évaluateur",
      Universite: "Université",
    };
    return roleLabels[role] || role;
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }, []);

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
      className="fixed top-0 right-0 h-16 md:h-20 bg-white shadow-sm z-30 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 transition-all duration-300 text-gray-900"
      style={{ left: window.innerWidth >= 1024 ? (collapsed ? "5rem" : "18rem") : "0" }}
    >
      <div className="absolute inset-0 pointer-events-none lg:hidden" />
      
      {/* Menu mobile */}
      <div className="flex items-center">
        <button 
          onClick={onMobileMenuClick} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      
      <div className="flex-1" />

      <div className="flex items-center space-x-3 md:space-x-6">
        {/* ================== PROFIL ================== */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
              <span className="font-bold text-xs">
                {userData.prenom?.[0]?.toUpperCase() || userData.nom?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-700">
                {userData.prenom || userData.nom || "Admin"}
              </div>
              <div className="text-[10px] text-gray-500">
                {formatRole(userData.role)}
              </div>
            </div>
            <FaChevronDown 
              className={`text-gray-400 text-xs hidden md:block transition-transform duration-200 ${
                showProfileMenu ? "rotate-180" : ""
              }`} 
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2">
              {/* En-tête du profil */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-sm text-gray-800">
                  {userData.prenom || ""} {userData.nom || ""}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {userData.email || "admin@example.com"}
                </p>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">
                  {formatRole(userData.role)}
                </p>
              </div>
              
              {/* Lien vers la page de profil */}
              <Link 
                to={`/dashboard/admin/profile/${uuid}`} 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100"
              >
                <FaUser className="text-sm" />
                <span>Mon Profil</span>
              </Link>
              
              {/* Indication du mode clair dans le menu profil */}
              <div className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-500">
                <FaSun className="text-sm text-yellow-500" />
                <span>Clair</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;