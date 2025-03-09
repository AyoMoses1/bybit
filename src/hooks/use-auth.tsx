// hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = document.cookie.includes("token=");

      if (!hasToken) {
        router.replace("/auth");
      }
    };

    checkAuth();

    // Add event listener for popstate (browser back/forward)
    const handlePopState = () => {
      checkAuth();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, pathname]);
};
