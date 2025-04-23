import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAppInfo, updateSettings } from "../apiHandlers/settingsService";
const USER_STATE_KEY = "settings";

export const useAppInfo = () => {
  return useQuery({
    queryKey: [USER_STATE_KEY],
    queryFn: () => fetchAppInfo(),
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
