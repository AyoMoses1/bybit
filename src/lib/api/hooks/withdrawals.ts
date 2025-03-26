import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWithdrawal,
  processWithdrawal,
} from "../apiHandlers/withdrawalService";
import { WithdrawalType } from "@/containers/withdrawals";
import toast from "react-hot-toast";

const USER_STATE_KEY = "withdrawals";

export const useWithdrawals = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchWithdrawal(search ?? ""),
    staleTime: Infinity,
    retry: 2,
  });
};
export const useProcessWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: WithdrawalType }) => processWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
      toast.success("Withdrawal has been processed successfully!");
    },

    onError: (error) => {
      console.error("Car deletion failed:", error);
      toast.error("Failed to process withdrawal. Please try again.");
    },
  });
};
