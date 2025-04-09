import { onValue, ref, getDatabase } from "firebase/database";
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

export const fetchCarById = (id: string) => {
  return new Promise<Complaint>((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `cars/${id}`);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve({ id: id, ...data });
          } else {
            // resolve("Can not get car details");
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
