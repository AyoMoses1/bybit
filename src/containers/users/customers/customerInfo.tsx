"use client";
import { Camera, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/store/user/user";
import { updateCustomerProfileImage } from "@/store/user/userAction";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/HOC/ProtectedRoute";

type User = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profile_image?: string;
  approved: boolean;
  referralId: string;
};

const CustomerInfo = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const { id } = useParams();
  const mutation = useUpdateUser();
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: user } = useGetUserById(userId ?? "") as {
    data: User | undefined;
  };

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    referralId: "",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // Validate file size (100KB)
    if (selectedFile.size > 100 * 1024) {
      setError("File size must be less than 100KB");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      if (img.width !== img.height) {
        setError("Image must be square.");
        return;
      }

      setError(null);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    };
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      let downloadURL;
      if (selectedFile instanceof File) {
        downloadURL = await updateCustomerProfileImage(
          selectedFile,
          userId ?? "",
        );
      } else {
        downloadURL = selectedFile;
      }

      const updatedData = {
        firstName: data.firstName,
        lastName: data.lastName,
        approved: selectedValue === "approved" ? true : false,
        ...(downloadURL && { profile_image: downloadURL }),
      };

      mutation.mutate(
        {
          id: userId ?? "",
          updatedData,
        },
        {
          onError: () => {
            console.log("Something went wrong!");
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            toast.success("User updated successfully");
          },
        },
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    setData({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      mobile: user?.mobile ?? "",
      email: user?.email ?? "",
      referralId: user?.referralId ?? "",
    });
    setSelectedValue(user?.approved ? "approved" : "not-approved");
    setSelectedImage(user?.profile_image ?? "");
  }, [user]);

  console.log(user);
  return (
    <div className="py-6">
      <div className="rounded-lg bg-white px-8 py-12 shadow-md">
        <div className="flex justify-between gap-8">
          {/* Profile Image Upload */}
          <div className="flex w-[15%] flex-col px-4">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="file-upload"
              className="relative flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-full bg-[#ECECEE]"
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Camera className="size-6 text-[#414141]" />
              )}
            </label>
            <p
              className="w-full cursor-pointer pt-1 text-sm font-semibold text-[#DA4CBF]"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Upload Photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex w-[85%] justify-between gap-16">
            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="John"
                  value={data.firstName}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="+352 232323"
                  disabled
                  value={data.mobile}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      mobile: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  ID/Passport Number
                </label>
                <input
                  disabled
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder=""
                />
              </div>

              <div className="w-full">
                <label
                  className={`block font-[Roboto] text-sm font-normal text-[#A2A9B0]`}
                >
                  Sign Up Referral
                </label>
                <input
                  disabled
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="N/A"
                />
              </div>

              <div className="w-full">
                <label
                  className={`block pb-[6px] font-[Roboto] text-sm font-normal text-[#A2A9B0]`}
                >
                  Upload ID/Passport
                </label>
                <div className="flex items-center gap-3">
                  {/* Image Preview Box */}
                  <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[5px] border bg-[#E2E6EC]">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-[100px] w-[100px] rounded-[5px] bg-[#E2E6EC]">
                        📷
                      </div>
                    )}
                  </div>

                  {/* File Input Section */}
                  <div className="flex flex-col">
                    <p className="font-[Roboto] text-xs font-[300] italic text-[#000000]">
                      Please upload square image, size less than 100KB
                    </p>

                    <label className="mt-2 flex cursor-pointer items-center rounded-lg border border-purple-400 px-4 py-2 hover:bg-purple-50">
                      <span className="font-semibold text-purple-600">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {file && (
                      <p className="mt-1 text-sm text-gray-600">{file.name}</p>
                    )}
                    {error && (
                      <p className="mt-1 text-sm text-red-500">{error}</p>
                    )}
                  </div>
                </div>

                {/* <input
                  disabled
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="N/A"
                /> */}
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Last"
                  value={data.lastName}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="email@vasas.com"
                  value={data.email}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Referral ID
                </label>
                <input
                  disabled
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder=""
                  value={data.referralId}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      referralId: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Approval Status
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${selectedValue === "" ? "text-[#697077]" : "text-[#21272A]"}`}
                  >
                    <option value="" disabled className="text-[#697077]">
                      Select an option
                    </option>
                    <option value="approved" className="text-[#21272A]">
                      Approved
                    </option>
                    <option value="not-approved" className="text-[#21272A]">
                      Not Approved
                    </option>
                  </select>

                  {/* Custom Dropdown Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>

              <div style={{ visibility: "hidden" }} className="w-full">
                <label
                  className={`font-[Roboto] text-sm font-normal text-[#A2A9B0]`}
                >
                  disabled
                </label>
                <input
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-12 flex justify-center">
          <Button
            disabled={loading}
            onClick={handleUpdate}
            className="w-[287px] py-[10px]"
            size={"default"}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(CustomerInfo);
