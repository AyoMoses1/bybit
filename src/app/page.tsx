"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BybitAffiliateLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Carousel data
  const carouselData = [
    {
      title: "Calculate and Receive Your\nEarnings Daily",
      description:
        "Gain insights, access campaigns, assets, and products with Bybit's comprehensive affiliate portal designed for maximum performance.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title:
        "Grow your audience with Bybit's\naffiliate portal: gain insights, access\ncampaigns, assets, and products.",
      description:
        "Maximize your earning potential with our comprehensive suite of affiliate tools and resources.",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Advanced Analytics &\nReal-time Tracking",
      description:
        "Monitor your performance with detailed analytics and real-time tracking capabilities for better decision making.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length,
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-8 py-5">
        {/* Left - Logo */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-tight text-black">
            <span className="font-black text-[#F7931A]">BYB</span>IT
          </span>
          <span className="text-lg font-semibold uppercase tracking-wider text-gray-600">
            AFFILIATES
          </span>
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center space-x-8">
          <a
            href="#"
            className="text-sm font-semibold text-gray-600 transition-colors hover:text-black"
          >
            FAQ
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-gray-600 transition-colors hover:text-black"
          >
            Contact Us
          </a>

          {/* Language Toggle */}
          <div className="flex cursor-pointer items-center space-x-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
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
            <span className="font-bold">EN</span>
          </div>

          {/* Buttons */}
          <Button
            onClick={() => console.log("clicked")}
            variant="outline"
            className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Log In
          </Button>
          <Button
            onClick={() => console.log("clicked")}
            className="rounded-md bg-[#F7931A] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#e8870f]"
          >
            Apply
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-white">
        {/* Left Section - Carousel */}
        <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-12">
          <div className="relative z-10 flex h-full max-w-xl flex-col justify-center text-center">
            <div className="mb-12 flex-shrink-0">
              <img
                src={carouselData[currentSlide].image}
                alt="Bybit affiliate dashboard preview"
                className="mx-auto h-80 w-full max-w-lg rounded-2xl object-cover shadow-2xl"
              />
            </div>

            {/* Fixed height container for text content to prevent layout shifts */}
            <div className="flex min-h-[240px] flex-1 flex-col justify-center">
              <h2 className="mb-8 text-3xl font-black leading-tight text-gray-900">
                {carouselData[currentSlide].title
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        carouselData[currentSlide].title.split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </h2>

              <p className="mb-10 text-lg font-medium leading-relaxed text-gray-600">
                {carouselData[currentSlide].description}
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex flex-shrink-0 items-center justify-center space-x-6">
              <button
                onClick={prevSlide}
                className="rounded-full bg-white p-2 shadow-lg transition-shadow hover:shadow-xl"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              {/* Dots */}
              <div className="flex space-x-3">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 w-3 rounded-full transition-colors ${
                      index === currentSlide ? "bg-[#F7931A]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="rounded-full bg-white p-2 shadow-lg transition-shadow hover:shadow-xl"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="mb-12 text-3xl font-black tracking-tight text-gray-900">
              Log In
            </h2>

            <div className="space-y-8">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#F7931A] focus:outline-none focus:ring-4 focus:ring-[#F7931A]/10"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 pr-14 text-lg font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-[#F7931A] focus:outline-none focus:ring-4 focus:ring-[#F7931A]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-base font-bold text-[#F7931A] transition-colors hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full transform rounded-xl bg-[#F7931A] py-5 text-lg font-black text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e8870f] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>

            {/* Agreements */}
            <p className="mt-8 text-center text-sm font-medium leading-relaxed text-gray-500">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="font-bold text-[#F7931A] underline transition-colors hover:no-underline"
              >
                Affiliate Agreement
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-bold text-[#F7931A] underline transition-colors hover:no-underline"
              >
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
