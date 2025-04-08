"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../../assets/svgs/logo.svg";
import { Power } from "lucide-react";
import dashboard from "../../../assets/icons/dashboard.svg";
import addBookings from "../../../assets/icons/addBookings.svg";
import bookingHistory from "../../../assets/icons/bookingHistory.svg";
import users from "../../../assets/icons/users.svg";
import vehicleType from "../../../assets/icons/vehicleType.svg";
import cars from "../../../assets/icons/cars.svg";
import withdrawals from "../../../assets/icons/withdrawal.svg";
import addToWallet from "../../../assets/icons/addtoWallet.svg";
import reports from "../../../assets/icons/reports.svg";
import promos from "../../../assets/icons/promos.svg";
import pushNotifications from "../../../assets/icons/pushNotification.svg";
import sos from "../../../assets/icons/sos.svg";
import complaint from "../../../assets/icons/complaint.svg";
import profile from "../../../assets/icons/profile.svg";
import settings from "../../../assets/icons/settings.svg";
import audit from "../../../assets/icons/audit.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAuth, signOut } from "firebase/auth";

const mainMenuItems = [
  { url: "/dashboard", title: "Dashboard", image: dashboard },
  { url: "/add-bookings", title: "Add Bookings", image: addBookings },
  { url: "/booking-history", title: "Booking History", image: bookingHistory },
  { url: "/users", title: "Users", image: users },
  { url: "/vehicle-type", title: "Vehicle Type", image: vehicleType },
  { url: "/cars", title: "Cars", image: cars },
  { url: "/withdrawals", title: "Withdrawals", image: withdrawals },
  { url: "/add-to-wallet", title: "Add to Wallet", image: addToWallet },
  { url: "/reports", title: "Reports", image: reports },
  { url: "/promos", title: "Promos", image: promos },
  {
    url: "/push-notification",
    title: "Push Notifications",
    image: pushNotifications,
  },
  { url: "/sos", title: "SOS", image: sos },
  { url: "/complaints", title: "Complaints", image: complaint },
  { url: "/audit", title: "Audit", image: audit },
];

const otherMenuItems = [
  {
    url: "/payment-settings",
    title: "Payment Settings",
    image: settings,
  },
  { url: "/settings", title: "Settings", image: settings },
  { url: "/profile", title: "Profile", image: profile },
  { url: "/logout", title: "Logout", icon: Power },
];

function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (url: string): boolean => {
    if (
      url === "/users" &&
      [
        "/users",
        "/add-super-admin",
        "/add-customers",
        "/add-drivers",
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
      url === "/vehicle-type" &&
      ["/vehicle-type", "/vehicle-type/[id]", "/add-vehicle"].some((route) =>
        pathname.startsWith(route),
      )
    ) {
      return true;
    }

    if (
      url === "/booking-history" &&
      ["/booking-history", "/booking-history/[id]"].some((route) =>
        pathname.startsWith(route),
      )
    ) {
      return true;
    }

    if (
      url === "/cars" &&
      ["/cars", "/add-car"].some((route) => pathname.startsWith(route))
    ) {
      return true;
    }

    if (
      url === "/push-notification" &&
      ["/push-notification", "/add-notification"].some((route) =>
        pathname.startsWith(route),
      )
    ) {
      return true;
    }

    if (
      url === "/withdrawals" &&
      ["/withdrawals", "/withdrawals/[id]"].some((route) =>
        pathname.startsWith(route),
      )
    ) {
      return true;
    }
    return pathname === url;
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.clear();
    router.push("/");
  };

  return (
    <Sidebar className="pb-10 pt-0">
      <div className="flex flex-col bg-white pb-2 pl-12 pt-6">
        <Image
          src={Logo}
          alt="Koloride Logo"
          width={100}
          height={24}
          className="object-contain"
        />
        <p className="mt-[1px] pb-2 text-xs font-[400] tracking-[0.3px] text-[#000]">
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
                      {item.image ? (
                        <Link href={item.url}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={20}
                            height={20}
                          />
                          <span>{item.title}</span>
                        </Link>
                      ) : null}
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
                      <>
                        {item.icon ? (
                          <SidebarMenuButton
                            asChild
                            onClick={() => handleLogout()}
                          >
                            <button>
                              <item.icon className="size-5" />
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        ) : null}
                      </>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        {item.image ? (
                          <Link href={item.url}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={18}
                              height={18}
                            />
                            <span>{item.title}</span>
                          </Link>
                        ) : null}
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
