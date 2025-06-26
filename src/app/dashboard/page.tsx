"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import betaLogo from "../../assets/beta-usd-logo.svg";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("All");

  const timeFilters = ["24H", "7D", "1M", "1Y", "All"];
  const timeFilters2 = ["7D", "1M", "1Y", "All"];

  // Mock data for charts
  const recentData = [
    { date: "2025-04-30", signUps: 0, deposits: 0 },
    { date: "2025-05-02", signUps: 0, deposits: 0 },
    { date: "2025-05-04", signUps: 0, deposits: 0 },
    { date: "2025-05-06", signUps: 0, deposits: 0 },
    { date: "2025-05-08", signUps: 0, deposits: 0 },
    { date: "2025-05-10", signUps: 0, deposits: 0 },
    { date: "2025-05-12", signUps: 0, deposits: 0 },
    { date: "2025-05-14", signUps: 0, deposits: 0 },
    { date: "2025-05-16", signUps: 0, deposits: 0 },
    { date: "2025-05-18", signUps: 0, deposits: 0 },
  ];

  const commissionsData = [
    { date: "2025-04-30", value: 2 },
    { date: "2025-05-01", value: 4 },
    { date: "2025-05-02", value: 6 },
    { date: "2025-05-03", value: 8 },
    { date: "2025-05-04", value: 10 },
    { date: "2025-05-05", value: 8 },
    { date: "2025-05-06", value: 6 },
    { date: "2025-05-07", value: 4 },
    { date: "2025-05-08", value: 2 },
    { date: "2025-05-09", value: 1 },
    { date: "2025-05-10", value: 1 },
    { date: "2025-05-11", value: 1 },
    { date: "2025-05-12", value: 1 },
    { date: "2025-05-13", value: 1 },
    { date: "2025-05-14", value: 1 },
    { date: "2025-05-15", value: 1 },
    { date: "2025-05-16", value: 1 },
    { date: "2025-05-17", value: 1 },
    { date: "2025-05-18", value: 1 },
  ];

  const subAffiliatesData = [
    { date: "2025-04-30", value: 0 },
    { date: "2025-05-02", value: 0 },
    { date: "2025-05-04", value: 0 },
    { date: "2025-05-06", value: 0 },
    { date: "2025-05-08", value: 0 },
    { date: "2025-05-10", value: 0 },
    { date: "2025-05-12", value: 0 },
    { date: "2025-05-14", value: 0 },
    { date: "2025-05-16", value: 0 },
    { date: "2025-05-18", value: 0 },
  ];

  const tradingVolumeData = [
    { date: "2025-04-30", value: 10000 },
    { date: "2025-05-01", value: 20000 },
    { date: "2025-05-02", value: 30000 },
    { date: "2025-05-03", value: 40000 },
    { date: "2025-05-04", value: 50000 },
    { date: "2025-05-05", value: 60000 },
    { date: "2025-05-06", value: 45000 },
    { date: "2025-05-07", value: 35000 },
    { date: "2025-05-08", value: 25000 },
    { date: "2025-05-09", value: 15000 },
    { date: "2025-05-10", value: 10000 },
    { date: "2025-05-11", value: 8000 },
    { date: "2025-05-12", value: 6000 },
    { date: "2025-05-13", value: 5000 },
    { date: "2025-05-14", value: 4000 },
    { date: "2025-05-15", value: 3000 },
    { date: "2025-05-16", value: 2000 },
    { date: "2025-05-17", value: 1500 },
    { date: "2025-05-18", value: 1000 },
  ];

  const campaigns = [
    {
      title: "Exclusive Pre-Sale Access to Tomorrow Brasil experience",
      status: "Hot",
      type: "Ongoing",
      period: "2025-03-21 08:00:00 - 2025-10-31 23:59:59",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=225&fit=crop",
      overlayText: "Priority Tomorrowland Brasil experience",
    },
    {
      title: "Position Airdrop Campaign - Exclusive",
      status: "Hot",
      type: "Ongoing",
      period: "2025-03-10 10:00:00 - 2025-06-06 23:59:59",
      image:
        "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=225&fit=crop",
    },
    {
      title: "Bybit Starter Rewards",
      status: "Hot",
      type: "Ongoing",
      period: "2023-02-20 21:30:00 - 2025-12-31 21:30:00",
      image:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=225&fit=crop",
      overlayText: "Bybit Starter Rewards",
    },
    {
      title: "Trade at least $50k in volume to win up to $500 USDT",
      status: "Exclusive",
      type: "Ended",
      period: "2025-05-06 16:00:00 - 2025-05-19 23:59:59",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop",
    },
  ];

  const recentSignups = [
    {
      uid: "224181088",
      email: "f**********dada@gmail.com",
      joined: "Sun, Jul 7, 2024, 10:17 AM",
      kyc: "KYC-2",
      deposit: "Tue, Nov 26, 2024, 8:08 AM",
    },
    {
      uid: "222582621",
      email: "p**********ia11@gmail.com",
      joined: "Thu, Jul 4, 2024, 6:09 AM",
      kyc: "KYC-1",
      deposit: "Thu, Jul 4, 9:58 PM",
    },
    {
      uid: "213383795",
      email: "a**********jagunna232@gmail.com",
      joined: "Tue, Jun 18, 2024, 9:24 PM",
      kyc: "KYC-1",
      deposit: "-",
    },
    {
      uid: "185593419",
      email: "a**********d90@gmail.com",
      joined: "Wed, May 15, 2024, 9:07 PM",
      kyc: "KYC-2",
      deposit: "Wed, Sep 25, 2024, 9:04 AM",
    },
    {
      uid: "174003326",
      email: "l**********miu16@gmail.com",
      joined: "Wed, Apr 17, 2024, 1:22 PM",
      kyc: "KYC-1",
      deposit: "Wed, Sep 25, 2024, 9:03 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-6 font-inter">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">My Dashboard</h1>

      {/* Four Equal Height Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-full border-0 px-4 shadow-lg">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 border-b pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Account Overview
              <div className="text-xs text-gray-500">
                Data from 2025-06-21 - 2025-06-21
              </div>
            </CardTitle>
            <div className="flex space-x-1">
              {timeFilters.map((period) => (
                <Button
                  key={period}
                  variant={timeFilter === period ? "default" : "naked"}
                  size="sm"
                  onClick={() => setTimeFilter(period)}
                  className={
                    timeFilter === period
                      ? "h-8 rounded-md border-[#F4B968] bg-[#ffe4ad] text-xs text-[#ec8729] hover:bg-[#ffe4ad]"
                      : "h-8 rounded-md border-none text-xs text-gray-600 hover:bg-gray-50"
                  }
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">No. of Sign-ups</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  Clients&apos; Trading Volume
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">USDT</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  No. of First Time Deposits
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Clients Who Traded</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full border-0 px-4 shadow-sm">
          <CardHeader className="mb-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-bold text-gray-900">
              ≈ 0.06097805{" "}
              <span className="text-sm font-normal text-gray-500">USDT</span>
            </div>
            <div className="mb-6 text-xs text-gray-500">
              ≈ 0.00992722 USDT pending
            </div>
            <div className="mb-6 space-y-3">
              <div className="mb-2 text-xs font-medium text-gray-700">
                Recent Transactions
              </div>
              <div className="flex items-center space-x-3">
                <Image
                  src={betaLogo}
                  alt={"beta usd logo"}
                  width={20}
                  height={20}
                />
                <span className="text-xs text-gray-600">+ 0.00001434 USDT</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">Commission</span>
              </div>
              <div className="flex items-center space-x-3">
                <Image
                  src={betaLogo}
                  alt={"beta usd logo"}
                  width={20}
                  height={20}
                />
                <span className="text-xs text-gray-600">+ 0.00001446 USDT</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">Commission</span>
              </div>
              <div className="flex items-center space-x-3">
                <Image
                  src={betaLogo}
                  alt={"beta usd logo"}
                  width={20}
                  height={20}
                />
                <span className="text-xs text-gray-600">+ 0.02913994 USDT</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">Commission</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              View Balance
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full border-0 px-4 shadow-sm">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900">
              My Promotion Tools
            </CardTitle>
            <div className="flex space-x-4">
              <Button
                variant="naked"
                className="p-0 text-sm text-[#F7931A] hover:text-[#e8870f]"
              >
                Manage
              </Button>
              <Button
                variant="naked"
                className="p-0 text-sm text-[#F7931A] hover:text-[#e8870f]"
              >
                Invite Sub-Affiliates
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-3">
                  <div className="mb-1 text-xs text-gray-500">
                    Referral Code
                  </div>
                  <div className="text-xl font-bold text-gray-900">49818</div>
                </div>
                <div className="mb-4">
                  <div className="mb-1 text-xs text-gray-500">
                    Referral Link(My Sign-Up Page)
                  </div>
                  <div className="break-all text-sm font-medium text-gray-700">
                    https://partner.bybit.com/b/49818
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Create short link with your affiliate ID
                  </span>
                  <Button
                    variant="link"
                    className="p-0 text-xs text-[#F7931A] hover:text-[#e8870f]"
                  >
                    Create Now
                  </Button>
                </div>
              </div>
              <div className="flex items-start justify-end lg:col-span-1">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Personalize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full border-0 px-4 shadow-sm">
          <CardHeader className="mb-4 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900">
              My Commission Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">
                Profits From Your Clients&apos; Trades:{" "}
              </span>
              <span className="text-lg font-bold text-green-600">33%</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Your Sub-Affiliates&apos; Earnings:{" "}
              </span>
              <span className="text-lg font-bold text-green-600">0% - 10%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Campaigns
          </CardTitle>
          <button className="text-sm font-medium text-[#F7931A] hover:underline">
            All campaigns →
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-100"
              >
                <div className="relative aspect-video">
                  <Image
                    src={
                      campaign.image ||
                      `https://picsum.photos/400/225?random=${index}`
                    }
                    alt={campaign.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover"
                  />
                  {campaign.overlayText && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="px-4 text-center text-sm font-medium text-white">
                        {campaign.overlayText}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="mb-2 flex gap-2">
                    <Badge
                      className={
                        campaign.status === "Hot"
                          ? "bg-red-500 px-2 py-0.5 text-xs text-white"
                          : campaign.status === "Exclusive"
                            ? "bg-[#F7931A] px-2 py-0.5 text-xs text-white"
                            : "bg-gray-500 px-2 py-0.5 text-xs text-white"
                      }
                    >
                      {campaign.status}
                    </Badge>
                    <Badge
                      className={
                        campaign.type === "Ongoing"
                          ? "bg-green-500 px-2 py-0.5 text-xs text-white"
                          : "bg-gray-500 px-2 py-0.5 text-xs text-white"
                      }
                    >
                      {campaign.type}
                    </Badge>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">
                    {campaign.title}
                  </h3>
                  <p className="text-xs text-gray-500">{campaign.period}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Signups Table */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clients
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Joined Bybit
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    KYC
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    First-Time Deposited
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentSignups.map((signup, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <div className="text-sm font-medium text-gray-900">
                        UID {signup.uid}
                      </div>
                      <div className="text-xs text-gray-500">
                        {signup.email}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm text-gray-900">
                        {signup.joined}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        🔗 Alag
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className="border-gray-300 text-xs text-gray-700"
                      >
                        {signup.kyc}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {signup.deposit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Signups Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent
              </CardTitle>
              <p className="text-xs text-gray-500">
                Data from 2025-06-15 - 2025-06-22
              </p>
            </div>
            <div className="flex space-x-1">
              {timeFilters2.map((period) => (
                <Button
                  key={period}
                  variant={timeFilter === period ? "default" : "naked"}
                  size="sm"
                  onClick={() => setTimeFilter(period)}
                  className={
                    timeFilter === period
                      ? "h-8 rounded-md border-[#F4B968] bg-[#ffe4ad] text-xs text-[#ec8729] hover:bg-[#ffe4ad]"
                      : "h-8 rounded-md border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                  }
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Sign Ups</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">
                  First Time Deposits
                </span>
              </div>
            </div>
            <div className="mb-4 flex space-x-8">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Line
                    type="monotone"
                    dataKey="signUps"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="deposits"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clients Commissions Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Clients Commissions
              </CardTitle>
              <p className="text-xs text-gray-500">
                Data from 2025-06-15 - 2025-06-22
              </p>
            </div>
            <div className="flex flex-col items-center space-x-2">
              <div className="flex space-x-1">
                {timeFilters2.map((period) => (
                  <Button
                    key={period}
                    variant={timeFilter === period ? "default" : "naked"}
                    size="sm"
                    onClick={() => setTimeFilter(period)}
                    className={
                      timeFilter === period
                        ? "h-8 rounded-md border-[#F4B968] bg-[#ffe4ad] text-xs text-[#ec8729] hover:bg-[#ffe4ad]"
                        : "h-8 rounded-md border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                    }
                  >
                    {period}
                  </Button>
                ))}
                <select className="rounded border border-gray-200 px-2 py-1 text-xs">
                  <option>All Coinssss</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <span className="text-xs text-gray-600">Clients Commissions</span>
            </div>
            <div className="mb-4 text-2xl font-bold text-gray-900">
              0.03915544
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={commissionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f87171"
                    fill="#fca5a5"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sub-Affiliates Commissions Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Sub-Affiliates Commissions
              </CardTitle>
              <p className="text-xs text-gray-500">
                Data from 2025-06-15 - 2025-06-22
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {timeFilters2.map((period) => (
                  <Button
                    key={period}
                    variant={timeFilter === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter(period)}
                    className={
                      timeFilter === period
                        ? "h-8 rounded-md border-[#F4B968] bg-[#ffe4ad] text-xs text-[#ec8729] hover:bg-[#ffe4ad]"
                        : "h-8 rounded-md border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                    }
                  >
                    {period}
                  </Button>
                ))}
              </div>
              <select className="rounded border border-gray-200 px-2 py-1 text-xs">
                <option>All Coins</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-purple-400"></div>
              <span className="text-xs text-gray-600">
                Sub-Affiliates Commissions
              </span>
            </div>
            <div className="mb-4 text-2xl font-bold text-gray-900">0</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subAffiliatesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clients' Trading Volume Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Clients&apos; Trading Volume
              </CardTitle>
              <p className="text-xs text-gray-500">
                Data from 2025-06-15 - 2025-06-22
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {timeFilters2.map((period) => (
                  <Button
                    key={period}
                    variant={timeFilter === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter(period)}
                    className={
                      timeFilter === period
                        ? "h-8 rounded-md border-[#F4B968] bg-[#ffe4ad] text-xs text-[#ec8729] hover:bg-[#ffe4ad]"
                        : "h-8 rounded-md border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                    }
                  >
                    {period}
                  </Button>
                ))}
              </div>
              <select className="rounded border border-gray-200 px-2 py-1 text-xs">
                <option>All Coins</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <span className="text-xs text-gray-600">Trading Volumes</span>
            </div>
            <div className="mb-4 text-2xl font-bold text-gray-900">
              127.44074
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradingVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fb923c"
                    fill="#fed7aa"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
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

export default Dashboard;
