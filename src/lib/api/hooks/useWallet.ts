import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addToWallet } from "@/lib/api/apiHandlers/walletService";
import { useAuditLog } from "@/utils/useAuditLog";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import toast from "react-hot-toast";

export const useAddToWallet = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { handleAudit } = useAuditLog();

  const handleAddToWallet = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) {
      setAlertType("error");
      setAlertMessage("Please select a user and enter a valid amount");
      setShowAlert(true);
      return;
    }

    if (isPending) return;

    setIsPending(true);
    setShowAlert(false);

    try {
      const uid = selectedUser;
      const amountValue = parseFloat(amount);
      const reasonValue = reason.trim() || undefined;

      await addToWallet(uid, amountValue, reasonValue);

      const auditDescription = reasonValue
        ? `Credit Amount: ${amountValue} - Reason: ${reasonValue}`
        : `Credit Amount: ${amountValue}`;

      handleAudit("Wallet", uid, AuditAction.CREATE, auditDescription);

      await queryClient.invalidateQueries({ queryKey: ["userWallet", uid] });
      await queryClient.invalidateQueries({ queryKey: ["walletHistory", uid] });

      setAmount("");
      setReason("");
      setSelectedUser("");
      setSelectedUserName("");

      setAlertType("success");
      setAlertMessage(`Successfully added ${amountValue} to wallet`);
      setShowAlert(true);
    } catch (error) {
      if (error instanceof Error) {
        setAlertType("error");
        setAlertMessage(`Failed to add amount: ${error.message}`);
        setShowAlert(true);
        toast.error(`Failed to update wallet: ${error.message}`);
      } else {
        setAlertType("error");
        setAlertMessage("An unknown error occurred.");
        setShowAlert(true);
        toast.error("Failed to update wallet: Unknown error");
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return {
    selectedUser,
    setSelectedUser,
    selectedUserName,
    setSelectedUserName,
    amount,
    setAmount,
    reason,
    setReason,
    isPending,
    handleAddToWallet,
    alertMessage,
    alertType,
    showAlert,
  };
};
