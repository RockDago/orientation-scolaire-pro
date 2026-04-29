import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaCog,
  FaTag,
  FaUniversity,
  FaBuilding,
  FaGlobe,
  FaChevronRight,
  FaLayerGroup,
  FaListAlt,
  FaUsers,
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

  const goTo = (path) => {
    navigate(path);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isLinkActive = (path) => location.pathname === path;

  const isSettingsChildActive = () => {
    const settingsPaths = [
      "/dashboard/admin/parametres/serie",
      "/dashboard/admin/parametres/domaine",
      "/dashboard/admin/parametres/mention",
      "/dashboard/admin/parametres/parcours",
      "/dashboard/admin/parametres/metier",
      "/dashboard/admin/parametres/etablissement",
    ];
    return settingsPaths.some((path) => location.pathname === path);
  };



  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass = "bg-blue-50 dark:bg-neutral-800/50 text-blue-600 dark:text-blue-400";
  const inactiveClass = "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white";
  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer pl-11";

  const settingsItems = [
    {
      label: "Series",
      path: "/dashboard/admin/parametres/serie",
      icon: FaListAlt,
    },
    {
      label: "Domaines",
      path: "/dashboard/admin/parametres/domaine",
      icon: FaGlobe,
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
      label: "Metiers",
      path: "/dashboard/admin/parametres/metier",
      icon: FaBuilding,
    },
    {
      label: "Etablissement",
      path: "/dashboard/admin/parametres/etablissement",
      icon: FaUniversity,
    },
  ];

  const effectiveIsOpen =
    settingsOpen || (isSettingsChildActive() && !collapsed);

  return (
    <>


      {/* Overlay mobile pour la Sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-white dark:bg-neutral-900
          z-50 border-r border-gray-100 dark:border-neutral-800
          shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Logo & Actions */}
        <div className="h-24 flex items-center justify-center px-6 border-b border-gray-50 dark:border-neutral-800 relative">
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
            className={`p-2 rounded-lg text-gray-400 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-neutral-800/40 transition-colors ${
              !collapsed ? "absolute right-4" : "mx-auto"
            }`}
            title={collapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
          >
            <FaBars />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 dark:text-neutral-400 hover:text-red-500 absolute right-4"
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
              location.pathname === "/dashboard/admin" ? activeClass : inactiveClass
            }`}
            title={collapsed ? "Tableau de bord" : ""}
          >
            <div className="flex items-center gap-3">
              <FaTachometerAlt
                className={`text-lg flex-shrink-0 ${
                  location.pathname === "/dashboard/admin"
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

          {/* Utilisateurs */}
          <div
            onClick={() => goTo("/dashboard/admin/utilisateurs")}
            className={`${baseItemClass} ${
              location.pathname === "/dashboard/admin/utilisateurs" ? activeClass : inactiveClass
            }`}
            title={collapsed ? "Utilisateurs" : ""}
          >
            <div className="flex items-center gap-3">
              <FaUsers
                className={`text-lg flex-shrink-0 ${
                  location.pathname === "/dashboard/admin/utilisateurs"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && <span>Utilisateurs</span>}
            </div>
          </div>
        </nav>
        
        {/* Footer Copyright */}
        <div className={`px-6 py-6 border-t border-gray-50 dark:border-neutral-800 transition-opacity duration-300 ${collapsed ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-relaxed text-center">
            © 2026 MESUPRES
            Tous droits réservés
          </p>
        </div>


      </aside>
    </>
  );
};

export default Sidebar;
