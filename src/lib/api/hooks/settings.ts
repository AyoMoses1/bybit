import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAppInfo,
  fetchSMTPData,
  updateSettings,
  updateSMTPSettings,
} from "../apiHandlers/settingsService";
import { SettingsType, SMTPDataType } from "../apiHandlers/settingsService"; 

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
    mutationFn: ({ updatedData }: { updatedData: Partial<SettingsType> }) =>
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
    mutationFn: ({ updatedData }: { updatedData: SMTPDataType }) =>
      updateSMTPSettings(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SMTP_STATE_KEY] });
    },
    onError: (error) => {
      console.error("SMTP details update failed:", error);
    },
  });
};