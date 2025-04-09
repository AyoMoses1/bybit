import { useQuery } from "@tanstack/react-query";
import { fetchSos } from "../apiHandlers/sosService";

const USER_STATE_KEY = "sos";

export const useSos = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchSos(search),
    staleTime: Infinity,
    retry: 2,
  });
};
