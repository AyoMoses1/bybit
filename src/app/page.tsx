"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import logo from "../assets/svgs/bybit.svg";
import Image from "next/image";

const BybitAffiliateLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-8 py-5">
        <div className="flex items-center space-x-3">
          <Image src={logo} width={164} height={24} alt="" />
        </div>

        <div className="flex items-center space-x-8">
          <a
            href="#"
            className="text-sm font-semibold text-gray-600 hover:text-black"
          >
            FAQ
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-gray-600 hover:text-black"
          >
            Contact Us
          </a>

          <div className="flex cursor-pointer items-center space-x-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg
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
            <span className="font-bold">EN</span>
          </div>

          <Button
            variant="outline"
            className="px-6 py-2.5 text-sm font-semibold"
          >
            Log In
          </Button>
          <Button className="bg-[#F7931A] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e8870f]">
            Apply
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-white">
        {/* Left Section - Single Image */}
        <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-xl px-8 text-center">
            <Image
              src="https://bybit13.netlify.app/token_bundle-CIkxhYnB.svg"
              alt="Bybit affiliate dashboard"
              width={80}
              height={80}
              className="mx-auto  w-full max-w-lg rounded-2xl object-contain shadow"
            />
            <div className="mt-8">
              <h2 className="text-2xl font-black text-gray-900">
                Calculate and Receive Your
                <br />
                Earnings Daily
              </h2>
              <p className="mt-4 px-4 text-gray-600">
                Gain insights, access campaigns, assets, and products with
                Bybits comprehensive affiliate portal designed for maximum
                performance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login */}
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="mb-12 text-3xl font-black tracking-tight text-gray-900">
              Log In
            </h2>

            <div className="space-y-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border-2 border-gray-200 px-6 py-4 text-lg font-medium focus:border-[#F7931A] focus:ring-[#F7931A]/10"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border-2 border-gray-200 px-6 py-4 pr-14 text-lg font-medium focus:border-[#F7931A] focus:ring-[#F7931A]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              <div className="text-right">
                <a
                  href="#"
                  className="text-base font-bold text-[#F7931A] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-xl bg-[#f7a600] py-5 text-lg font-black text-[#121214] hover:bg-[#e8870f] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="-ml-1 mr-3 h-6 w-6 animate-spin text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "LOG IN"
                )}
              </Button>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="font-bold text-[#F7931A] underline">
                Affiliate Agreement
              </a>{" "}
              and{" "}
              <a href="#" className="font-bold text-[#F7931A] underline">
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
