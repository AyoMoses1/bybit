import { addToWallet } from '../apiHandlers/walletService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuditLog } from '@/utils/useAuditLog';
import { AuditAction } from '@/lib/api/apiHandlers/auditService';
import { toast } from 'react-hot-toast';

export const useAddToWallet = () => {
  const queryClient = useQueryClient();
  const { handleAudit } = useAuditLog();
  
  return useMutation({
    mutationFn: ({ uid, amount, reason }: { uid: string; amount: number; reason?: string }) => {
      return addToWallet(uid, amount, reason);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userWallet', variables.uid] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory', variables.uid] });
      
      const auditDescription = variables.reason 
        ? `Credit Amount: ${variables.amount} - Reason: ${variables.reason}`
        : `Credit Amount: ${variables.amount}`;
        
      handleAudit(
        "Wallet", 
        variables.uid, 
        AuditAction.CREATE, 
        auditDescription
      );
      
      toast.success('Wallet balance updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update wallet: ${error.message}`);
    }
  });
};