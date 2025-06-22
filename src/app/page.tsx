"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const BybitAffiliateLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Route to dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error here (show error message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-black">
            <span className="font-bold text-[#F7931A]">BYB</span>IT
          </span>
          <span className="text-lg font-normal tracking-wide text-gray-700">AFFILIATES</span>
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">
            FAQ
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">
            Contact Us
          </a>

          {/* Language Toggle */}
          <div className="flex cursor-pointer items-center space-x-1 rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
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
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span className="font-medium">EN</span>
          </div>

          {/* Log In + Apply Buttons */}
          <button className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Log In
          </button>
          <button className="rounded bg-[#F7931A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e8870f]">
            Apply
          </button>
        </div>
      </header>

      <div className="flex min-h-screen flex-col bg-white font-inter lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
          <div className="max-w-lg text-center">
            <div className="mb-8">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Bybit affiliate dashboard preview"
                width={500}
                height={300}
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Calculate and Receive Your<br />Earnings Daily
            </h2>
            <p className="mb-6 text-base leading-relaxed text-gray-600">
              Gain insights, access campaigns, assets, and products with Bybit&apos;s 
              comprehensive affiliate portal designed for maximum performance.
            </p>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#F7931A]" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Log In</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email"
                  className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#F7931A] focus:outline-none focus:ring-2 focus:ring-[#F7931A]/20"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                  className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:border-[#F7931A] focus:outline-none focus:ring-2 focus:ring-[#F7931A]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-sm font-medium text-[#F7931A] hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#F7931A] py-3 text-base font-semibold text-white transition duration-200 hover:bg-[#e8870f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "LOG IN"
                )}
              </Button>
            </form>

            {/* Agreements */}
            <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="font-medium text-[#F7931A] underline hover:no-underline">
                Affiliate Agreement
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-[#F7931A] underline hover:no-underline">
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