// src/api/axios.js
import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost/orientation-scolaire-professionnelle/backend/public"
    : "https://bambaray.mg/dssip.bambaray.mg/backend/public");

const API = axios.create({
  baseURL: API_URL + "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Routes publiques : jamais de redirection /login sur ces endpoints ────────
// Tous les appels depuis /acceuil/* utilisent ces routes sans token.
const PUBLIC_ROUTES = [
  "/track-view",
  "/track-search",
  "/track-etablissement-selection",
  "/top-metiers",
  "/metiers",
  "/metier",
  "/mentions",
  "/mentions",
  "/series",
  "/etablissements",
  "/parcours",
];

const isPublicRoute = (url = "") =>
  PUBLIC_ROUTES.some((route) => url.includes(route));

// ─── Intercepteur requête : ajouter le token JWT si disponible ────────────────
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Intercepteur réponse : gérer les erreurs 401 ─────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl  = error.config?.url || "";
      const currentPath = window.location.pathname;

      // 1. Déjà sur /login → ne pas boucler
      if (currentPath === "/login") {
        return Promise.reject(error);
      }

      // 2. Route publique (appels depuis /acceuil) → ignorer le 401 silencieusement
      if (isPublicRoute(requestUrl)) {
        return Promise.reject(error);
      }

      // 3. L'utilisateur est sur une page publique /acceuil → ne pas rediriger
      if (currentPath.startsWith("/acceuil")) {
        return Promise.reject(error);
      }

      // 4. Route protégée + pas authentifié → nettoyer et rediriger
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;