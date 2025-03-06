// components/FirebaseWrapper.tsx
"use client";

import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { ReactNode } from "react";

interface FirebaseWrapperProps {
  children: ReactNode;
}

export default function FirebaseWrapper({ children }: FirebaseWrapperProps) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
