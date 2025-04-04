"use client";
import React, { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, User } from "@/lib/api/apiHandlers/userWalletService";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToWallet } from "@/lib/api/hooks/useWallet";

const AddToWallet: React.FC = () => {
  const {
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
  } = useAddToWallet();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSelect = (id: string, name: string) => {
    setSelectedUser(id);
    setSelectedUserName(name);
    setUserDropdownOpen(false);
  };

  return (
    <div className="container max-w-2xl px-6 py-8">
      {showAlert && (
        <div
          className={`rounded-md p-4 ${alertType === "success" ? "border border-green-200 bg-green-50" : "border border-red-200 bg-red-50"}`}
        >
          <p
            className={
              alertType === "success" ? "text-green-800" : "text-red-800"
            }
          >
            {alertMessage}
          </p>
        </div>
      )}
      <h1 className="mb-6 text-3xl font-bold">Add to User&#39;s Wallet</h1>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-medium">Select User</label>
            <div ref={userDropdownRef} className="relative">
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`mt-1 flex h-[48px] w-full cursor-pointer items-center border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${
                  selectedUser ? "text-[#21272A]" : "text-[#697077]"
                }`}
              >
                {selectedUser ? selectedUserName : "Select User"}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <ChevronDown className="size-5" />
                </div>
              </div>

              {userDropdownOpen && (
                <div className="absolute z-10 mt-0 max-h-[300px] w-full overflow-auto border border-gray-200 bg-white shadow-lg">
                  {isLoadingUsers ? (
                    <div className="px-4 py-2 text-[#697077]">
                      Loading users...
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() =>
                          handleUserSelect(
                            user.id,
                            `${user.firstName} ${user.lastName} (${user.mobile || user.email})`,
                          )
                        }
                        className="cursor-pointer px-4 py-2 text-[#21272A] hover:bg-gray-100"
                      >
                        {user.firstName} {user.lastName} (
                        {user.mobile || user.email})
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-base font-medium">
              Amount to Add
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount to credit in wallet"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-base font-medium">
              Reason (Optional)
            </label>
            <input
              id="reason"
              type="text"
              placeholder="Enter reason for credit (promotion, refund, etc.)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors"
            />
          </div>

          <Button
            className="flex w-full rounded-full py-4 text-white hover:bg-[#DA4CBF]"
            onClick={handleAddToWallet}
            disabled={isPending || !selectedUser || !amount}
          >
            <span>{isPending ? "Processing..." : "Add to Wallet"}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToWallet;
