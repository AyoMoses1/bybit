import MyProfile from "@/containers/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and edit your profile information",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyProfile />
    </div>
  );
}
