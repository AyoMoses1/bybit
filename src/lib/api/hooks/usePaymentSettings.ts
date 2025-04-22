import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaymentSettings,
  fetchPaymentMethodSettings,
  updatePaymentSetting,
  updatePaymentSettingField,
  PaymentMethod,
} from "../apiHandlers/paymentSettingsService";
import toast from "react-hot-toast";

const PAYMENT_SETTINGS_KEY = "paymentSettings";

// Hook to fetch all payment settings
export const usePaymentSettings = () => {
  return useQuery({
    queryKey: [PAYMENT_SETTINGS_KEY],
    queryFn: () => fetchPaymentSettings(),
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

// Hook to fetch a specific payment method settings
export const usePaymentMethodSettings = (method: string) => {
  return useQuery({
    queryKey: [PAYMENT_SETTINGS_KEY, method],
    queryFn: () => fetchPaymentMethodSettings(method),
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

// Hook to update a payment method settings
export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ method, data }: { method: string; data: PaymentMethod }) =>
      updatePaymentSetting(method, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENT_SETTINGS_KEY] });
      toast.success("Payment settings updated successfully!");
    },
    onError: (error) => {
      console.error("Payment settings update failed:", error);
      toast.error("Failed to update payment settings. Please try again.");
    },
  });
};

// Hook to update a specific field in payment method settings
export const useUpdatePaymentSettingField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      method,
      field,
      value,
    }: {
      method: string;
      field: string;
      value: string | boolean;
    }) => updatePaymentSettingField(method, field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENT_SETTINGS_KEY] });
      toast.success("Setting updated successfully!");
    },
    onError: (error) => {
      console.error("Setting update failed:", error);
      toast.error("Failed to update setting. Please try again.");
    },
  });
};
