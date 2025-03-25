// components/ui/data-table/DataTableToolbar.js
"use client";
import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EyeClosed, SearchIcon } from "lucide-react";
import { assetLib } from "@/lib/assets";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowEyeIconSVG } from "@/svgs";

const DataTableToolbar = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  return (
    <div className="mb-4 flex flex-col gap-4 bg-background">
      <div className="flex items-center justify-between rounded-lg border-4 border-double bg-background p-4">
        <div>
          <p className="text-sm text-muted-foreground">CURRENT BALANCE</p>
          <div className="relative">
            {!isVisible ? (
              <Image
                src={assetLib.backdrop}
                alt="blured account balance"
                width={356}
                height={100}
              />
            ) : (
              <h2 className="text-2xl font-semibold text-foreground">
                <span>$</span> 624,125,000
              </h2>
            )}
          </div>
        </div>

        <div
          onClick={toggleVisibility}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-muted"
        >
          {isVisible ? (
            <EyeClosed className="text-muted-foreground" />
          ) : (
            <ShowEyeIconSVG />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
};

export default DataTableToolbar;

// components/ui/data-table/DataTableSearch.js

export const DataTableSearch = () => {
  return (
    <div className="max-w-sm">
      <Input placeholder="Search..." Icon={SearchIcon} />
    </div>
  );
};

const tabsData = [
  {
    value: "all",
    label: "All Wallets",
    icon: assetLib.avatar,
    rounded: "rounded-l-lg",
  },
  { value: "cad", label: "$ CAD" },
  { value: "usd", label: "$ USD" },
  { value: "ngn", label: "₦ NGN", rounded: "rounded-r-lg" },
];

export const DataTableTabs = () => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-4 rounded-lg border border-border bg-muted">
        {tabsData.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground focus:outline-none data-[state=active]:bg-background data-[state=active]:text-foreground ${
              tab.rounded || ""
            }`}
          >
            {tab.icon && (
              <Image
                src={tab.icon}
                alt={"all wallet icon"}
                width={12}
                height={12}
                className="mr-2"
              />
            )}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

// components/ui/data-table/DataTableViewOptions.js

export const DataTableViewOptions = () => {
  return (
    <div className="flex space-x-4">
      <div className="rounded-[8px] border-[1px] border-border p-2">
        <Image
          src={assetLib.britainFlag}
          alt="refresh icon"
          width={13.33}
          height={13.33}
        />
      </div>
      <div className="rounded-[8px] border-[1px] border-border p-2">
        <Image
          src={assetLib.canadaFlag}
          alt="sort icon"
          width={13.33}
          height={13.33}
        />
      </div>
      <div className="rounded-[8px] border-[1px] border-border p-2">
        <Image
          src={assetLib.logoLight}
          alt="sort icon"
          width={13.33}
          height={13.33}
        />
      </div>
    </div>
  );
};

export const DataTableSelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] focus:outline-none">
        <SelectValue
          defaultValue={"All transactions"}
          className="focus:outline-none"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};
