import API from "../api/axios";

/**
 * Connexion avec email ou nom_utilisateur + mot_de_passe
 * @param {string} identifiant 
 * @param {string} motDePasse
 * @param {boolean} rememberMe 
 */
export const login = async (identifiant, motDePasse, rememberMe = false) => {
  const response = await API.post("/login", {
    nom_utilisateur: identifiant,
    mot_de_passe: motDePasse,
  });

  const { token, utilisateur } = response.data;
  return { token, utilisateur };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userData =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token;
};

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data.utilisateur;
};

/**
 * Mettre à jour le profil
 * @param {object} profileData - les champs à mettre à jour (ex: { prenom, nom, email, telephone })
 */
export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  const utilisateur = response.data.utilisateur;

  localStorage.setItem("user", JSON.stringify(utilisateur));
  sessionStorage.setItem("user", JSON.stringify(utilisateur));

  return utilisateur;
};
