'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("ayomoses111+first@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded bg-yellow-400"></div>
          <span className="text-xl font-bold text-gray-900">BYBIT</span>
          <span className="ml-4 text-xl font-normal text-gray-600">
            AFFILIATES
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900">FAQ</button>
          <button className="text-gray-600 hover:text-gray-900">
            Contact Us
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">EN</span>
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-600">
            Log In
          </Button>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            Apply
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Marketing Content */}
        <div className="flex flex-1 flex-col justify-center p-12">
          <div className="max-w-lg">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900">
              Grow your audience with Bybit's affiliate portal: gain insights,
              access campaigns, assets, and products.
            </h1>
            <div className="mb-8 h-1 w-16 bg-yellow-400"></div>

            {/* Dashboard Preview Cards */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    My Token Bundle
                  </span>
                  <div className="flex space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                      <span className="text-xs text-white">E</span>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-400">
                      <span className="text-xs text-white">B</span>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                      <span className="text-xs text-white">L</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total val.</span>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  </div>
                </div>
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                  Purchase
                </Button>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-black">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      Deposit & Earn Up To
                    </div>
                    <div className="text-2xl font-bold">$30,030</div>
                    <div className="text-lg font-bold">IN REWARDS</div>
                  </div>
                  <div className="text-6xl">▶</div>
                </div>
              </div>
            </div>

            {/* Chart Preview */}
            <div className="mt-8 rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">14k</span>
                <span className="text-sm text-gray-600">29k</span>
              </div>
              <div className="relative h-16 overflow-hidden rounded bg-gradient-to-r from-blue-100 to-blue-200">
                <svg className="h-full w-full" viewBox="0 0 300 60">
                  <path
                    d="M0,50 Q75,20 150,30 T300,25"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,50 Q75,20 150,30 T300,25 L300,60 L0,60 Z"
                    fill="url(#gradient)"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex w-96 items-center justify-center bg-white p-8">
          <Card className="w-full border-0 shadow-none">
            <CardContent className="p-0">
              <h2 className="mb-8 text-2xl font-bold text-gray-900">Log In</h2>

              <div className="space-y-6">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-yellow-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="text-right">
                  <button className="text-sm text-yellow-500 hover:text-yellow-600">
                    Forgot Password?
                  </button>
                </div>

                <Button className="w-full rounded-lg bg-yellow-400 py-3 font-medium text-black hover:bg-yellow-500">
                  LOG IN
                </Button>

                <div className="text-center text-sm text-gray-600">
                  By continuing, you agree to our{" "}
                  <button className="text-yellow-500 hover:text-yellow-600">
                    Affiliate Agreement
                  </button>{" "}
                  and{" "}
                  <button className="text-yellow-500 hover:text-yellow-600">
                    Privacy Policy
                  </button>
                  .
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
