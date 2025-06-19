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

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="sticky top-0 h-screen">
          <AppSidebar />
        </div>
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default AppSidebarLayout;
