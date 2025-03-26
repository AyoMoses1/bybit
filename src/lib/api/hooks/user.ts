import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUserById,
  fetchUserRides,
  fetchUsers,
  fetchUserWalletHistory,
  updateUser,
} from "../apiHandlers/userService";
import toast from "react-hot-toast";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<any>({
    queryKey: [USER_STATE_KEY, id],
    queryFn: () => fetchUserById(id),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
      toast.success("User deleted successfully!");
    },

    onError: (error) => {
      console.error("User deletion failed:", error);
      toast.error("Failed to delete user. Please try again.");
    },
  });
};

export const useUsersRide = (id: string) => {
  return useQuery({
    queryKey: ["usersRide", id],
    queryFn: () => fetchUserRides(id),
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
