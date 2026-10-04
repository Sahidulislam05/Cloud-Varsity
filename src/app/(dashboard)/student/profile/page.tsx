import type { Metadata } from "next";
import { ProfileView } from "@/components/student/profile-view";

export const metadata: Metadata = { title: "Profile" };

export default function StudentProfilePage() {
  return <ProfileView />;
}
