// src/pages/dashboard/sidebar/sidebar.jsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800 h-16 flex items-center">
        <h1 className="text-lg font-bold text-white">Orientation</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="block px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-200 hover:text-white">
          Accueil Dashboard
        </Link>
        {/* Ajoutez d'autres liens ici plus tard */}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
