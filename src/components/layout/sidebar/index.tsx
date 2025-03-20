"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../../assets/svgs/20250218.svg";
import {
  History,
  Navigation,
  LayoutDashboard,
  Users,
  MessageSquareWarning,
  CircleAlert,
  Bell,
  BadgePercent,
  WalletMinimal,
  CarFront,
  ChartColumnBig,
  Car,
  Settings,
  UserPen,
  Power,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { url: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { url: "/add-bookings", title: "Add Bookings", icon: Navigation },
  { url: "/booking-history", title: "Booking History", icon: History },
  { url: "/users", title: "Users", icon: Users },
  { url: "/vehicle-type", title: "Vehicle Type", icon: Car },
  { url: "/cars", title: "Cars", icon: CarFront },
  { url: "/add-to-wallet", title: "Add to Wallet", icon: WalletMinimal },
  { url: "/reports", title: "Reports", icon: ChartColumnBig },
  { url: "/promos", title: "Promos", icon: BadgePercent },
  { url: "/push-notification", title: "Push Notifications", icon: Bell },
  { url: "/sos", title: "SOS", icon: CircleAlert },
  { url: "/complaints", title: "Complaints", icon: MessageSquareWarning },
  // {
  //   url: "/beneficiaries",
  //   title: "Beneficiaries",
  //   icon: BeneficiariesIconSVG,
  // },
];

const otherMenuItems = [
  {
    url: "/payment-settings",
    title: "Payment Settings",
    icon: History,
  },
  { url: "/settings", title: "Settings", icon: Settings },
  { url: "/profile", title: "profile", icon: UserPen },
  { url: "/logout", title: "Logout", icon: Power },
];

function AppSidebar() {
  const router = useRouter();

  const isActive = (url: string): boolean => {
    const pathname = usePathname();
    if (
      url === "/users" &&
      [
        "/users",
        "/add-super-admin",
        "/update-admin",
        "/add-fleet-admin",
        "/update-fleet-admin",
        "/customer",
        "/driver",
      ].some((route) => pathname.startsWith(route))
    ) {
      return true;
    }

    if (
      url === "/cars" &&
      ["/cars", "/add-car"].some((route) => pathname.startsWith(route))
    ) {
      return true;
    }
    return pathname === url;
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <Sidebar className="pb-10 pt-0">
      <div className="flex flex-col pb-2 pl-12 pt-5">
        <Image
          src={Logo}
          alt="Koloride Logo"
          width={100}
          height={24}
          className="object-contain"
        />
        <p className="mt-[-5px] text-xs font-[400] tracking-[0.3px] text-[#FAFAFA]">
          Admin
        </p>
      </div>

      <SidebarContent className="">
        <SidebarGroup className="space-y-2.5 pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item, index) => (
                <div key={index} className="flex gap-5">
                  {isActive(item.url) ? (
                    <div className="h-[50px] w-[4px] rounded-r-[4px] bg-[#DA4CBF] text-white" />
                  ) : (
                    <div className="h-[50px] w-[4px] rounded-r-[4px] bg-[#1E1E1E] text-white" />
                  )}

                  <SidebarMenuItem className="w-[85%]" key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon className="size-6" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-2">
          <hr />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item, index) => (
                <div key={index} className="flex gap-5">
                  {isActive(item.url) ? (
                    <div className="h-[50px] w-[4px] rounded-r-[4px] bg-[#DA4CBF] text-white" />
                  ) : (
                    <div className="h-[50px] w-[4px] rounded-r-[4px] bg-[#1E1E1E] text-white" />
                  )}

                  <SidebarMenuItem className="w-[85%]" key={item.title}>
                    {item.url === "/logout" ? (
                      <SidebarMenuButton asChild onClick={() => handleLogout()}>
                        <button>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url}>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
