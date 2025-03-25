import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCar,
  deleteCar,
  fetchCarById,
  fetchCars,
  fetchCarTypes,
  updateCars,
} from "../apiHandlers/carsService";
import toast from "react-hot-toast";

const USER_STATE_KEY = "car";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  price: number;
  vehicleNumber?: string;
  vehicleModel?: string;
  vehicleMake?: string;
  other_info?: string;
  driver?: string;
  carType?: string;
  car_image?: string;
}

export type UpdateCarPayload = {
  id: string;
  active?: boolean;
  approved?: boolean;
  updatedData: Partial<Car>;
};

export const useCars = (userType: string, uid: string, search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, userType, uid, search],
    queryFn: () => fetchCars(userType, uid, search),
    staleTime: Infinity,
    retry: 2,
    enabled: !!userType && !!uid,
  });
};

export const useCarTypes = () => {
  return useQuery({
    queryKey: ["carTypes"],
    queryFn: () => fetchCarTypes(),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useGetCarById = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<any>({
    queryKey: [USER_STATE_KEY, id],
    queryFn: () => fetchCarById(id),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: UpdateCarPayload;
    }) => updateCars(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
      // toast.success("Car details were updated successfully!");
    },
    onError: (error) => {
      console.error("Car update failed:", error);
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCar(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATE_KEY] });
      toast.success("Car deleted successfully!");
    },

    onError: (error) => {
      console.error("Car deletion failed:", error);
      toast.error("Failed to delete car. Please try again.");
    },
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

// export const useCar = (type: string, search?: string) => {
//   return useQuery({
//     queryKey: [USER_STATE_KEY, type, search || undefined],
//     queryFn: () => fetchUser(type, search || ""),
//     staleTime: Infinity,
//     retry: 2,
//   });
// };
