import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { audit, AuditLog, fetchAudits } from "../apiHandlers/auditService";

const USER_STATE_KEY = "audit";
export const useProcessAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: AuditLog }) => audit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },

    onError: (error) => {
      console.error("Error occured while auditing:", error);
    },
  });
};

export const useAudit = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchAudits(search),
    staleTime: Infinity,
    retry: 2,
  });
};
