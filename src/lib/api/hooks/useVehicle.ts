"use client";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editCarType, fetchCarTypeById, fetchCarTypes } from "../apiHandlers/vehicleService";

export const useCarTypes = () => {
  return useQuery({
    queryKey: ["carTypes"],
    queryFn: fetchCarTypes,
    staleTime: Infinity,
    retry: 2,
  });
};

export const useEditCarType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCarType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carTypes"] });
      toast.success("Success!");
    },
    onError: (error) => {
      console.error("Car type update failed:", error);
      toast.error("Failed to update car type. Please try again.");
    },
  });
};

export const useCarTypeById = (id: string) => {
  return useQuery({
    queryKey: ["carType", id],
    queryFn: () => fetchCarTypeById(id),
    staleTime: Infinity,
    enabled: !!id, 
  });
};