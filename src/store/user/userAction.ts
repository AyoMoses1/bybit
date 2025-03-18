import { onValue, ref, getDatabase, update, set, off } from "firebase/database";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebase from "@/lib/firebase";

export const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, "users");

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const usersArray = Object.entries(data)
              .map(([key, value]) => ({
                id: key,
                ...(value as any),
              }))
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              );

            resolve(usersArray);
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
      console.error("Fetch User Error:", error);
      reject(error);
    }
  });
};

export const fetchUser = (userType: string, search?: string) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, "users");

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const usersArray = Object.entries(data)
              .map(([key, value]) => ({
                id: key,
                ...(value as any),
              }))
              .filter(
                (user) =>
                  user.usertype === userType &&
                  (!search ||
                    user.name?.toLowerCase().includes(search.toLowerCase()) ||
                    user.email?.toLowerCase().includes(search.toLowerCase())),
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              );

            resolve(usersArray);
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
      console.error("Fetch User Error:", error);
      reject(error);
    }
  });
};

export const fetchUserById = (id: string) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${id}`);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve({ id: id, ...data });
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
      console.error("Fetch User Error:", error);
      reject(error);
    }
  });
};

export const updateUser = (id: string, updatedData: Record<string, any>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${id}`);

      update(userRef, updatedData)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update User Error:", error);
      reject(error);
    }
  });
};

export const createUser = (updatedData: Record<string, any>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users`);

      set(userRef, updatedData)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Create User Error:", error);
      reject(error);
    }
  });
};

export const updateCustomerProfileImage = async (
  imageBlob: Blob,
  id: string,
) => {
  try {
    const { profileImageRef } = firebase;
    const uid = id;

    const uploadTask = uploadBytesResumable(profileImageRef(uid), imageBlob);

    await uploadTask;

    const imageUrl = await getDownloadURL(profileImageRef(uid));

    return imageUrl;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

export const fetchUserRides = (userId: string) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `bookings/`);

      off(userRef);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve(null);
            return;
          }

          const data = snapshot.val();
          // const rides = Object.entries(data).map(([id, value]: any) => ({
          //   id,
          //   pickupAddress: value.pickup?.add || "",
          //   dropAddress: value.drop?.add || "",
          //   discount: value.discount || 0,
          //   cashPaymentAmount: value.cashPaymentAmount || 0,
          //   cardPaymentAmount: value.cardPaymentAmount || 0,
          //   ...value,
          // }));

          resolve(data);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch User Error:", error);
      reject(error);
    }
  });
};

export const fetchUserWalletHistory = (id: string) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const walletHistoryRef = ref(db, "walletHistory/" + id);

      const unsubscribe = onValue(walletHistoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const arr = Object.keys(data).map((i) => {
            data[i].id = i;
            return data[i];
          });

          resolve(arr.reverse());
        } else {
          resolve([]);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      reject(error);
    }
  });
};
