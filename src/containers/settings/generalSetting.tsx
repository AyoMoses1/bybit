"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import TextInput from "@/components/TextInput";
import { ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppInfo, useUpdateAppInfo } from "@/lib/api/hooks/settings";
import { toast } from "react-hot-toast";
import { SettingsType } from "@/lib/api/apiHandlers/settingsService";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";

const FIELD_LABELS: Record<keyof SettingsType, string> = {
  symbol: "Currency Symbol",
  code: "Currency Code",
  decimal: "Decimal Places",
  swipe_symbol: "Swipe Symbol Direction",
  disable_online: "Disable Online Payments",
  disable_cash: "Disable Cash Payments",
  country: "Country",
  restrictCountry: "Country Restriction",
  AllowCountrySelection: "Allow Multi Country Selection",
  convert_to_mile: "Convert to Mile",
  RiderWithDraw: "Customer Withdraw",
  horizontal_view: "Car List View Horizontal",
  useDistanceMatrix: "Use Distance Matrix API",
  CarHornRepeat: "Repeat Sound on New Trip",
  disablesystemprice: "Disable System Price",
  disable_tips: "Disable Tips",
  walletMoneyField: "Wallet Denominations",
  tipMoneyField: "Tip Denominations",
  panic: "Panic Dial Number",
  driverRadius: "Driver Radius",
  driverThreshold: "Driver Threshold",
  otp_secure: "Booking OTP",
  driver_approval: "Driver Approval",
  carApproval: "Car Approval",
  imageIdApproval: "Verify ID/Passport",
  emailLogin: "Email Login",
  mobileLogin: "Mobile Login",
  socialLogin: "Social Login",
  negativeBalance: "Allow Driver Negative Balance",
  realtime_drivers: "Driver Live Location",
  bank_fields: "Bank Reg Fields",
  showLiveRoute: "Show Live Route",
  carType_required: "Car Is Required",
  term_required: "Term Required",
  license_image_required: "License Image Required",
  coustomerBidPriceType: "Bid Price Type",
  bidprice: "Bid Lower Price",
  coustomerBidPrice: "Disable Customer Bid Price",
  bonus: "Referral Bonus",
  appName: "App Name",
  CompanyName: "Company Name",
  CompanyAddress: "Company Address",
  CompanyPhone: "Company Phone",
  CompanyWebsite: "Company Website",
  CompanyTerms: "Company Terms",
  CompanyTermCondition: "Company Terms & Conditions",
  contact_email: "Contact Email",
  FacebookHandle: "Facebook Handle",
  InstagramHandle: "Instagram Handle",
  TwitterHandle: "Twitter Handle",
  PlayStoreLink: "Play Store Link",
  AppleStoreLink: "App Store Link",
  AppleLoginEnabled: "Apple Login Enabled",
  FacebookLoginEnabled: "Facebook Login Enabled",
  AllowCriticalEditsAdmin: "Allow Critical Edits (Admin)",
  autoDispatch: "Auto Dispatch",
  customMobileOTP: "Custom Mobile OTP",
  prepaid: "Prepaid System",
  mapLanguage: "Map Language",
  bookingFlow: "Booking Flow",
};

