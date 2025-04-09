import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCar } from "../apiHandlers/carsService";
import toast from "react-hot-toast";
import { fetchComplaints } from "../apiHandlers/complaintsService";

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

export const useAddCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (car: any) => addCar(car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
      toast.success("Car created successfully!");
    },
    onError: (error) => {
      console.error("Car update failed:", error);
      toast.error("Failed to create car. Please try again.");
    },
  });
};
