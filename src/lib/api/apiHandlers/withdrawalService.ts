import { WithdrawalType } from "@/containers/withdrawals";
import firebase from "@/lib/firebase";
import { child, onValue, update } from "firebase/database";

export const fetchWithdrawal = (
  search: string,
  selectedMenu: boolean | null,
) => {
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
            .filter((withdrawal) => {
              const lowerSearch = search?.toLowerCase() || "";

              const matchesSearch =
                !search ||
                withdrawal.id?.toLowerCase().includes(lowerSearch) ||
                withdrawal.name?.toLowerCase().includes(lowerSearch) ||
                withdrawal.amount?.toString().includes(lowerSearch) ||
                withdrawal.bankName?.toLowerCase().includes(lowerSearch) ||
                withdrawal.bankCode?.toLowerCase().includes(lowerSearch) ||
                withdrawal.bankAccount?.toLowerCase().includes(lowerSearch);

              const matchesMenu =
                selectedMenu === null || withdrawal.processed !== selectedMenu;

              return matchesSearch && matchesMenu;
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
