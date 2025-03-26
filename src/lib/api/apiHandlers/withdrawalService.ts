import firebase from "@/lib/firebase";
import { onValue } from "firebase/database";

export const fetchWithdrawal = () => {
  return new Promise((resolve, reject) => {
    try {
      const { withdrawRef } = firebase;

      onValue(withdrawRef, (snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          const arr = Object.keys(data).map((i) => {
            data[i].id = i;
            return data[i];
          });
          resolve(arr.reverse());
        } else {
          resolve("No WITHDRAWS available.");
        }
      });
    } catch (error) {
      console.error("Fetch Withdrawals Error:", error);
      reject(error);
    }
  });
};
