import API from "../api/axios";
import { trackMetierSearch } from "./dashboard.services";

let _metiersCache = null;

export const getAllMetiers = async (search = "") => {
  const params = search ? { search, limit: 9999 } : { limit: 9999 };
  const response = await API.get("/metiers", { params });
  return (
    response.data.metiers ||
    response.data.data    ||
    response.data         ||
    []
  );
};

export const getAllMetiersCache = async () => {
  if (_metiersCache) return _metiersCache;
  const data = await getAllMetiers();
  _metiersCache = data;
  return data;
};

export const invalidateMetiersCache = () => {
  _metiersCache = null;
};

export const getMetierById = async (id) => {
  const response = await API.get(`/metiers/${id}`);
  return response.data.metier || response.data || null;
};

export const searchMetier = async (metierId, metierLabel) => {
  await trackMetierSearch(metierId, metierLabel);
};

export const createMetier = async (data) => {
  const response = await API.post("/metiers", {
    label:             data.label,
    description:       data.description,
    parcours:          data.parcours,
    mention:           data.mention,
    domaine:           data.domaine,
    serie:             data.serie,
    niveau:            data.niveau,
    parcoursFormation: data.parcoursFormation,
  });

  // ✅ Log pour voir exactement ce que PHP répond
  console.log("=== [createMetier] response.status ===", response.status);
  console.log("=== [createMetier] response.data ===", JSON.stringify(response.data, null, 2));

  invalidateMetiersCache();
  return response.data.metier || response.data || null;
};


export const updateMetier = async (id, data) => {
  const response = await API.put(`/metiers/${id}`, {
    label:             data.label,
    description:       data.description,
    parcours:          data.parcours,
    mention:           data.mention,
    domaine:           data.domaine,
    serie:             data.serie,
    niveau:            data.niveau,
    parcoursFormation: data.parcoursFormation,
  });
  invalidateMetiersCache();
  return response.data.metier;
};

export const deleteMetier = async (id) => {
  const response = await API.delete(`/metiers/${id}`);
  invalidateMetiersCache();
  return response.data;
};
