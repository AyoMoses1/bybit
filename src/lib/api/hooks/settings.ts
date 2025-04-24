import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAppInfo,
  fetchSMTPData,
  updateSettings,
  updateSMTPSettings,
} from "../apiHandlers/settingsService";
const USER_STATE_KEY = "settings";
const SMTP_STATE_KEY = "SMTP";

export const useAppInfo = () => {
  return useQuery({
    queryKey: [USER_STATE_KEY],
    queryFn: () => fetchAppInfo(),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useSMTPInfo = () => {
  return useQuery({
    queryKey: [SMTP_STATE_KEY],
    queryFn: () => fetchSMTPData(),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUpdateAppInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ updatedData }: { updatedData: any }) =>
      updateSettings(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("Settings update failed:", error);
    },
  });
};

export const useUpdateSMTPInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ updatedData }: { updatedData: any }) =>
      updateSMTPSettings(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SMTP_STATE_KEY] });
    },
    onError: (error) => {
      console.error("SMTP details update failed:", error);
    },
  });
};
