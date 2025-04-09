// components/MyProfile.tsx
"use client";

import { useForm } from "react-hook-form";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define complete type for profile form data
type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  usertype: string;
};

// Define type for language options
interface LanguageOption {
  value: string;
  label: string;
}

export default function MyProfile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [formKey, setFormKey] = useState(0); // Force form re-render when needed

  // Language options - replace with your actual data
  const languageOptions: LanguageOption[] = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "Français" },
    // Add more languages as needed
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

  // Initialize form with profile data whenever profile changes
  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);

      // Set form values
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

      // Check if email has changed and validate
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

        // Check if email already exists
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

      // Check if mobile has changed and validate
      if (data.mobile !== profile.mobile && data.mobile) {
        // Simple mobile validation
        if (data.mobile.length < 6) {
          toast({
            title: "Error",
            description: "Mobile number must be at least 6 digits",
            variant: "destructive",
          });
          return;
        }

        // Check if mobile already exists
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

      // Prepare update data
      const updateData: Partial<ProfileFormData> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
      };

      // Update profile data
      await updateProfile(updateData);

      // Update profile image if changed
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
              dateLocale: selectedLang.value, // Adjust if your date locale differs
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Profile</h1>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        {/* Profile Image */}
        <div className="mb-6 flex flex-col items-center">
          <div
            className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
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

        {/* Profile Form */}
        <form
          key={formKey}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                {...register("firstName", {
                  required: "First name is required",
                })}
                defaultValue={profile?.firstName || ""}
                disabled={profile?.usertype === "driver"}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                {...register("lastName", { required: "Last name is required" })}
                defaultValue={profile?.lastName || ""}
                disabled={profile?.usertype === "driver"}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                defaultValue={profile?.email || ""}
                type="email"
                disabled={profile?.usertype === "driver"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <Input
                {...register("mobile", {
                  required: "Mobile is required",
                  minLength: {
                    value: 6,
                    message: "Mobile must be at least 6 characters",
                  },
                })}
                defaultValue={profile?.mobile || ""}
                type="tel"
                disabled={profile?.usertype === "driver"}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                User Type
              </label>
              <Input
                {...register("usertype")}
                defaultValue={profile?.usertype || ""}
                disabled
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                defaultValue={profile?.lang?.langLocale}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full md:w-1/2"
              disabled={isUpdating || (!isDirty && !selectedImage)}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
