import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import firebase from '@/lib/firebase';
import { onValue, get, set } from 'firebase/database';

type CancelReason = {
  label: string;
};

type CancelReasonResult = {
  simple: string[];
  complex: CancelReason[];
};

const fetchCancelReasonsData = (): Promise<CancelReasonResult> => {
  return new Promise((resolve, reject) => {
    const { cancelreasonRef } = firebase;
    onValue(cancelreasonRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        const simple = data.map((item: CancelReason) => item.label);
        resolve({ simple, complex: data });
      } else {
        resolve({ simple: [], complex: [] }); 
      }
    }, (error) => {
      reject(error);
    });
  });
};

export const useCancelReasons = () =>
  useQuery<CancelReasonResult>({
    queryKey: ['cancelReasons'],
    queryFn: fetchCancelReasonsData,
    retry: false,
  });
  
export const useAddCancelReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReason: CancelReason) => {
      const { cancelreasonRef } = firebase;
      
      const snapshot = await get(cancelreasonRef);
      const current: CancelReason[] = snapshot.val() || [];

      const updated = [newReason, ...current];
      return set(cancelreasonRef, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cancelReasons'] });
    },
  });
};

export const useEditCancelReasons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reasons: CancelReason[]) => {
      const { cancelreasonRef } = firebase;
      return set(cancelreasonRef, reasons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cancelReasons'] }); 
    },
  });
};