import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useMemo, useState } from "react";
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
import DomainesView from "./pages/dashboard/view/domainesView.jsx";
import EtablissementsView from "./pages/dashboard/view/etablissementsView.jsx";
import UsersView from "./pages/dashboard/view/usersView.jsx";
import NotFound404 from "../src/pages/error/NotFound404.jsx";

const AuthContext = createContext(null);

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const decodeTokenPayload = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const clearAuthStorage = () => {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem("token");
    storage.removeItem("userRole");
    storage.removeItem("user");
  }
};

const getStoredSession = () => {
  const storages = [localStorage, sessionStorage];

  for (const storage of storages) {
    const token = storage.getItem("token");
    const user = safeParse(storage.getItem("user"));
    const role = storage.getItem("userRole") || user?.role || null;

    if (!token) continue;
    if (isTokenExpired(token)) {
      clearAuthStorage();
      return null;
    }

    if (!role) {
      clearAuthStorage();
      return null;
    }

    return { token, role, ...(user || {}) };
  }

  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredSession());

  const login = (token, role, rememberMe = false, userData = {}) => {
    clearAuthStorage();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("userRole", role);
    storage.setItem("user", JSON.stringify(userData));
    setUser({ token, role, ...userData });
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user?.token && !isTokenExpired(user.token),
      isAdmin: user?.role === "admin",
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/acceuil/orientation" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return children;
  return <Navigate to={isAdmin ? "/dashboard/admin" : "/acceuil/orientation"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/acceuil/*" element={<Acceuil />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardAdminView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="parametres/domaine" element={<DomainesView />} />
            <Route path="parametres/metier" element={<MetiersView />} />
            <Route path="parametres/parcours" element={<ParcoursView />} />
            <Route path="parametres/mention" element={<MentionsView />} />
            <Route path="parametres/serie" element={<SeriesView />} />
            <Route path="parametres/etablissement" element={<EtablissementsView />} />
            <Route path="utilisateurs" element={<UsersView />} />
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Route>
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </BrowserRouter>

      <InstallPWA />
    </AuthProvider>
  );
}

export default App;
