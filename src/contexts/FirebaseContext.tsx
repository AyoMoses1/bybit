"use client";

import { createContext, useContext, ReactNode } from "react";
import firebase from "../lib/firebase";

// Create the context with proper typing
const FirebaseContext = createContext<typeof firebase | null>(null);

// Props interface for the provider component
interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
