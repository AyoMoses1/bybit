import {
  onValue,
  ref,
  getDatabase,
  update,
  set,
  push,
  remove,
} from "firebase/database";
import moment from "moment";

export interface PromoData {
  id: string;
  promo_name: string;
  promo_code: string;
  promo_description?: string;
  promo_discount_type: "percentage" | "flat";
  promo_discount_value: number;
  max_promo_discount_value: number;
  min_order: number;
  promo_validity?: number;
  promo_usage_limit: number;
  promo_show?: boolean;
  user_avail?: number;
  createdAt?: number;
  tableData?: {
    id: number;
  };
}

export const fetchPromos = (search: string): Promise<PromoData[]> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const promoRef = ref(db, "promos");

      const unsubscribe = onValue(
        promoRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const promosArray = Object.entries(data)
              .map(([key, value]) => ({
                ...(value as Omit<PromoData, "id">),
                id: key,
              }))
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              )
              .filter((user) => {
                const formattedDate = user.promo_validity
                  ? moment(user.promo_validity).format("DD MMM YYYY - hh:mm a")
                  : "";
                return (
                  !search ||
                  user.promo_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.promo_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.promo_description
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.promo_discount_type
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.promo_discount_value
                    .toString()
                    .includes(search.toLowerCase()) ||
                  user.promo_usage_limit
                    .toString()
                    .includes(search.toLowerCase()) ||
                  formattedDate.toLowerCase().includes(search.toLowerCase())
                );
              });

            resolve(promosArray as PromoData[]);
          } else {
            resolve([]);
          }
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Promos Error:", error);
      reject(error);
    }
  });
};

export const fetchPromoById = (id: string): Promise<PromoData | null> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const promoRef = ref(db, `promos/${id}`);

      const unsubscribe = onValue(
        promoRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve({ id: id, ...data } as PromoData);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Promo Error:", error);
      reject(error);
    }
  });
};

export const createPromo = (
  promoData: Omit<PromoData, "id">,
): Promise<PromoData> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const promoRef = ref(db, "promos");

      // Add creation timestamp
      const newPromoData = {
        ...promoData,
        createdAt: Date.now(),
      };

      // Generate a new key for the promo
      const newPromoRef = push(promoRef);

      set(newPromoRef, newPromoData)
        .then(() => {
          resolve({ id: newPromoRef.key as string, ...newPromoData });
        })
        .catch((error) => {
          console.error("Error creating promo:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Create Promo Error:", error);
      reject(error);
    }
  });
};

export const updatePromo = (
  id: string,
  updatedData: Partial<PromoData>,
): Promise<PromoData> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const promoRef = ref(db, `promos/${id}`);

      update(promoRef, updatedData)
        .then(() => {
          resolve({ id, ...updatedData } as PromoData);
        })
        .catch((error) => {
          console.error("Error updating promo:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update Promo Error:", error);
      reject(error);
    }
  });
};

export const deletePromo = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const promoRef = ref(db, `promos/${id}`);

      remove(promoRef)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error deleting promo:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Delete Promo Error:", error);
      reject(error);
    }
  });
};
