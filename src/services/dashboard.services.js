import API from "../api/axios";

const getVisitorId = () => {
  if (typeof window === "undefined") return null;
  let vid = sessionStorage.getItem("osp_visitor_id");
  if (!vid) {
    vid = "v_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("osp_visitor_id", vid);
  }
  return vid;
};

const buildClientInfo = () => {
  if (typeof window === "undefined") return {};
  const nav = window.navigator || {};
  const scr = window.screen || {};
  let connectionType = null;
  try {
    const c = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (c?.effectiveType) connectionType = c.effectiveType;
  } catch { /* silencieux */ }

  return {
    language:        nav.language  || null,
    screen:          { width: scr.width || null, height: scr.height || null },
    timezone:        Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    connection_type: connectionType || null,
  };
};

const _fired = new Set();

export const trackPageView = async (page, metierId = null) => {
  if (typeof window === "undefined") return;
  if (_fired.has(page)) return;
  _fired.add(page);

  try {
    await API.post("/track-view", {
      page,
      metier_id:   metierId,
      visitor_id:  getVisitorId(),
      client_info: buildClientInfo(),
    });
  } catch (error) {
    _fired.delete(page); 
    console.error("trackPageView error:", error);
  }
};

export const trackMetierSearch = async (metierId, metierLabel) => {
  try {
    await API.post("/track-search", {
      metier_id:    metierId,
      metier_label: metierLabel,
      visitor_id:   getVisitorId(),
      client_info:  buildClientInfo(),
    });
  } catch (error) {
    console.error("trackMetierSearch error:", error);
  }
};

export const getMostSearchedMetiers = async (limit = 10) => {
  try {
    const res = await API.get("/top-metiers", { params: { limit } });
    return res.data.metiers || [];
  } catch (error) {
    console.error("getMostSearchedMetiers error:", error);
    return [];
  }
};

export const getMetiersByMention = async (mention) => {
  try {
    const res = await API.get("/metiers", { params: { mention } });
    return res.data.metiers || [];
  } catch (error) {
    console.error("getMetiersByMention error:", error);
    return [];
  }
};

export const getAllMentions = async () => {
  try {
    const res = await API.get("/mentions");
    return res.data.mentions || [];
  } catch (error) {
    console.error("getAllMentions error:", error);
    return [];
  }
};

export const getDashboardData = async (period = "30j", start = null, end = null) => {
  const params = { period };
  if (period === "custom" && start) params.start = start;
  if (period === "custom" && end)   params.end   = end;
  const res = await API.get("/dashboard", { params });
  return res.data;
};
