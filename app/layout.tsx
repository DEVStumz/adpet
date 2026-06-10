// app/layout.tsx — REPLACE your existing one with this

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // ← "component" no "s" — matches YOUR folder name

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = "https://adpet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "ADPET Investment Company Limited", template: "%s | ADPET Investment Co." },
  description: "Nigeria's premier multi-disciplinary investment company spanning Real Estate, Building Materials, Automobile, and General Contracts. CAC Registered · RC: 7202166.",
  keywords: ["ADPET", "investment company Nigeria", "real estate Nigeria", "building materials", "automobile dealership Nigeria", "general contracts"],
  authors: [{ name: "ADPET Investment Company Nigeria Limited" }],
  creator: "ADPET Investment Company Nigeria Limited",
  publisher: "ADPET Investment Company Nigeria Limited",
  openGraph: {
    type: "website", url: BASE_URL, siteName: "ADPET Investment Co.",
    title: "ADPET Investment Company Limited",
    description: "Premier multi-disciplinary investment company delivering excellence across Nigeria's key economic sectors.",
    images: [{ url: "/images/adpetlogo.jpeg", width: 1200, height: 630, alt: "ADPET Investment Company logo", type: "image/jpeg" }],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADPET Investment Company Limited",
    description: "Premier multi-disciplinary investment company delivering excellence across Nigeria's key economic sectors.",
    images: ["/images/adpetlogo.jpeg"],
  },
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: {
    icon: [{ url: "/images/adpetlogo.jpeg", sizes: "32x32", type: "image/jpeg" }, { url: "/images/adpetlogo.jpeg", sizes: "16x16", type: "image/jpeg" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/adpetlogo.jpeg", sizes: "180x180", type: "image/jpeg" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        geistSans.variable and geistMono.variable restore your original font CSS variables.
        The shared <Navbar /> here means EVERY page (home, /sale, /service) gets the same navbar
        automatically — so you must DELETE the Navbar component from app/page.tsx (see instructions).
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0, background: "#f8f6f1" }}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}