"use client";
import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { AppSidebar, Header } from "@/components/layout";

const AppSidebarLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const showSidebar = pathname === "/" || pathname === "/sign-up";

  return (
    <div>
      {" "}
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {showSidebar ? <></> : <AppSidebar />}

          <div className="relative w-full overflow-auto">
            <Header />

            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppSidebarLayout;
