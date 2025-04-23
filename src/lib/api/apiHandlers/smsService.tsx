import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import firebase from "@/lib/firebase";
import { onValue, set } from "firebase/database";
import toast from "react-hot-toast";

export interface SettingsType {
  apiUrl: string;
  contentType: string;
  method: string;
  body: string;
  authorization: string;
  customMobileOTP?: string;
  AllowCriticalEditsAdmin?: boolean;
}

const fetchSettings = async (): Promise<SettingsType> => {
  const { settingsRef } = firebase;
  return new Promise((resolve, reject) => {
    onValue(
      settingsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data)
          resolve(data as SettingsType); // <-- cast to type
        else reject(new Error("Unable to fetch database and settings."));
      },
      { onlyOnce: true },
    );
  });
};

export const useSettings = () => {
  return useQuery<SettingsType>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
};

export const useEditSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<SettingsType, Error, SettingsType>({
    mutationFn: async (settings: SettingsType) => {
      const { settingsRef } = firebase;
      await set(settingsRef, settings);
      return settings;
    },
    onSuccess: (data: SettingsType) => {
      queryClient.setQueryData(["settings"], data);
      toast.success("Settings updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Error updating settings.");
      console.error(error);
    },
  });
};
