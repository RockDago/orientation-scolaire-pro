import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/auth.services";
import { createDomaine, deleteDomaine, updateDomaine } from "../../services/domaine.services";
import {
  createEtablissement,
  deleteEtablissement,
  updateEtablissement,
} from "../../services/etablissement.services";
import { createMention, deleteMention, updateMention } from "../../services/mention.services";
import { createMetier, deleteMetier, updateMetier } from "../../services/metier.services";
import { createParcours, deleteParcours, updateParcours } from "../../services/parcours.services";
import { changePassword, updateProfile } from "../../services/profile.services";
import { createSerie, deleteSerie, updateSerie } from "../../services/serie.services";
import {
  createUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  updateUser,
} from "../../services/user.services";
import { queryKeys } from "../queries/queryKeys";

const invalidate = (queryClient, queryKey) =>
  queryClient.invalidateQueries({ queryKey });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ identifier, password, rememberMe }) =>
      login(identifier, password, rememberMe),
  });

export const useCreateDomaineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDomaine,
    onSuccess: () => invalidate(queryClient, queryKeys.domaines.all),
  });
};

export const useUpdateDomaineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDomaine(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.domaines.detail(variables.id), data);
      invalidate(queryClient, queryKeys.domaines.all);
    },
  });
};

export const useDeleteDomaineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDomaine,
    onSuccess: () => invalidate(queryClient, queryKeys.domaines.all),
  });
};

export const useCreateMentionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMention,
    onSuccess: () => invalidate(queryClient, queryKeys.mentions.all),
  });
};

export const useUpdateMentionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMention(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.mentions.detail(variables.id), data);
      invalidate(queryClient, queryKeys.mentions.all);
    },
  });
};

export const useDeleteMentionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMention,
    onSuccess: () => invalidate(queryClient, queryKeys.mentions.all),
  });
};

export const useCreateParcoursMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParcours,
    onSuccess: () => invalidate(queryClient, queryKeys.parcours.all),
  });
};

export const useUpdateParcoursMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateParcours(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.parcours.detail(variables.id), data);
      invalidate(queryClient, queryKeys.parcours.all);
    },
  });
};

export const useDeleteParcoursMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteParcours,
    onSuccess: () => invalidate(queryClient, queryKeys.parcours.all),
  });
};

export const useCreateSerieMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSerie,
    onSuccess: () => invalidate(queryClient, queryKeys.series.all),
  });
};

export const useUpdateSerieMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSerie(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.series.detail(variables.id), data);
      invalidate(queryClient, queryKeys.series.all);
    },
  });
};

export const useDeleteSerieMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSerie,
    onSuccess: () => invalidate(queryClient, queryKeys.series.all),
  });
};

export const useCreateMetierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMetier,
    onSuccess: () => invalidate(queryClient, queryKeys.metiers.all),
  });
};

export const useUpdateMetierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMetier(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.metiers.detail(variables.id), data);
      invalidate(queryClient, queryKeys.metiers.all);
    },
  });
};

export const useDeleteMetierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMetier,
    onSuccess: () => invalidate(queryClient, queryKeys.metiers.all),
  });
};

export const useCreateEtablissementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEtablissement,
    onSuccess: () => invalidate(queryClient, queryKeys.etablissements.all),
  });
};

export const useUpdateEtablissementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateEtablissement(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.etablissements.detail(variables.id), data);
      invalidate(queryClient, queryKeys.etablissements.all);
    },
  });
};

export const useDeleteEtablissementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEtablissement,
    onSuccess: () => invalidate(queryClient, queryKeys.etablissements.all),
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => invalidate(queryClient, queryKeys.users.all),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.users.detail(variables.id), data);
      invalidate(queryClient, queryKeys.users.all);
    },
  });
};

export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => toggleUserStatus(id, isActive),
    onSuccess: () => invalidate(queryClient, queryKeys.users.all),
  });
};

export const useResetUserPasswordMutation = () =>
  useMutation({
    mutationFn: ({ id, password }) => resetUserPassword(id, password),
  });

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => invalidate(queryClient, queryKeys.users.all),
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.detail(), data);
      invalidate(queryClient, queryKeys.profile.all);
    },
  });
};

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changePassword(currentPassword, newPassword),
  });
