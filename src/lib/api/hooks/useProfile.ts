// lib/hooks/useProfile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateProfileData,
  uploadProfileImage,
  checkUserExists,
  UserProfile,
} from "../apiHandlers/profileService";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from localStorage on mount
  useEffect(() => {
    try {
      // console.log("All localStorage keys:", Object.keys(localStorage));
      // Find user data from different possible storage keys
      const userData = localStorage.getItem("user");
      const auth = localStorage.getItem("auth");
      
      console.log("userData from localStorage:", userData);
      console.log("auth from localStorage:", auth);
      
    
      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.uid) {
          console.log("Found user ID in 'user' localStorage:", user.uid);
          setUserId(user.uid);
          return;
        }
      }
      
     
      if (auth) {
        const authData = JSON.parse(auth);
        if (authData && authData.user && authData.user.uid) {
          console.log("Found user ID in 'auth' localStorage:", authData.user.uid);
          setUserId(authData.user.uid);
          return;
        }
      }
      
      // Look for any other keys that might contain user data
      for (const key of Object.keys(localStorage)) {
        if (key !== 'user' && key !== 'auth') {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data && (data.uid || (data.user && data.user.uid))) {
              const uid = data.uid || data.user.uid;
              console.log(`Found possible user ID in '${key}' localStorage:`, uid);
              setUserId(uid);
              return;
            }
          } catch {
            // Skip any items that aren't valid JSON
          }
        }
      }
      
      console.warn("Could not find user ID in localStorage");
    } catch (error) {
      console.error("Error reading user from localStorage", error);
    }
  }, []);

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!userId) throw new Error("No user ID");
      return fetchUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, 
  });

  
  /** 
   *    Update profile data
  */
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!userId) throw new Error("No user ID");
      await updateProfileData(userId, data);
      
      // Update local storage with new profile data
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...data };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error updating user in localStorage", error);
      }
      
      return data;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["profile", userId], (oldData: UserProfile | undefined) => {
        return oldData ? { ...oldData, ...updatedData } : undefined;
      });
    },
    onError: (error: Error | unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    }
  });


  const updateProfileImageMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      if (!userId) throw new Error("No user ID");
      const imageUrl = await uploadProfileImage(userId, imageFile);
      
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, profile_image: imageUrl };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error updating user image in localStorage", error);
      }
      
      return imageUrl;
    },
    onSuccess: (imageUrl) => {
      queryClient.setQueryData(["profile", userId], (oldData: UserProfile | undefined) => {
        return oldData ? { ...oldData, profile_image: imageUrl } : undefined;
      });
    },
    onError: (error: Error | unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile image",
        variant: "destructive"
      });
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
  
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileImage: updateProfileImageMutation.mutateAsync,
    checkUserExists,
    
    isUpdating: updateProfileMutation.isPending,
    isUpdatingImage: updateProfileImageMutation.isPending,
  };
};