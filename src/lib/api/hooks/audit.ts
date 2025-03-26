import { useMutation, useQueryClient } from "@tanstack/react-query";
import { audit, AuditLog } from "../apiHandlers/auditService";

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
