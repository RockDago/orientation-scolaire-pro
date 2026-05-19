import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../../services/dashboard.services";
import { getAllDomaines, getDomaineById } from "../../services/domaine.services";
import { getAllEtablissements, getEtablissementById } from "../../services/etablissement.services";
import { getAllMentions, getMentionById } from "../../services/mention.services";
import { getAllMetiers, getMetierById } from "../../services/metier.services";
import { getAllParcours, getParcoursById } from "../../services/parcours.services";
import { getProfile, getLocalUser } from "../../services/profile.services";
import { getAllSeries, getSerieById } from "../../services/serie.services";
import { getAllUsers } from "../../services/user.services";
import { normalizeSearch, queryKeys } from "./queryKeys";

const asArray = (value) => (Array.isArray(value) ? value : []);

export const useDashboardQuery = (filters, options = {}) => {
  const normalizedFilters = {
    period: filters?.period || "30j",
    startDate: filters?.startDate || "",
    endDate: filters?.endDate || "",
  };

  return useQuery({
    queryKey: queryKeys.dashboard.detail(normalizedFilters),
    queryFn: () =>
      getDashboardData(
        normalizedFilters.period,
        normalizedFilters.startDate,
        normalizedFilters.endDate,
      ),
    ...options,
  });
};

export const useDomainesQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.domaines.list(normalizedSearch),
    queryFn: () => getAllDomaines(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useDomaineQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.domaines.detail(id),
    queryFn: () => getDomaineById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useMentionsQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.mentions.list(normalizedSearch),
    queryFn: () => getAllMentions(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useMentionQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.mentions.detail(id),
    queryFn: () => getMentionById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useParcoursQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.parcours.list(normalizedSearch),
    queryFn: () => getAllParcours(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useParcoursDetailQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.parcours.detail(id),
    queryFn: () => getParcoursById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useSeriesQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.series.list(normalizedSearch),
    queryFn: () => getAllSeries(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useSerieQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.series.detail(id),
    queryFn: () => getSerieById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useMetiersQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.metiers.list(normalizedSearch),
    queryFn: () => getAllMetiers(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useMetierQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.metiers.detail(id),
    queryFn: () => getMetierById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useEtablissementsQuery = (search = "", options = {}) => {
  const normalizedSearch = normalizeSearch(search);
  return useQuery({
    queryKey: queryKeys.etablissements.list(normalizedSearch),
    queryFn: () => getAllEtablissements(normalizedSearch),
    placeholderData: keepPreviousData,
    select: asArray,
    ...options,
  });
};

export const useEtablissementQuery = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.etablissements.detail(id),
    queryFn: () => getEtablissementById(id),
    enabled: Boolean(id),
    ...options,
  });

export const useUsersQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: getAllUsers,
    select: asArray,
    ...options,
  });

export const useProfileQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.profile.detail(),
    queryFn: getProfile,
    initialData: () => getLocalUser() || undefined,
    ...options,
  });
