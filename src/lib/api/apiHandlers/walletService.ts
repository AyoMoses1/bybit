import { getDatabase, ref, get, update, push } from 'firebase/database';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Push notification function
export const requestPushMsg = async (
  token: string, 
  payload: { title: string; msg: string; screen?: string }
) => {
  try {
    const url = 'https://exp.host/--/api/v2/push/send';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: payload.title,
        body: payload.msg,
        data: { screen: payload.screen || 'Wallet' },
        sound: 'default',
        priority: 'high',
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Push notification error:', error);
  }
};

/**
 * Adds funds to a user's wallet 
 * @param uid User ID
 * @param amount Amount to add
 * @param reason Optional reason for the credit
 * @returns Promise that resolves when the operation is complete
 */
export const addToWallet = async (uid: string, amount: number, reason?: string): Promise<void> => {
  try {
    const db = getDatabase();
    const settingsRef = ref(db, 'settings');
    const userRef = ref(db, `users/${uid}`);
    const walletHistoryRef = ref(db, `walletHistory/${uid}`);
    
    // Get settings for decimal places
    const settingsSnapshot = await get(settingsRef);
    const settings = settingsSnapshot.val();
    const decimalPlaces = settings?.decimal || 2;
    
    // Get current user data
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    
    if (!userData) {
      throw new Error("User not found");
    }
    
    let walletBalance = parseFloat(userData.walletBalance || '0');
    walletBalance = parseFloat((walletBalance + parseFloat(amount.toString())).toFixed(decimalPlaces));
    
 
    await update(userRef, { walletBalance });
    
 
    const transactionData = {
      type: 'Credit',
      amount: parseFloat(amount.toString()),
      date: Date.now(),
      txRef: 'AdminCredit'
    };
    
    if (reason) {
      transactionData.txRef = reason;
      Object.assign(transactionData, { note: reason });
    }
    
    await push(walletHistoryRef, transactionData);
    
    if (userData.pushToken) {
      await requestPushMsg(
        userData.pushToken,
        {
          title: 'Wallet Update',
          msg: `Your wallet has been credited with ${amount.toFixed(2)}`,
          screen: 'Wallet'
        }
      );
    }
    
    return;
  } catch (error) {
    console.error('Error adding to wallet:', error);
    throw error;
  }
};

/**
 * Hook for adding to wallet 
 */
export const useAddToWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ uid, amount }: { uid: string; amount: number }) => {
      return addToWallet(uid, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userWallet', variables.uid] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory', variables.uid] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update wallet: ${error.message}`);
    }
  });
};