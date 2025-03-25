import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../apiHandlers/authService";

const USER_STATE_KEY = "auth";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ credentials }: { credentials: LoginCredentials }) =>
      login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("User update failed:", error);
    },
  });
};
