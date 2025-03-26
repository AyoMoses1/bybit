"use client";
import AddToWallet from "@/containers/wallet/addToWallet";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Toaster } from "react-hot-toast";

const AddToWalletPage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <AddToWallet />
      <Toaster position="top-right" />
    </main>
  );
};

export default ProtectedRoute(AddToWalletPage);
