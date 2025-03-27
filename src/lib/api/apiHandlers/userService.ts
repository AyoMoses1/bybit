import {
  onValue,
  ref,
  getDatabase,
  update,
  off,
  orderByChild,
  equalTo,
  query,
  remove,
} from "firebase/database";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebase from "@/lib/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import toast from "react-hot-toast";

export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  profile_image?: string;
  createdAt?: string;
  usertype?: string;
  approved?: boolean;
};

export const fetchUsers = () => {
  return new Promise<User[]>((resolve, reject) => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return new Promise<User[]>((resolve) => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(value as any),
              }))
              .filter(
                (user) =>
                  user.usertype === userType &&
                  (!search ||
                    user.firstName
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    user.mobile?.toLowerCase().includes(search.toLowerCase()) ||
                    user.lastName
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
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
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch User Error:", error);
    }
  });
};

export const fetchUserById = (id: string) => {
  return new Promise((resolve) => {
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
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch User Error:", error);
    }
  });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = (updatedData: any) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const auth = getAuth();
      const db = getDatabase();

      createUserWithEmailAndPassword(auth, updatedData.email, "000000")
        .then((userCredential) => {
          const uid = userCredential.user.uid;

          if (!uid) {
            reject("Failed to retrieve UID from Firebase Auth");
          }

          const userRef = ref(db, `users/${uid}`);
          return update(userRef, { ...updatedData, uid });
        })
        .then(() => {
          resolve();
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          if (error?.code === "auth/email-already-in-use") {
            toast.error("Email already in use");
          }
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteUser = (id: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${id}`);

      remove(userRef)
        .then(() => {
          console.log("User deleted successfully!");
          resolve();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Delete User Error:", error);
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

export const fetchUserRides = (userId: string, userType: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<any[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = query(
        ref(db, "bookings"),
        orderByChild(userType),

        equalTo(userId),
      );

      off(userRef);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }

          const data = snapshot.val();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rides = Object.entries(data).map(([id, value]: any) => ({
            id,
            pickupAddress: value.pickup?.add || "",
            dropAddress: value.drop?.add || "",
            discount: value.discount || 0,
            cashPaymentAmount: value.cashPaymentAmount || 0,
            cardPaymentAmount: value.cardPaymentAmount || 0,
            ...value,
          }));

          resolve(rides.reverse());
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<any[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const walletHistoryRef = ref(db, `walletHistory/${id}`);

      const unsubscribe = onValue(
        walletHistoryRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const historyArray = Object.entries(data)
              .map(([key, value]) => ({
                id: key,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(value as any),
              }))
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              );

            resolve(historyArray.reverse());
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
      console.error("Fetch Wallet History Error:", error);
      reject(error);
    }
  });
};
