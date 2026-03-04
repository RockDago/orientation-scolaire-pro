import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstallPWA from "./InstallPWA.jsx";

import LoadingPage from "./pages/acceuil/loadingPage.jsx";
import Acceuil from "./pages/acceuil/acceuil.jsx";
import Login from "./pages/auth/login.jsx";
import DashboardAdmin from "./pages/dashboard/dashboardadmin.jsx";
import ProfileView from "./pages/dashboard/view/profileView.jsx";
import DashboardAdminView from "./pages/dashboard/view/dashboardadminView.jsx";
import MetiersView from "./pages/dashboard/view/metiersView.jsx";
import ParcoursView from "./pages/dashboard/view/parcoursView.jsx";
import MentionsView from "./pages/dashboard/view/mentionsView.jsx";
import SeriesView from "./pages/dashboard/view/seriesView.jsx";
import EtablissementsView from "./pages/dashboard/view/etablissementsView.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route racine : affiche le loading, qui redirigera lui-même vers /acceuil/orientation */}
          <Route path="/" element={<LoadingPage />} />

          {/* Toutes les routes de l'application d'orientation commencent par /acceuil */}
          <Route path="/acceuil/*" element={<Acceuil />} />

          {/* Page de connexion */}
          <Route path="/login" element={<Login />} />

          {/* Espace Dashboard Administrateur */}
          <Route path="/dashboard/admin" element={<DashboardAdmin />}>
            <Route index element={<DashboardAdminView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="parametres/metier" element={<MetiersView />} />
            <Route path="parametres/parcours" element={<ParcoursView />} />
            <Route path="parametres/mention" element={<MentionsView />} />
            <Route path="parametres/serie" element={<SeriesView />} />
            <Route
              path="parametres/etablissement"
              element={<EtablissementsView />}
            />
          </Route>

          {/* Page 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page introuvable</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Toast PWA global */}
      <InstallPWA />
    </>
  );
}

export default App;
