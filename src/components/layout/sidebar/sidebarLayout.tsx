// src/components/layout/sidebar/sidebarLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from ".";
import Header from "../header";

interface AppSidebarLayoutProps {
  children: ReactNode;
}

const AppSidebarLayout = ({ children }: AppSidebarLayoutProps) => {
  const pathname = usePathname();

  // Hide sidebar and header on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show sidebar and header for all other pages
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppSidebarLayout;
