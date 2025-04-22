import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format payment method names
export const formatPaymentMethodName = (method: string): string => {
  return method.charAt(0).toUpperCase() + method.slice(1);
};

// Helper function to get the appropriate field names for each payment method
export const getPaymentMethodFields = (
  method: string,
  data: any,
): { [key: string]: string } => {
  const result: { [key: string]: string } = {};

  // Keys that might represent merchant ID
  const merchantIdKeys = [
    "merchantId",
    "MERCHANT_CODE",
    "PAYTM_MEWRCHANT_ID",
    "PAYFAST_MEWRCHANT_ID",
    "ACCOUNT_NO",
  ];
  // Keys that might represent private/secret keys
  const privateKeyKeys = [
    "privateKey",
    "SECURE_KEY",
    "secret_key",
    "FLUTTERWAVE_SECRET_KEY",
    "PAYSTACK_SECRET_KEY",
    "KEY_SECRET",
    "private_key",
    "stripe_private_key",
    "TXN_PASSWORD",
    "paypal_secret",
  ];
  // Keys that might represent public keys
  const publicKeyKeys = [
    "publicKey",
    "PUBLIC_KEY",
    "FLUTTERWAVE_PUBLIC_KEY",
    "PAYSTACK_PUBLIC_KEY",
    "KEY_ID",
    "public_key",
    "stripe_public_key",
    "API_KEY",
    "apiKey",
  ];

  // Find corresponding field names
  for (const key in data) {
    if (merchantIdKeys.includes(key)) {
      result.merchantId = key;
    } else if (privateKeyKeys.includes(key)) {
      result.privateKey = key;
    } else if (publicKeyKeys.includes(key)) {
      result.publicKey = key;
    }
  }

  // Default values if not found
  result.merchantId = result.merchantId || "merchantId";
  result.privateKey = result.privateKey || "privateKey";
  result.publicKey = result.publicKey || "publicKey";

  return result;
};
