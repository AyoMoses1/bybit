"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const AccountSecurity = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FAForm, setShow2FAForm] = useState(false);

  // Mock account activity data
  const accountActivities = [
    {
      time: "2025-07-09 15:20:40",
      activity: "Log In",
      ip: "105.119.2.137",
    },
    {
      time: "2025-06-26 08:29:22",
      activity: "Log In",
      ip: "105.119.26.135",
    },
    {
      time: "2025-06-25 10:55:10",
      activity: "Log In",
      ip: "84.39.112.82",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-6 font-inter">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Account Security
      </h1>

      {/* Security Status Card */}
      <div className="text mb-8">
        <div className="mb-6">
          <div className="mb-9">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="User Avatar"
                  className="h-[100px] w-[100px] rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome, Abdullateef Abdulgaffar
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span>AID: 49818</span>
            <Copy className="h-4 w-4 cursor-pointer hover:text-gray-900" />
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Security Level Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="flex items-start space-x-4 p-6">
              {/* Left content */}
              <div className="flex-1">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Security Level: <span className="text-red-500">Low</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="mb-3 flex space-x-4">
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 w-full rounded-full bg-red-500"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 w-[40%] rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 w-[40%] rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    Please take the following steps promptly to enhance your
                    account security:
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm font-bold text-gray-900">
                        Reset Password
                      </p>
                    </div>
                    <div className="flex items-center justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm font-bold text-gray-900">
                        Enable Google 2FA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Right image */}
              <div className="flex-shrink-0">
                <img
                  src="https://affiliates.bybit.com/common-static/frontend-web/affiliate-portal-vite/assets/Safety_1-DcyG34RL.png"
                  alt="Security Icon"
                  className="h-48 w-48 object-contain"
                />
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="flex items-start space-x-4 p-6">
              {/* Left content */}
              <div className="flex-1">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    My Sign-up Page:{" "}
                    <span className="text-green-500">All Set!</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-gray-600">
                    A customized sign-up page enhances sign-up conversion by
                    approximately 60% according to our previous analysis.
                  </p>
                </CardContent>
              </div>

              {/* Right image */}
              <div className="flex-shrink-0">
                <img
                  src="https://affiliates.bybit.com/common-static/frontend-web/affiliate-portal-vite/assets/Signup_2-BGhjLXdn.png"
                  alt="Sign-up Icon"
                  className="h-48 w-48 object-contain opacity-80"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        {/* Personal Info Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">Name</p>
                </div>
                <div className="flex w-2/3 items-center justify-start">
                  <p className="text-sm font-medium text-gray-900">
                    Abdullateef Abdulgaffar
                  </p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <Button
                    variant="naked"
                    className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                  >
                    Change
                  </Button>
                </div>
              </div>

              {/* Bybit UID */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">Bybit UID</p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-1">
                  <p className="text-sm text-gray-900">52896383</p>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex w-1/3 justify-end">
                  {/* Empty div for alignment */}
                  <div className="w-12"></div>
                </div>
              </div>

              {/* Region for Identity Verification */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">
                    Region for Identity Verification
                  </p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-1">
                  <span className="text-green-500">🟩</span>
                  <p className="text-sm text-gray-900">Nigeria (KYC1)</p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <div className="w-12"></div>
                </div>
              </div>

              {/* Country of Residence */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">
                    Country of Residence
                  </p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-1">
                  <span className="text-green-500">🟩</span>
                  <p className="text-sm text-gray-900">Nigeria</p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <Button
                    variant="naked"
                    className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Security Info Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Security Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-6">
              {/* Email Address */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">
                    Email Address
                  </p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-2">
                  <p className="text-sm font-bold text-gray-900">
                    alagempire@gmail.com
                  </p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <Button
                    variant="naked"
                    className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                  >
                    Change
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">Password</p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-bold text-gray-900">Not Set</p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <Button
                    variant="naked"
                    className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    Change
                  </Button>
                </div>
              </div>

              {showPasswordForm && (
                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  {/* Password form remains the same */}
                </div>
              )}

              {/* Google 2FA */}
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-gray-700">
                    Google 2FA
                  </p>
                </div>
                <div className="flex w-2/3 items-center justify-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-bold text-gray-900">Disabled</p>
                </div>
                <div className="flex w-1/3 justify-end">
                  <Button
                    variant="naked"
                    className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                    onClick={() => setShow2FAForm(!show2FAForm)}
                  >
                    Enable
                  </Button>
                </div>
              </div>

              {show2FAForm && (
                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  {/* 2FA form remains the same */}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="w-2/3 text-lg font-semibold text-gray-900">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex items-center">
              <div className="w-1/3">
                <p className="text-sm font-medium text-gray-700">
                  Product Preferences
                </p>
              </div>
              <div className="flex w-1/3 items-center justify-center">
                <span className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-900">
                  Derivatives Trading
                </span>
              </div>
              <div className="flex w-2/3 justify-end">
                <Button
                  variant="naked"
                  className="text-sm text-[#F7931A] hover:text-[#e8870f]"
                >
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Activities Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Account Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Activity
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  IP Address
                </span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {accountActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 px-4 py-3 transition-colors duration-150 hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-900">
                      {activity.time}
                    </span>
                    <span className="text-sm text-gray-900">
                      {activity.activity}
                    </span>
                    <span className="text-sm text-gray-900">{activity.ip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end space-x-4 text-xs text-gray-500">
        <span>Affiliate Agreement</span>
        <span>|</span>
        <span className="text-[#F7931A]">Privacy Policy</span>
      </div>
    </div>
  );
};

export default AccountSecurity;