const GeneralSetting = () => {
  const queryClient = useQueryClient();
  const { data: settings, isLoading, isError } = useAppInfo();
  const updateSettingsMutation = useUpdateAppInfo();
  const { handleAudit } = useAuditLog();

  const [formData, setFormData] = useState<Partial<SettingsType>>({});
  const [initialData, setInitialData] = useState<Partial<SettingsType>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setInitialData(settings);
    }
  }, [settings]);

  const handleToggle = (key: keyof SettingsType) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTextChange = (
    key: keyof SettingsType,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectChange = (key: keyof SettingsType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNumberChange = (key: keyof SettingsType, value: string) => {
    const numValue = value === "" ? "" : Number(value);
    setFormData((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const getChangedFields = () => {
    const changes: string[] = [];

    (Object.keys(formData) as Array<keyof SettingsType>).forEach((key) => {
      if (JSON.stringify(formData[key]) !== JSON.stringify(initialData[key])) {
        changes.push(FIELD_LABELS[key] || key);
      }
    });

    return changes;
  };

  const handleSubmit = () => {
    if (!formData) return;

    if (formData.emailLogin === false && formData.mobileLogin === false) {
      toast.error("Either email or mobile login must be enabled");
      return;
    }

    if (formData.symbol === "" || formData.code === "") {
      toast.error("Currency symbol and code are required");
      return;
    }

    const changedFields = getChangedFields();
    if (changedFields.length === 0) {
      toast.error("No changes detected");
      return;
    }

    updateSettingsMutation.mutate(
      { updatedData: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["settings"] });
          handleAudit(
            "Settings",
            "",
            AuditAction.UPDATE,
            `General settings updated: ${changedFields.join(", ")}`,
          );
          setInitialData(formData);
        },
        onError: (error) => {
          toast.error("Failed to update settings");
          console.error("Update error:", error);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-500">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-visible bg-gray-100 p-4">
      <div className="flex items-center justify-between py-0">
        <p className="mb-3 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
          General Settings
        </p>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={updateSettingsMutation.isPending}
            className="rounded-full px-6 py-3 font-bold text-white"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Currency Settings */}
      <h2 className="mb-4 text-xl font-medium">Currency Settings</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <TextInput
              label="Currency Symbol *"
              type="text"
              placeholder="$"
              value={formData.symbol || ""}
              onChange={(e) => handleTextChange("symbol", e.target.value)}
            />
            <TextInput
              label="Currency Code *"
              type="text"
              placeholder="USD"
              value={formData.code || ""}
              onChange={(e) => handleTextChange("code", e.target.value)}
            />
            <TextInput
              label="Set Decimal *"
              type="number"
              placeholder="2"
              value={formData.decimal?.toString() || ""}
              onChange={(e) => handleNumberChange("decimal", e.target.value)}
            />
          </div>
        </div>

        <div className="h-44 rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Swipe Symbol Direction
                </span>
                <Switch
                  checked={formData.swipe_symbol || false}
                  onCheckedChange={() => handleToggle("swipe_symbol")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Disable Online Payments
                </span>
                <Switch
                  checked={!formData.disable_online}
                  onCheckedChange={() => handleToggle("disable_online")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Disable Cash Payments
                </span>
                <Switch
                  checked={formData.disable_cash || false}
                  onCheckedChange={() => handleToggle("disable_cash")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advance Settings */}
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
                <select
                  className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors"
                  value={formData.country || ""}
                  onChange={(e) =>
                    handleSelectChange("country", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Cameroon">Cameroon</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Country Restriction */}
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">
                Autocomplete Country Restriction
              </label>
              <div className="relative">
                <select
                  className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors"
                  value={formData.restrictCountry || ""}
                  onChange={(e) =>
                    handleSelectChange("restrictCountry", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select a country code
                  </option>
                  <option value="NG">Nigeria (NG)</option>
                  <option value="CM">Cameroon (CM)</option>
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
                  checked={formData.AllowCountrySelection || false}
                  onCheckedChange={() => handleToggle("AllowCountrySelection")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Convert to Mile</span>
                <Switch
                  checked={formData.convert_to_mile || false}
                  onCheckedChange={() => handleToggle("convert_to_mile")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Customer Withdraw</span>
                <Switch
                  checked={formData.RiderWithDraw || false}
                  onCheckedChange={() => handleToggle("RiderWithDraw")}
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
                  checked={formData.horizontal_view || false}
                  onCheckedChange={() => handleToggle("horizontal_view")}
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
                  checked={formData.useDistanceMatrix || false}
                  onCheckedChange={() => handleToggle("useDistanceMatrix")}
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
                  checked={formData.CarHornRepeat || false}
                  onCheckedChange={() => handleToggle("CarHornRepeat")}
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
                  checked={formData.disablesystemprice || false}
                  onCheckedChange={() => handleToggle("disablesystemprice")}
                />
              </div>
              <div className="mt-1 border-b border-gray-200"></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Disable Tips</span>
                <Switch
                  checked={formData.disable_tips || false}
                  onCheckedChange={() => handleToggle("disable_tips")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet and Other Settings */}
      <div className="my-10 border-t border-gray-200"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Wallet Denominations */}
          <div className="mb-16">
            <h2 className="mb-4 text-xl font-medium">Wallet Denominations</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <TextInput
                label="Wallet Denominations"
                type="text"
                placeholder="Enter wallet denominations"
                value={formData.walletMoneyField || ""}
                onChange={(e) =>
                  handleTextChange("walletMoneyField", e.target.value)
                }
              />
            </div>
          </div>

          {/* Tip Denominations */}
          <div className="mb-16">
            <h2 className="mb-4 text-xl font-medium">Tip Denominations</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <TextInput
                label="Tip Denominations"
                type="text"
                placeholder="Enter tip denominations"
                value={formData.tipMoneyField || ""}
                onChange={(e) =>
                  handleTextChange("tipMoneyField", e.target.value)
                }
              />
            </div>
          </div>

          {/* Panic Dial Number */}
          <div className="mb-16">
            <h2 className="mb-4 text-xl font-medium">Panic Dial Number</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <TextInput
                label="Panic Dial Number"
                type="text"
                placeholder="Enter panic number"
                value={formData.panic || ""}
                onChange={(e) => handleTextChange("panic", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-medium">Driver Settings</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Driver Radius
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors"
                    placeholder="Enter driver radius"
                    value={formData.driverRadius?.toString() || ""}
                    onChange={(e) =>
                      handleNumberChange("driverRadius", e.target.value)
                    }
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ChevronDown />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Threshold */}
          <div className="mb-16">
            <h2 className="mb-4 text-xl font-medium">Driver Threshold</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <TextInput
                label="Driver Threshold (meters)"
                type="number"
                placeholder="Enter threshold distance"
                value={formData.driverThreshold?.toString() || ""}
                onChange={(e) =>
                  handleNumberChange("driverThreshold", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Right column - Security and Login Settings */}
        <div className="md:col-span-1">
          {/* Security Settings */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-medium">Security Settings</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-col space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Booking OTP</span>
                    <Switch
                      checked={formData.otp_secure || false}
                      onCheckedChange={() => handleToggle("otp_secure")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Driver Approval
                    </span>
                    <Switch
                      checked={formData.driver_approval || false}
                      onCheckedChange={() => handleToggle("driver_approval")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Car Approval</span>
                    <Switch
                      checked={formData.carApproval || false}
                      onCheckedChange={() => handleToggle("carApproval")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Verify Id/Passport
                    </span>
                    <Switch
                      checked={formData.imageIdApproval || false}
                      onCheckedChange={() => handleToggle("imageIdApproval")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Settings */}
          <div className="mt-14">
            <h2 className="mb-4 text-xl font-medium">Login Settings</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-col space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Email Login</span>
                    <Switch
                      checked={formData.emailLogin || false}
                      onCheckedChange={() => handleToggle("emailLogin")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Mobile Login</span>
                    <Switch
                      checked={formData.mobileLogin || false}
                      onCheckedChange={() => handleToggle("mobileLogin")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Social Login</span>
                    <Switch
                      checked={formData.socialLogin || false}
                      onCheckedChange={() => handleToggle("socialLogin")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Settings */}
          <div className="mt-36">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-col space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Allow Driver Negative Balance
                    </span>
                    <Switch
                      checked={formData.negativeBalance || false}
                      onCheckedChange={() => handleToggle("negativeBalance")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">
                    Driver Live Location
                  </span>
                  <Switch
                    checked={formData.realtime_drivers || false}
                    onCheckedChange={() => handleToggle("realtime_drivers")}
                  />
                </div>
                <div className="mt-2 border-b border-gray-200"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Bank Reg Fields
                    </span>
                    <Switch
                      checked={formData.bank_fields || false}
                      onCheckedChange={() => handleToggle("bank_fields")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Show Live Route
                    </span>
                    <Switch
                      checked={formData.showLiveRoute || false}
                      onCheckedChange={() => handleToggle("showLiveRoute")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      Car Is Required
                    </span>
                    <Switch
                      checked={formData.carType_required || false}
                      onCheckedChange={() => handleToggle("carType_required")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Term Required</span>
                    <Switch
                      checked={formData.term_required || false}
                      onCheckedChange={() => handleToggle("term_required")}
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">
                      License Image Required
                    </span>
                    <Switch
                      checked={formData.license_image_required || false}
                      onCheckedChange={() =>
                        handleToggle("license_image_required")
                      }
                    />
                  </div>
                  <div className="mt-2 border-b border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Bid Price Settings */}
      <div className="mt-8 border-t border-gray-200"></div>
      <h2 className="mt-6 text-xl font-medium">
        Customer Initiate Bid Price Setting
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full rounded-lg bg-white p-6 shadow md:col-span-2">
          <div className="space-y-4">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">
                Bid Price Type
              </label>
              <select
                className="mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 text-[#697077] outline-none transition-colors"
                value={formData.coustomerBidPriceType || ""}
                onChange={(e) =>
                  handleSelectChange("coustomerBidPriceType", e.target.value)
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <div className="absolute right-3 top-12 -translate-y-1/2 text-gray-400">
                <ChevronDown />
              </div>
            </div>
            <TextInput
              label="Bid Lower Price"
              type="number"
              placeholder="5"
              value={formData.bidprice?.toString() || ""}
              onChange={(e) => handleNumberChange("bidprice", e.target.value)}
            />
          </div>
        </div>

        <div className="h-20 rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Disable Customer Bid Price
                </span>
                <Switch
                  checked={formData.coustomerBidPrice || false}
                  onCheckedChange={() => handleToggle("coustomerBidPrice")}
                />
              </div>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Bonus */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mt-6">
            <h2 className="mt-8 text-xl font-medium">Referral Bonus</h2>
            <div className="mt-6 rounded-lg bg-white p-6 shadow">
              <TextInput
                label="Referral Bonus"
                type="number"
                placeholder="Enter bonus amount"
                value={formData.bonus?.toString() || ""}
                onChange={(e) => handleNumberChange("bonus", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSetting;
