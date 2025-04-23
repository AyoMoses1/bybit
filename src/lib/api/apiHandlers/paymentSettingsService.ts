import { getDatabase, ref, onValue, update } from "firebase/database";

export type PaymentMethod = {
  merchantId?: string;
  privateKey?: string;
  publicKey?: string;
  active?: boolean;
  testing?: boolean;
};

export type PaymentSettings = {
  [key: string]: PaymentMethod;
};

export const fetchPaymentSettings = (): Promise<PaymentSettings> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const settingsRef = ref(db, "payment_settings");

      const unsubscribe = onValue(
        settingsRef,
        (snapshot) => {
          const data = snapshot.val() || {};
          resolve(data);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Payment Settings Error:", error);
      reject(error);
    }
  });
};

// Fetch a specific payment method settings
export const fetchPaymentMethodSettings = (
  method: string,
): Promise<PaymentMethod | null> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const settingRef = ref(db, `payment_settings/${method.toLowerCase()}`);

      const unsubscribe = onValue(
        settingRef,
        (snapshot) => {
          const data = snapshot.val();
          resolve(data || null);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Payment Method Settings Error:", error);
      reject(error);
    }
  });
};

// Update payment method settings
export const updatePaymentSetting = (
  method: string,
  data: PaymentMethod,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const settingRef = ref(db, `payment_settings/${method.toLowerCase()}`);

      update(settingRef, data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error updating payment settings:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update Payment Settings Error:", error);
      reject(error);
    }
  });
};

export const updatePaymentSettingField = (
  method: string,
  field: string,
  value: string | boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const settingRef = ref(db, `payment_settings/${method.toLowerCase()}`);

      const updateData = {
        [field]: value,
      };

      update(settingRef, updateData)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(`Error updating ${field}:`, error);
          reject(error);
        });
    } catch (error) {
      console.error(`Update ${field} Error:`, error);
      reject(error);
    }
  });
};
