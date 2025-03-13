import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  fetchUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from "./userAction";

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

export const useUser = (type: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, type],
    queryFn: () => fetchUser(type),
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
