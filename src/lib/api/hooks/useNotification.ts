import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserNotifications,
  fetchAllNotifications,
  editNotification,
  sendPushNotification,
  AppNotification,
} from "../apiHandlers/notificationService";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

const getUserFromLocalStorage = (): UserData | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const useUserNotifications = () => {
  const user = getUserFromLocalStorage();

  return useQuery({
    queryKey: ["notifications", "user", user?.id],
    queryFn: () => user ? fetchUserNotifications(user.id) : Promise.resolve([]),
    staleTime: 1000 * 60 * 5,
    enabled: !!user,
    refetchInterval: 1000 * 60,
  });
};

export const useAllNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "all"],
    queryFn: fetchAllNotifications,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEditNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notification,
      method,
    }: {
      notification: AppNotification;
      method: "Add" | "Delete" | "Edit";
    }) => editNotification(notification, method),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "all"] });
      toast.success(`Notification ${variables.method.toLowerCase()} successfully`);
    },
    onError: (error: Error) => {
      console.error("Notification operation failed:", error);
      toast.error(error.message || "Failed to perform notification operation");
    },
  });
};

export const useSendPushNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: {
      notification: Omit<AppNotification, "id">;
    }) => {
      return sendPushNotification(payload.notification);
    },
    onSuccess: () => {
      // toast.success("Push notification sent successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "all"] });
      queryClient.refetchQueries({ queryKey: ["notifications", "all"] });
    },
    onError: (error: Error) => {
      console.error("Push notification failed:", error);
      toast.error(error.message || "Failed to send push notification");
    },
  });
};