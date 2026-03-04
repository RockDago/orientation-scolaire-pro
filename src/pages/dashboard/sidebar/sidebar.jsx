import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCog,
  FaTag,
  FaUniversity,
  FaBuilding,
  FaGlobe,
  FaChevronRight,
  FaExclamationCircle,
  FaLayerGroup,
  FaListAlt,
} from "react-icons/fa";
import logo from "../../../assets/logo.jpeg";

const Sidebar = ({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const goTo = (path) => {
    navigate(path);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isLinkActive = (path) => location.pathname === path;

  const isSettingsChildActive = () => {
    const settingsPaths = [
      "/dashboard/admin/parametres/serie",
      "/dashboard/admin/parametres/mention",
      "/dashboard/admin/parametres/parcours",
      "/dashboard/admin/parametres/metier",
      "/dashboard/admin/parametres/etablissement",
    ];
    return settingsPaths.some((path) => location.pathname === path);
  };


  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass = "bg-blue-50 text-blue-600";
  const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer pl-11";

  const settingsItems = [
    {
      label: "Séries",
      path: "/dashboard/admin/parametres/serie",
      icon: FaListAlt,
    },
    {
      label: "Mentions",
      path: "/dashboard/admin/parametres/mention",
      icon: FaTag,
    },
    {
      label: "Parcours",
      path: "/dashboard/admin/parametres/parcours",
      icon: FaLayerGroup,
    },
    {
      label: "Métiers",
      path: "/dashboard/admin/parametres/metier",
      icon: FaBuilding,
    },
    {
      label: "Établissements",
      path: "/dashboard/admin/parametres/etablissement",
      icon: FaUniversity,
    },
  ];

  const effectiveIsOpen =
    settingsOpen || (isSettingsChildActive() && !collapsed);

  return (
    <>
      {/* ─── MODAL DE CONFIRMATION DE DÉCONNEXION ─── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Déconnexion
              </h3>
              <p className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir vous déconnecter de votre session
                d'administration ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm shadow-red-500/30 transition-all active:scale-95"
              >
                Oui, me déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay mobile pour la Sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-white
          z-50 border-r border-gray-100
          shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Logo & Actions */}
        <div className="h-24 flex items-center justify-center px-6 border-b border-gray-50 relative">
          {!collapsed && (
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <img
                src={logo}
                alt="Logo Orientation"
                className="h-16 w-auto object-contain"
              />
            </Link>
          )}

          {/* Bouton toggle pour ouvrir/fermer la sidebar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
              !collapsed ? "absolute right-4" : "mx-auto"
            }`}
            title={collapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
          >
            <FaBars />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-red-500 absolute right-4"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Tableau de bord */}
          <div
            onClick={() => goTo("/dashboard/admin")}
            className={`${baseItemClass} ${
              isLinkActive("/dashboard/admin") ? activeClass : inactiveClass
            }`}
            title={collapsed ? "Tableau de bord" : ""}
          >
            <div className="flex items-center gap-3">
              <FaTachometerAlt
                className={`text-lg flex-shrink-0 ${
                  isLinkActive("/dashboard/admin")
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && <span>Tableau de bord</span>}
            </div>
          </div>

          {/* Paramètres avec accordéon */}
          <div>
            <div
              onClick={() => {
                if (collapsed) setCollapsed(false);
                setSettingsOpen(!settingsOpen);
              }}
              className={`${baseItemClass} ${isSettingsChildActive() ? activeClass : inactiveClass}`}
              title={collapsed ? "Paramètres" : ""}
            >
              <div className="flex items-center gap-3">
                <FaCog
                  className={`text-lg flex-shrink-0 ${
                    isSettingsChildActive()
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {!collapsed && <span>Paramètres</span>}
              </div>
              {!collapsed && (
                <FaChevronRight
                  className={`text-xs text-gray-400 transition-transform duration-200 ${
                    effectiveIsOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </div>

            {/* Sous-menu Paramètres réorganisé */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                effectiveIsOpen && !collapsed
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {settingsItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => goTo(item.path)}
                  className={`${subItemClass} ${
                    location.pathname === item.path
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : ""
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-3 ${
                      location.pathname === item.path
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="flex items-center gap-2">
                    <item.icon className="text-sm" />
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Déconnexion Stylée */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`
              w-full flex items-center py-3 rounded-xl text-sm font-semibold transition-all group
              ${
                collapsed
                  ? "justify-center px-0 hover:bg-red-50 text-gray-400"
                  : "justify-start px-4 gap-3 bg-white border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              }
            `}
            title={collapsed ? "Déconnexion" : ""}
          >
            <FaSignOutAlt
              className={`text-lg transition-colors ${collapsed ? "group-hover:text-red-500" : "text-gray-400 group-hover:text-red-500"}`}
            />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;