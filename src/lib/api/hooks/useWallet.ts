import { addToWallet } from '../apiHandlers/walletService'; 

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddToWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uid, amount }: { uid: string; amount: number }) => {
      return addToWallet(uid, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userWallet', variables.uid] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory', variables.uid] });
    }
  });
};