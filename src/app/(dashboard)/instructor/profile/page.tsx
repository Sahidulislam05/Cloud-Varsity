import type { Metadata } from "next";
import { InstructorProfileView } from "@/components/instructor/instructor-profile-view";

export const metadata: Metadata = { title: "Profile" };

export default function InstructorProfilePage() {
  return <InstructorProfileView />;
}
