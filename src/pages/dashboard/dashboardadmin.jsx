import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import Navbar from './navbar/navbar.jsx';
import Sidebar from './sidebar/sidebar.jsx';

const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Données utilisateur enrichies pour le développement
  const user = {
    prenom: "Admin",
    nom: "Administrateur",
    email: "admin@orientation.local",
    role: "admin",
    telephone: "+261 34 12 345 67",
    dateInscription: "01 Janvier 2025",
    derniereConnexion: "Aujourd'hui à 09:30",
    statistiques: {
      connexions: 45,
      modifications: 5,
      statut: "Actif"
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* CONTENU PRINCIPAL (décalé par la sidebar) */}
      <div
        className={`
          flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:ml-20" : "lg:ml-72"}
          ml-0
        `}
      >
        {/* NAVBAR */}
        <div className="h-20">
          <Navbar
            collapsed={collapsed}
            user={user}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* ZONE DE CONTENU */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 pt-6 pb-10 md:pb-12 bg-white text-gray-900">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;