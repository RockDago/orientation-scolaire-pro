import API from "../api/axios";

/**
 * Récupérer tous les utilisateurs
 */
export const getAllUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

/**
 * Créer un nouvel utilisateur (admin)
 * @param {object} userData 
 */
export const createUser = async (userData) => {
  const response = await API.post("/users", userData);
  return response.data.utilisateur;
};

/**
 * Mettre à jour un utilisateur
 * @param {number} id 
 * @param {object} userData 
 */
export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data.utilisateur;
};

/**
 * Activer/Désactiver un utilisateur
 * @param {number} id 
 * @param {boolean} est_actif 
 */
export const toggleUserStatus = async (id, est_actif) => {
  const response = await API.patch(`/users/${id}/status`, { est_actif: est_actif ? 1 : 0 });
  return response.data;
};

/**
 * Réinitialiser le mot de passe d'un utilisateur
 * @param {number} id 
 * @param {string} password 
 */
export const resetUserPassword = async (id, password) => {
  const response = await API.patch(`/users/${id}/password`, { mot_de_passe: password });
  return response.data;
};

/**
 * Supprimer un utilisateur
 * @param {number} id 
 */
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};
