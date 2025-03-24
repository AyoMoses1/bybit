import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PromoData,
  createPromo,
  deletePromo,
  fetchPromoById,
  fetchPromos,
  updatePromo,
} from "../apiHandlers/promoService";
import toast from "react-hot-toast";

const PROMO_STATE_KEY = "promo";

export const usePromos = () => {
  return useQuery<PromoData[]>({
    queryKey: [PROMO_STATE_KEY],
    queryFn: () => fetchPromos(),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useGetPromoById = (id?: string) => {
  return useQuery<PromoData | null>({
    queryKey: [PROMO_STATE_KEY, id],
    queryFn: () => fetchPromoById(id as string),
    staleTime: Infinity,
    retry: 2,
    enabled: !!id, // Only run query if id is provided
  });
};

export const useCreatePromo = () => {
  const queryClient = useQueryClient();

  return useMutation<PromoData, Error, Omit<PromoData, "id">>({
    mutationFn: (promoData: Omit<PromoData, "id">) => createPromo(promoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_STATE_KEY] });
      toast.success("Promo created successfully!");
    },
    onError: (error) => {
      console.error("Promo creation failed:", error);
      toast.error("Failed to create promo. Please try again.");
    },
  });
};

export const useUpdatePromo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PromoData,
    Error,
    { id: string; updatedData: Partial<PromoData> }
  >({
    mutationFn: ({ id, updatedData }) => updatePromo(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_STATE_KEY] });
      toast.success("Promo updated successfully!");
    },
    onError: (error) => {
      console.error("Promo update failed:", error);
      toast.error("Failed to update promo. Please try again.");
    },
  });
};

export const useDeletePromo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deletePromo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_STATE_KEY] });
      toast.success("Promo deleted successfully!");
    },
    onError: (error) => {
      console.error("Promo deletion failed:", error);
      toast.error("Failed to delete promo. Please try again.");
    },
  });
};
