"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import TextInput from "@/components/TextInput";
import { ChevronDown } from "lucide-react";

const GeneralSetting = () => {
  const [toggles, setToggles] = useState({
    active: true,
    testMode1: false,
    testMode2: false,
    allowMultiCountry: true,
    convertToMile: false,
    customerWithdraw: false,
    carListView: false,
    useDistanceMatrixAPI: false,
    repeatSound: false,
    disableSystemPrice: false,
    disableTips: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-visible bg-gray-100 p-4">
      <div className="relative">
        <div className="sticky top-10 flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium">Currency Settings</h2>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <div>
              <TextInput
                label="Currency Symbol *"
                type="text"
                placeholder="$"
              />
            </div>
            <div>
              <TextInput
                label="Currency Code *"
                type="text"
                placeholder="USD"
              />
            </div>
            <div>
              <TextInput label="Set Decimal *" type="text" placeholder="2" />
            </div>
          </div>
        </div>

        <div className="h-44 rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Active</span>
                <Switch
                  checked={toggles.active}
                  onCheckedChange={() => handleToggle("active")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Test Mode</span>
                <Switch
                  checked={toggles.testMode1}
                  onCheckedChange={() => handleToggle("testMode1")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Test Mode</span>
                <Switch
                  checked={toggles.testMode2}
                  onCheckedChange={() => handleToggle("testMode2")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 border-t border-gray-200"></div>

      <h2 className="mb-4 text-xl font-medium">Advance Settings</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-52 rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-6">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">
                Select Country *
              </label>
              <div className="relative">
                <select className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors">
                  <option value="" disabled className="text-[#697077]">
                    United States
                  </option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown />
                </div>
              </div>
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">
                Autocomplete Country Restriction
              </label>
              <div className="relative">
                <select className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors">
                  <option value="" disabled className="text-[#697077]">
                    Nigeria
                  </option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-0 h-full rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Allow Multi Country Selection
                </span>
                <Switch
                  checked={toggles.allowMultiCountry}
                  onCheckedChange={() => handleToggle("allowMultiCountry")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Convert to Mile</span>
                <Switch
                  checked={toggles.convertToMile}
                  onCheckedChange={() => handleToggle("convertToMile")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Customer Withdraw</span>
                <Switch
                  checked={toggles.customerWithdraw}
                  onCheckedChange={() => handleToggle("customerWithdraw")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Car list view Horizontal
                </span>
                <Switch
                  checked={toggles.carListView}
                  onCheckedChange={() => handleToggle("carListView")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Use Distance Matrix API
                </span>
                <Switch
                  checked={toggles.useDistanceMatrixAPI}
                  onCheckedChange={() => handleToggle("useDistanceMatrixAPI")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Repeat sound on new trip
                </span>
                <Switch
                  checked={toggles.repeatSound}
                  onCheckedChange={() => handleToggle("repeatSound")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Disable System Price
                </span>
                <Switch
                  checked={toggles.disableSystemPrice}
                  onCheckedChange={() => handleToggle("disableSystemPrice")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Disable Tips</span>
                <Switch
                  checked={toggles.disableTips}
                  onCheckedChange={() => handleToggle("disableTips")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 border-t border-gray-200"></div>

      <h2 className="mb-4 text-xl font-medium">Wallets Denomination</h2>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-36 rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <div>
              <TextInput
                label="Wallet Denominations"
                type="text"
                placeholder="USD"
              />
            </div>
          </div>
        </div>
        <div className="h-full rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Booking OTP</span>
                <Switch
                  checked={toggles.allowMultiCountry}
                  onCheckedChange={() => handleToggle("allowMultiCountry")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Driver Approval</span>
                <Switch
                  checked={toggles.convertToMile}
                  onCheckedChange={() => handleToggle("convertToMile")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Car Approval</span>
                <Switch
                  checked={toggles.customerWithdraw}
                  onCheckedChange={() => handleToggle("customerWithdraw")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Verify Id / Password
                </span>
                <Switch
                  checked={toggles.carListView}
                  onCheckedChange={() => handleToggle("carListView")}
                />
              </div>

              <div className="mt-2 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium">Tip Denominations</h2>

      <div className="mb-2 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-36 rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <div>
              <TextInput
                label="Tip Denominations"
                type="text"
                placeholder="USD"
              />
            </div>
          </div>
        </div>
        <div className="h-full rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Email Login</span>
                <Switch
                  checked={toggles.allowMultiCountry}
                  onCheckedChange={() => handleToggle("allowMultiCountry")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Mobile Login</span>
                <Switch
                  checked={toggles.convertToMile}
                  onCheckedChange={() => handleToggle("convertToMile")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Social Login</span>
                <Switch
                  checked={toggles.customerWithdraw}
                  onCheckedChange={() => handleToggle("customerWithdraw")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium">Panic Dial Number</h2>

      <div className="mb-2 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-36 rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <div>
              <TextInput
                label="Panic Dial Number"
                type="text"
                placeholder="080"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSetting;
