"use client";
import { useForm } from "react-hook-form";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, ChevronDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import toast from "react-hot-toast";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  usertype: string;
};

interface LanguageOption {
  value: string;
  label: string;
}

const MyProfile = () => {
  useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("es");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const languageOptions: LanguageOption[] = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
  ];

  const {
    profile,
    isLoading,
    updateProfile,
    updateProfileImage,
    isUpdating,
    isUpdatingImage,
    checkUserExists,
  } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      usertype: "",
    },
  });

  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        usertype: profile.usertype || "",
      });

      // Set language if available in profile
      setSelectedLanguage(profile.lang?.langLocale || "es");
    }
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!profile) {
        throw new Error("Profile data not available");
      }

      // For fleet admin, only update language and profile image
      if (profile.usertype === "fleetadmin") {
        if (selectedImage) {
          await updateProfileImage(selectedImage);
          setSelectedImage(null);
        }

        if (
          selectedLanguage &&
          (!profile.lang || profile.lang.langLocale !== selectedLanguage)
        ) {
          const selectedLang = languageOptions.find(
            (lang) => lang.value === selectedLanguage,
          );
          if (selectedLang) {
            await updateProfile({
              lang: {
                langLocale: selectedLang.value,
                dateLocale: selectedLang.value,
              },
            });
          }
        }

        setSubmitSuccess(true);
        toast.success("Profile updated successfully");

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 2000);
        return;
      }

      // Logic for Admin user types
      if (data.email !== profile.email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(data.email)) {
          toast.error("Please enter a valid email address");
          return;
        }

        const emailExists = await checkUserExists({ email: data.email });
        if (emailExists.users && emailExists.users.length > 0) {
          toast.error("This email is already in use");
          return;
        }
      }

      if (data.mobile !== profile.mobile && data.mobile) {
        if (data.mobile.length < 6) {
          toast.error("Mobile number must be at least 6 digits");
          return;
        }

        const mobileExists = await checkUserExists({ mobile: data.mobile });
        if (mobileExists.users && mobileExists.users.length > 0) {
          toast.error("This mobile number is already in use");
          return;
        }
      }

      const updateData: Partial<ProfileFormData> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
      };

      await updateProfile(updateData);

      if (selectedImage) {
        await updateProfileImage(selectedImage);
        setSelectedImage(null);
      }

      if (
        selectedLanguage &&
        (!profile.lang || profile.lang.langLocale !== selectedLanguage)
      ) {
        const selectedLang = languageOptions.find(
          (lang) => lang.value === selectedLanguage,
        );
        if (selectedLang) {
          await updateProfile({
            lang: {
              langLocale: selectedLang.value,
              dateLocale: selectedLang.value,
            },
          });
        }
      }

      setSubmitSuccess(true);
      toast.success("Profile updated successfully");

      // Reset the form with new values to reset isDirty state
      reset(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
          usertype: data.usertype,
        },
        { keepValues: true },
      );

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isDriver = profile?.usertype === "driver";
  const isFleetAdmin = profile?.usertype === "fleetadmin";

  // Function to determine if a field should be disabled
  const isFieldDisabled = (fieldName: keyof ProfileFormData) => {
    if (isDriver) return true;
    if (isFleetAdmin && fieldName !== "usertype") return true;
    return false;
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F7FA] pr-72 pt-20">
      <div className="w-full max-w-[1000px] px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-8 flex flex-col items-center">
            <div
              className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={96}
                  height={96}
                />
              ) : profile?.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-500" />
                </div>
              )}
              {isUpdatingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="firstName"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  First Name
                </Label>
                <input
                  id="firstName"
                  placeholder="Alex"
                  className={`h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 outline-none ${
                    isFieldDisabled("firstName")
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  disabled={isFieldDisabled("firstName")}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="lastName"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  Last Name
                </Label>
                <input
                  id="lastName"
                  placeholder="Rider"
                  className={`h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 outline-none ${
                    isFieldDisabled("lastName")
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  disabled={isFieldDisabled("lastName")}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="mobile"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  Phone Number
                </Label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="+237 434352 232323"
                  className={`h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 outline-none ${
                    isFieldDisabled("mobile")
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  disabled={isFieldDisabled("mobile")}
                  {...register("mobile", {
                    required: "Mobile is required",
                    minLength: {
                      value: 6,
                      message: "Mobile must be at least 6 characters",
                    },
                  })}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  Email
                </Label>
                <input
                  id="email"
                  type="email"
                  placeholder="wedea3223@sdjs.com"
                  className={`h-[48px] w-full border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 outline-none ${
                    isFieldDisabled("email")
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  disabled={isFieldDisabled("email")}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="usertype"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  User Type
                </Label>
                <input
                  id="usertype"
                  placeholder="Admin"
                  className="h-[48px] w-full cursor-not-allowed border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 opacity-70 outline-none"
                  disabled
                  {...register("usertype")}
                />
              </div>

              <div>
                <Label
                  htmlFor="preferred_language"
                  className="mb-1 block text-base font-normal text-[#21272A]"
                >
                  Preferred Language
                </Label>
                <div className="relative">
                  <select
                    id="preferred_language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="h-[48px] w-full appearance-none border-b-[1.5px] border-[#C1C7CD] bg-[#F8F8F8] px-3 py-2 pr-10 outline-none"
                  >
                    <option value="" disabled>
                      Select a language
                    </option>
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                className="w-full max-w-sm rounded-full bg-[#9C4A9A] px-6 py-3 text-base font-medium text-white hover:bg-[#833F81] focus:outline-none disabled:bg-[#D0AFD0]"
                disabled={
                  isUpdating ||
                  (!isDirty &&
                    !selectedImage &&
                    (!isFleetAdmin ||
                      (isFleetAdmin &&
                        profile?.lang?.langLocale === selectedLanguage))) ||
                  submitSuccess
                }
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : submitSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default MyProfile;
