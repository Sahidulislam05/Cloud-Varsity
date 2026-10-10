import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "CloudVarsity — Digital University Management",
    template: "%s | CloudVarsity",
  },
  description:
    "CloudVarsity connects course registration, attendance, results, GPA and tuition payments in one secure university platform.",
  openGraph: {
    siteName: "CloudVarsity",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning={true}
      >
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
