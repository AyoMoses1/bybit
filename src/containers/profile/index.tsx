"use client";
import { useForm } from "react-hook-form";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import TextInput from "@/components/TextInput";

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

export default function MyProfile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [formKey, setFormKey] = useState(0);

  // Language options - replace with actual data
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
      if (profile.lang && profile.lang.langLocale) {
        setSelectedLanguage(profile.lang.langLocale);
      }

      // Force re-render of form to ensure values are displayed
      setFormKey((prev) => prev + 1);
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

      if (data.email !== profile.email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(data.email)) {
          toast({
            title: "Error",
            description: "Please enter a valid email address",
            variant: "destructive",
          });
          return;
        }

        const emailExists = await checkUserExists({ email: data.email });
        if (emailExists.users && emailExists.users.length > 0) {
          toast({
            title: "Error",
            description: "This email is already in use",
            variant: "destructive",
          });
          return;
        }
      }

      if (data.mobile !== profile.mobile && data.mobile) {
        if (data.mobile.length < 6) {
          toast({
            title: "Error",
            description: "Mobile number must be at least 6 digits",
            variant: "destructive",
          });
          return;
        }

        const mobileExists = await checkUserExists({ mobile: data.mobile });
        if (mobileExists.users && mobileExists.users.length > 0) {
          toast({
            title: "Error",
            description: "This mobile number is already in use",
            variant: "destructive",
          });
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

      // Update language if changed
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

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-[1000px] pl-4">
      <div className="rounded-2xl bg-white p-6">
        {/* Profile Image */}
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
              />
            ) : profile?.profile_image ? (
              <Image
                src={profile.profile_image}
                alt="Profile"
                className="h-full w-full object-cover"
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
          <p className="mt-2 text-center text-base font-medium text-purple-500">
            Upload Logo
          </p>
        </div>

        <form
          key={formKey}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div>
              <TextInput
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                value={profile?.firstName || ""}
                placeholder="Alex"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                value={profile?.lastName || ""}
                disabled={profile?.usertype === "driver"}
                placeholder="Rider"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Phone Number"
                {...register("mobile", {
                  required: "Mobile is required",
                  minLength: {
                    value: 6,
                    message: "Mobile must be at least 6 characters",
                  },
                })}
                value={profile?.mobile || ""}
                type="tel"
                disabled={profile?.usertype === "driver"}
                placeholder="+237 434352 232323"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                value={profile?.email || ""}
                type="email"
                disabled={profile?.usertype === "driver"}
                placeholder="wedea3223@sdjs.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="User Type"
                {...register("usertype")}
                value={profile?.usertype || ""}
                disabled
                placeholder="Admin"
              />
            </div>

            <div>
              <Label
                htmlFor="preferred_language"
                className="block font-[Roboto] text-base font-normal text-[#21272A]"
              >
                Preferred Language
              </Label>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${
                    selectedLanguage === ""
                      ? "text-[#697077]"
                      : "text-[#21272A]"
                  }`}
                  defaultValue={profile?.lang?.langLocale}
                >
                  <option value="" disabled className="text-[#697077]">
                    Select a language
                  </option>
                  {languageOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="text-[#21272A]"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                  <ChevronDown className="size-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              className="w-full max-w-sm rounded-full px-6 py-3 text-base font-medium text-white focus:outline-none"
              disabled={isUpdating || (!isDirty && !selectedImage)}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
