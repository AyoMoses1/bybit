"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const BybitAffiliateLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ayomoses111+first@gmail.com");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-black">
            <span className="font-bold text-yellow-500">BYB</span>IT
          </span>
          <span className="text-xl font-light tracking-wide">AFFILIATES</span>
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-sm text-gray-700 hover:text-black">
            FAQ
          </a>
          <a href="#" className="text-sm text-gray-700 hover:text-black">
            Contact Us
          </a>

          {/* Language Toggle */}
          <div className="flex cursor-pointer items-center space-x-1 rounded-md border px-2 py-1 text-sm text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m0 14v1m8-8h1M4 12H3m15.36 6.36l-.71-.71M6.34 6.34l-.7-.7m12.02 0l.7-.7m-12.02 12.02l.7-.7"
              />
            </svg>
            <span>EN</span>
          </div>

          {/* Log In + Apply Buttons */}
          <button className="rounded-md border border-gray-300 px-4 py-1 text-sm hover:bg-gray-100">
            Log In
          </button>
          <button className="rounded-md bg-yellow-400 px-4 py-1 text-sm font-semibold text-black hover:bg-yellow-500">
            Apply
          </button>
        </div>
      </header>
      <div className="flex min-h-screen flex-col bg-white font-sans lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-1 items-center justify-center bg-[#f7f8f9] p-8">
          <div className="max-w-md text-center">
            <img
              src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80" // Replace with actual image path
              alt="Bybit dashboard preview"
              className="mx-auto mb-6 rounded-lg"
            />
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Grow your audience with Bybit's affiliate portal:
            </h2>
            <p className="text-base text-gray-700">
              Gain insights, access campaigns, assets, and products.
            </p>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-400 to-gray-300" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Log In</h2>

            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-4 w-full rounded-md bg-[#eaf1fe] px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-md bg-[#eaf1fe] px-4 py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="mb-6 text-right">
              <a href="#" className="text-sm text-yellow-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button className="w-full rounded-md bg-yellow-400 py-3 font-semibold text-black transition duration-200 hover:bg-yellow-500">
              LOG IN
            </button>

            {/* Agreements */}
            <p className="mt-4 text-center text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-yellow-500 underline">
                Affiliate Agreement
              </a>{" "}
              and{" "}
              <a href="#" className="text-yellow-500 underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BybitAffiliateLogin;
