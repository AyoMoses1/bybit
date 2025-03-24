import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login } from "../apiHandlers/authService";

const USER_STATE_KEY = "auth";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ credentials }: { credentials: any }) => login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("User update failed:", error);
    },
  });
};
