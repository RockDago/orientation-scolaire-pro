export const normalizeSearch = (search = "") => String(search).trim();

export const queryKeys = {
  dashboard: {
    all: ["dashboard"],
    detail: ({ period = "30j", startDate = "", endDate = "" } = {}) => [
      "dashboard",
      period || "30j",
      startDate || "",
      endDate || "",
    ],
  },
  domaines: {
    all: ["domaines"],
    lists: () => ["domaines", "list"],
    list: (search = "") => ["domaines", "list", normalizeSearch(search)],
    detail: (id) => ["domaines", "detail", id],
  },
  mentions: {
    all: ["mentions"],
    lists: () => ["mentions", "list"],
    list: (search = "") => ["mentions", "list", normalizeSearch(search)],
    detail: (id) => ["mentions", "detail", id],
  },
  parcours: {
    all: ["parcours"],
    lists: () => ["parcours", "list"],
    list: (search = "") => ["parcours", "list", normalizeSearch(search)],
    detail: (id) => ["parcours", "detail", id],
  },
  series: {
    all: ["series"],
    lists: () => ["series", "list"],
    list: (search = "") => ["series", "list", normalizeSearch(search)],
    detail: (id) => ["series", "detail", id],
  },
  metiers: {
    all: ["metiers"],
    lists: () => ["metiers", "list"],
    list: (search = "") => ["metiers", "list", normalizeSearch(search)],
    detail: (id) => ["metiers", "detail", id],
  },
  etablissements: {
    all: ["etablissements"],
    lists: () => ["etablissements", "list"],
    list: (search = "") => ["etablissements", "list", normalizeSearch(search)],
    detail: (id) => ["etablissements", "detail", id],
  },
  users: {
    all: ["users"],
    list: () => ["users", "list"],
    detail: (id) => ["users", "detail", id],
  },
  profile: {
    all: ["profile"],
    detail: () => ["profile", "detail"],
  },
};
