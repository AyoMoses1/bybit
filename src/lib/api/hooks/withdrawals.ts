import { useQuery } from "@tanstack/react-query";
import { fetchWithdrawal } from "../apiHandlers/withdrawalService";

const USER_STATE_KEY = "withdrawals";

export const useWithdrawals = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchWithdrawal(search),
    staleTime: Infinity,
    retry: 2,
  });
};
