import { onValue, ref, getDatabase, update } from "firebase/database";
import { Complaint } from "../hooks/complaints";

export const fetchComplaints = (search?: string) => {
  return new Promise<Complaint[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, "complain");

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }
          const data = snapshot.val();
          const arr = Object.keys(data || {})
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter(
              (user) =>
                !search ||
                user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                user.role?.toLowerCase().includes(search.toLowerCase()) ||
                user.subject?.toLowerCase().includes(search.toLowerCase()),
            );
          resolve(arr.reverse());
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Cars Error:", error);
      reject(error);
    }
  });
};

export const updateComplaint = (
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedData: Record<string, any>,
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `complain/${id}`);

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
