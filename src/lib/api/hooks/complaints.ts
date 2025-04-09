import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchComplaints,
  updateComplaint,
} from "../apiHandlers/complaintsService";

const USER_STATE_KEY = "complaints";

export type Complaint = {
  check: boolean;
  id: string;
  complainDate?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  subject?: string;
  processDate?: string;
};

export type UpdateCarPayload = {
  updatedData: Partial<Complaint>;
};

export const useComplaints = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchComplaints(search),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      updateComplaint(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
    },
    onError: (error) => {
      console.error("Complaint update failed:", error);
    },
  });
};
