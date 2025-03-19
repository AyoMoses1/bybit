import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  fetchUser,
  fetchUserById,
  fetchUserRides,
  fetchUsers,
  fetchUserWalletHistory,
  updateUser,
} from "../apiHandlers/userService";

const USER_STATE_KEY = "user";

export const useUsers = () => {
  return useQuery({
    queryKey: [USER_STATE_KEY],
    queryFn: () => fetchUsers(),
    staleTime: Infinity,
    retry: 2,
    enabled: false,
  });
};

export const useUser = (type: string, search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, type, search || undefined],
    queryFn: () => fetchUser(type, search || ""),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, id],
    queryFn: () => fetchUserById(id),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      updateUser(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("User update failed:", error);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ updatedData }: { updatedData: any }) =>
      createUser(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("User creation failed:", error);
    },
  });
};

export const useUsersRide = (id: string, type: string) => {
  return useQuery({
    queryKey: ["usersRide", id, type],
    queryFn: () => fetchUserRides(id, type),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUserWalletHistory = (id: string) => {
  return useQuery({
    queryKey: ["walletHistory", id],
    queryFn: () => fetchUserWalletHistory(id),
    staleTime: Infinity,
    retry: 2,
  });
};
