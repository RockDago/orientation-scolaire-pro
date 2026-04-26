import API from "../api/axios";


let _etablissementsCache = null;


export const getAllEtablissements = async (search = "") => {
  const params = search ? { search, limit: 9999 } : { limit: 9999 };
  const response = await API.get("/etablissements", { params });
  return (
    response.data.etablissements ||
    response.data.data           ||
    response.data                ||
    []
  );
};

export const getAllEtablissementsCache = async () => {
  if (_etablissementsCache) return _etablissementsCache;
  const data = await getAllEtablissements();
  _etablissementsCache = data;
  return data;
};

export const invalidateEtablissementsCache = () => {
  _etablissementsCache = null;
};

export const getEtablissementById = async (id) => {
  const response = await API.get(`/etablissements/${id}`);
  return response.data.etablissement || response.data || null;
};

export const getEtablissementsByRegion = async (region) => {
  try {
    const response = await API.get("/etablissements", {
      params: { region, limit: 9999 },
    });
    return (
      response.data.etablissements ||
      response.data.data           ||
      []
    );
  } catch (error) {
    console.error("Erreur établissements par région:", error);
    return [];
  }
};

export const getEtablissementsByMention = async (mention) => {
  try {
    const response = await API.get("/etablissements", {
      params: { mention, limit: 9999 },
    });
    return (
      response.data.etablissements ||
      response.data.data           ||
      []
    );
  } catch (error) {
    console.error("Erreur établissements par mention:", error);
    return [];
  }
};

export const getEtablissementsByRegionAndMention = async (region, mention) => {
  try {
    const response = await API.get("/etablissements", {
      params: { region, mention, limit: 9999 },
    });
    return (
      response.data.etablissements ||
      response.data.data           ||
      []
    );
  } catch (error) {
    console.error("Erreur établissements région+mention:", error);
    return [];
  }
};

export const recordEtablissementSelection = async (
  metierLabel,
  region,
  etablissementNom,
  visitorId = null,
  clientInfo = null,
) => {
  try {
    const response = await API.post("/track-etablissement-selection", {
      metier_label:      metierLabel,
      region:            region,
      etablissement_nom: etablissementNom,
      visitor_id:        visitorId,
      client_info:       clientInfo,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur tracking établissement:", error);
  }
};

export const createEtablissement = async (data) => {
  const response = await API.post("/etablissements", {
    nom:         data.nom,
    province:    data.province,
    region:      data.region,
    type:        data.type,
    description: data.description,
    email:       data.email,
    mention:     data.mention,
    domaine:     data.domaine,
    parcours:    data.parcours,
    metier:      data.metier,
    niveau:      data.niveau,
    duree:       data.duree,
    admission:   data.admission,
    contact:     data.contact,
  });
  invalidateEtablissementsCache();
  return response.data.etablissement;
};

export const updateEtablissement = async (id, data) => {
  const response = await API.put(`/etablissements/${id}`, {
    nom:         data.nom,
    province:    data.province,
    region:      data.region,
    type:        data.type,
    description: data.description,
    email:       data.email,
    mention:     data.mention,
    domaine:     data.domaine,
    parcours:    data.parcours,
    metier:      data.metier,
    niveau:      data.niveau,
    duree:       data.duree,
    admission:   data.admission,
    contact:     data.contact,
  });
  invalidateEtablissementsCache();
  return response.data.etablissement;
};

export const deleteEtablissement = async (id) => {
  const response = await API.delete(`/etablissements/${id}`);
  invalidateEtablissementsCache();
  return response.data;
};
