"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  usePaymentSettings,
  useUpdatePaymentSettingField,
  useUpdatePaymentSettings,
} from "@/lib/api/hooks/usePaymentSettings";
import { formatPaymentMethodName, getPaymentMethodFields } from "@/lib/utils";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";

// Types
type TabData = {
  key: number;
  title: string;
  value: string;
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

  const [tabsData, setTabsData] = useState<TabData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldNames, setFieldNames] = useState<{ [key: string]: string }>({
    merchantId: "merchantId",
    privateKey: "privateKey",
    publicKey: "publicKey",
  });

  // Generate tabs from payment settings data
  useEffect(() => {
    if (paymentSettings) {
      const methods = Object.keys(paymentSettings).map((method, index) => ({
        key: index + 1,
        title: formatPaymentMethodName(method),
        value: method,
      }));

      setTabsData(methods);

      if (!selectedTab && methods.length > 0) {
        setSelectedTab(methods[0].value);
      }
    }
  }, [paymentSettings, selectedTab]);

  useEffect(() => {
    if (paymentSettings && selectedTab) {
      const currentSettings = paymentSettings[selectedTab];

      if (currentSettings) {
        // Get the correct field names for this payment method
        const methodFields = getPaymentMethodFields(
          selectedTab,
          currentSettings,
        );
        setFieldNames(methodFields);

        // Set form data from current settings
        setFormData(currentSettings);
      } else {
        // Reset form if no settings found
        setFormData({
          active: false,
          testing: false,
        });

        // Reset field names to defaults
        setFieldNames({
          merchantId: "merchantId",
          privateKey: "privateKey",
          publicKey: "publicKey",
        });
      }
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

    // Check if required fields are filled
    if (
      !formData[fieldNames.merchantId] ||
      !formData[fieldNames.privateKey] ||
      !formData[fieldNames.publicKey]
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    updatePaymentSettingsMutation.mutate({
      method: selectedTab,
      data: formData,
    });
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));

    updateFieldMutation.mutate({
      method: selectedTab,
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
      method: selectedTab,
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
        value={value || ""}
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
            name={fieldNames.merchantId}
            value={formData[fieldNames.merchantId] || ""}
            onChange={handleInputChange}
          />
          <FormInput
            label="Private Key"
            name={fieldNames.privateKey}
            value={formData[fieldNames.privateKey] || ""}
            onChange={handleInputChange}
            type="password"
          />
          <FormInput
            label="Public Key"
            name={fieldNames.publicKey}
            value={formData[fieldNames.publicKey] || ""}
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
          {formData.hasOwnProperty("testing") && (
            <SettingsToggle
              label="Test Mode"
              isChecked={formData.testing || false}
              onChange={handleToggleTestMode}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading || !selectedTab) {
    return (
      <div className="flex justify-center p-8">Loading payment settings...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="m-4 flex w-fit cursor-pointer overflow-x-auto pb-2 pt-2">
        {tabsData.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setSelectedTab(tab.value)}
            className={`${
              selectedTab === tab.value
                ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]"
                : "border-b border-b-[#DDE1E6] text-[#64748B]"
            } whitespace-nowrap pl-4 pr-4 text-center font-[Roboto] text-sm font-normal`}
          >
            <p>{tab.title}</p>
          </div>
        ))}
      </div>

      <div className="p-4">
        <h1 className="mb-6 text-2xl font-medium">
          {formatPaymentMethodName(selectedTab)}
        </h1>
        <PaymentMethodForm />
      </div>
    </div>
  );
};

export default PaymentSettings;
