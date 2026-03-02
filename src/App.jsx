// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InstallPWA from './InstallPWA.jsx';

// Importation de toutes vos pages
import LoadingPage from './pages/acceuil/loadingPage.jsx';
import Acceuil from './pages/acceuil/acceuil.jsx';
import Login from './pages/auth/login.jsx';
import DashboardAdmin from './pages/dashboard/dashboardadmin.jsx';

// Composant de contenu temporaire pour le Dashboard
const DashboardHome = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Aperçu Général</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">Stats 1</div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">Stats 2</div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">Stats 3</div>
    </div>
  </div>
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route racine : affiche le loading, qui redirigera lui-même vers /acceuil */}
          <Route path="/" element={<LoadingPage />} />
          
          {/* La vraie page d'accueil de l'application */}
          <Route path="/acceuil" element={<Acceuil />} />
          
          {/* Page de connexion */}
          <Route path="/login" element={<Login />} />

          {/* Espace Dashboard Administrateur */}
          <Route path="/dashboard" element={<DashboardAdmin />}>
            <Route index element={<DashboardHome />} />
          </Route>
          
          {/* Page 404 : Si l'utilisateur tape une URL qui n'existe pas */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600">Page introuvable</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>

      {/* Toast PWA global */}
      <InstallPWA />
    </>
  );
}

export default App;
