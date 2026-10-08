import type { Metadata } from "next";
import { SemestersView } from "@/components/registrar/semesters-view";

export const metadata: Metadata = { title: "Semesters" };

export default function RegistrarPage() {
  return <SemestersView />;
}
