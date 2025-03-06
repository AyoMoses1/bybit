"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BoxIcon, Home, ShoppingBag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assetLib } from "@/lib/assets";

import BeneficiariesIconSVG from "@/svgs/BeneficiariesSVG";
import SettingsIconSVG from "@/svgs/SettingsSVG";
import HelpIconSVG from "@/svgs/HelpSVG";

const mainMenuItems = [
  { url: "/dashboard", title: "Dashboard", icon: Home },
  { url: "/transactions", title: "Transactions", icon: ShoppingBag },
  { url: "/wallets", title: "Wallets", icon: BoxIcon },
  {
    url: "/beneficiaries",
    title: "Beneficiaries",
    icon: BeneficiariesIconSVG,
  },
];

const otherMenuItems = [
  { url: "/settings", title: "Settings", icon: SettingsIconSVG },
  { url: "/help-center", title: "Help Center", icon: HelpIconSVG },
];

function AppSidebar() {
  const isActive = (url: string): boolean => {
    const pathname = usePathname();
    return pathname === url;
  };

  return (
    <Sidebar className="pb-10 pt-0">
      <div className="border-greyScale-100 flex h-[72px] items-center border-b-[1px] pl-3">
        <Image
          src={assetLib.logoLight}
          alt="Settla Logo Light"
          width={100}
          height={24}
          className="object-contain"
        />
      </div>

      <SidebarContent className="px-4">
        <SidebarGroup className="space-y-2.5 pt-4">
          <SidebarGroupLabel className="text-greyScale-300">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mb-1 mt-auto">
          <div className="border-greyScale-100 bg-greyScale-25 flex flex-col gap-[18px] rounded-[15px] border-[1px] p-5">
            <span className="flex justify-between">
              <p className="text-sm font-[500] text-gray-900">Account update</p>
              <p className="text-sm font-[500] text-gray-900">30% left</p>
            </span>
            <Progress value={70} />
            <Button className="bg-primary-700 px-10 py-[9.5px]">
              Complete Profile
            </Button>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
