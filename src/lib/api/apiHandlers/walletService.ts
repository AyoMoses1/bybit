import { getDatabase, ref, get, update, push } from 'firebase/database';
import { toast } from 'react-hot-toast';

/**
 * Adds funds to a user's wallet (direct client-side implementation)
 * @param uid User ID
 * @param amount Amount to add
 * @returns Promise that resolves when the operation is complete
 */
export const addToWallet = async (uid: string, amount: number): Promise<void> => {
  try {
    // Get database references
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
    
    // Calculate new balance
    let walletBalance = parseFloat(userData.walletBalance || '0');
    walletBalance = parseFloat((walletBalance + parseFloat(amount.toString())).toFixed(decimalPlaces));
    
    // Update wallet balance
    await update(userRef, { walletBalance });
    
    // Add transaction to history
    await push(walletHistoryRef, {
      type: 'Credit',
      amount: parseFloat(amount.toString()),
      date: Date.now(),
      txRef: 'AdminCredit'
    });
    
    // Send push notification if user has a push token
    if (userData.pushToken) {
      // You can implement push notification here if needed
      // RequestPushMsg(userData.pushToken, {...});
    }
    
    toast.success('Wallet balance updated successfully');
    return;
  } catch (error) {
    console.error('Error adding to wallet:', error);
    toast.error(`Failed to update wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};


