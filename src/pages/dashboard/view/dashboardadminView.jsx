// src/pages/dashboard/dashboardadmin.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './navbar/navbar.jsx';
import Sidebar from './sidebar/sidebar.jsx';

const DashboardAdmin = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Menu latéral fixe à gauche */}
      <Sidebar />
      
      {/* Conteneur principal à droite */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barre de navigation en haut */}
        <Navbar />
        
        {/* Contenu de la page (défilable) */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* L'Outlet affichera le contenu spécifique des sous-routes du dashboard */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
