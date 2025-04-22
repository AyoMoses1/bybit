"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PaymentMethod } from "@/lib/api/apiHandlers/paymentSettingsService";
import {
  usePaymentSettings,
  useUpdatePaymentSettingField,
  useUpdatePaymentSettings,
} from "@/lib/api/hooks/usePaymentSettings";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

import toast from "react-hot-toast";

// Types
type TabData = {
  key: number;
  title: string;
};

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
}

interface SettingsToggleProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

// Main Component
const PaymentSettings: React.FC = () => {
  const { data: paymentSettings, isLoading } = usePaymentSettings();
  const updatePaymentSettingsMutation = useUpdatePaymentSettings();
  const updateFieldMutation = useUpdatePaymentSettingField();

  const [selectedTab, setSelectedTab] = useState<string>("Flutterwave");
  const [formData, setFormData] = useState<PaymentMethod>({
    merchantId: "",
    privateKey: "",
    publicKey: "",
    active: false,
    testing: false,
  });

  // Update tabs based on the database structure
  const tabsData: TabData[] = [
    { key: 1, title: "Flutterwave" },
    { key: 2, title: "Braintree" },
    { key: 3, title: "Culqi" },
  ];

  useEffect(() => {
    if (paymentSettings && paymentSettings[selectedTab.toLowerCase()]) {
      const currentSettings = paymentSettings[selectedTab.toLowerCase()];
      setFormData({
        merchantId: currentSettings.merchantId || "",
        privateKey: currentSettings.privateKey || "",
        publicKey: currentSettings.publicKey || "",
        active: currentSettings.active || false,
        testing: currentSettings.testing || false,
      });
    } else {
      // Reset form if no settings found for this payment method
      setFormData({
        merchantId: "",
        privateKey: "",
        publicKey: "",
        active: false,
        testing: false,
      });
    }
  }, [selectedTab, paymentSettings]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.merchantId || !formData.privateKey || !formData.publicKey) {
      toast.error("Please fill all required fields");
      return;
    }

    updatePaymentSettingsMutation.mutate({
      method: selectedTab.toLowerCase(),
      data: formData,
    });
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));

    updateFieldMutation.mutate({
      method: selectedTab.toLowerCase(),
      field: "active",
      value: checked,
    });
  };

  const handleToggleTestMode = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      testing: checked,
    }));

    updateFieldMutation.mutate({
      method: selectedTab.toLowerCase(),
      field: "testing",
      value: checked,
    });
  };

  const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "Enter value",
  }) => (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
        required
      />
    </div>
  );

  const SettingsToggle: React.FC<SettingsToggleProps> = ({
    label,
    isChecked,
    onChange,
  }) => (
    <div className="flex items-center justify-between border-b-2 py-3">
      <span className="text-gray-700">{label}</span>
      <Switch checked={isChecked} onCheckedChange={onChange} />
    </div>
  );

  const PaymentMethodForm: React.FC = () => (
    <div className="flex flex-col gap-9 md:flex-row">
      <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Merchant ID"
            name="merchantId"
            value={formData.merchantId || ""}
            onChange={handleInputChange}
          />
          <FormInput
            label="PrivateKey"
            name="privateKey"
            value={formData.privateKey || ""}
            onChange={handleInputChange}
            type="password"
          />
          <FormInput
            label="PublicKey"
            name="publicKey"
            value={formData.publicKey || ""}
            onChange={handleInputChange}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-2/4"
              disabled={updatePaymentSettingsMutation.isPending}
            >
              {updatePaymentSettingsMutation.isPending
                ? "Submitting..."
                : "Submit"}
            </Button>
          </div>
        </form>
      </div>

      <div className="h-3/4 w-full rounded-lg bg-white p-6 shadow-sm md:w-80">
        <h2 className="mb-11 text-lg font-medium">Settings Panel</h2>

        <div className="space-y-6">
          <SettingsToggle
            label="Active"
            isChecked={formData.active || false}
            onChange={handleToggleActive}
          />
          <SettingsToggle
            label="Test Mode"
            isChecked={formData.testing || false}
            onChange={handleToggleTestMode}
          />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading payment settings...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="m-4 flex w-fit cursor-pointer pb-2 pt-2">
        {tabsData.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setSelectedTab(tab.title)}
            className={`${
              selectedTab === tab.title
                ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]"
                : "border-b border-b-[#DDE1E6] text-[#64748B]"
            } pl-4 pr-4 text-center font-[Roboto] text-sm font-normal`}
          >
            <p>{tab.title}</p>
          </div>
        ))}
      </div>

      <div className="p-4">
        <h1 className="mb-6 text-2xl font-medium">{selectedTab}</h1>
        <PaymentMethodForm />
      </div>
    </div>
  );
};

export default PaymentSettings;
