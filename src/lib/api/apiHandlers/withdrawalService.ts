import { WithdrawalType } from "@/containers/withdrawals";
import firebase from "@/lib/firebase";
import { child, onValue, update } from "firebase/database";

export const fetchWithdrawal = (search: string) => {
  return new Promise((resolve, reject) => {
    try {
      const { withdrawRef } = firebase;

      onValue(withdrawRef, (snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          const arr = Object.keys(data)
            .map((i) => {
              data[i].id = i;
              return data[i];
            })
            .filter(
              (withdrawal) =>
                !search ||
                withdrawal.id?.toLowerCase().includes(search.toLowerCase()) ||
                withdrawal.name?.toLowerCase().includes(search.toLowerCase()) ||
                withdrawal.amount?.toString().includes(search.toLowerCase()) ||
                withdrawal.bankName
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                withdrawal.bankCode
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                withdrawal.bankAccount
                  ?.toLowerCase()
                  .includes(search.toLowerCase()),
            );
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

export const processWithdrawal = (data: WithdrawalType) => {
  return new Promise((resolve, reject) => {
    try {
      const { withdrawRef } = firebase;

      update(child(withdrawRef, data.id), {
        ...data,
        processed: true,
        processDate: new Date().getTime(),
      });
      resolve("Processed Successfully");
    } catch (error) {
      console.error("Fetch Withdrawals Error:", error);
      reject(error);
    }
  });
};
