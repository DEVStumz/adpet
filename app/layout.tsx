import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://your-project.vercel.app"; // replace with your actual domain

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ADPET Investment Company Nigeria",
    template: "%s | ADPET Investment Co.",
  },
  description:
    "Nigeria's premier multi-disciplinary investment company spanning Real Estate, Building Materials, Automobile, and General Contracts. CAC Registered · RC: 7202166.",
  keywords: [
    "ADPET", "investment company Nigeria", "real estate Nigeria",
    "building materials", "automobile dealership Nigeria",
    "general contracts", "#",
  ],
  authors: [{ name: "ADPET Investment Company Nigeria Limited" }],
  creator: "ADPET Investment Company Nigeria Limited",
  publisher: "ADPET Investment Company Nigeria Limited",

  // ── Open Graph (Facebook, LinkedIn, WhatsApp, Slack, Discord…) ──
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "ADPET Investment Co.",
    title: "ADPET Investment Company Nigeria",
    description:
      "Premier multi-disciplinary investment company delivering excellence across Nigeria's key economic sectors.",
    images: [
      {
        url: "public/images/adpetlogo.jpeg",
        width: 1200,
        height: 630,
        alt: "ADPET Investment Company logo",
        type: "image/jpeg",
      },
    ],
    locale: "en_NG",
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    site: "@adpetinvestments", // replace with your actual handle or remove
    creator: "@adpetinvestments",
    title: "ADPET Investment Company Nigeria",
    description:
      "Premier multi-disciplinary investment company delivering excellence across Nigeria's key economic sectors.",
    images: [" public/images/adpetlogo.jpeg"],
  },

  // ── Canonical & alternates ──
  alternates: {
    //canonical: BASE_URL,
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Favicon / app icons ──
 icons: {
  icon: [
    { url: " public/images/adpetlogo.jpeg", type: "image/jpeg" },
    { url: " public/images/adpetlogo.jpeg", sizes: "32x32", type: "image/jpeg" },
    { url: " public/images/adpetlogo.jpeg", sizes: "16x16", type: "image/jpeg" },
  ],
  shortcut: " public/images/adpetlogo.jpeg",
  apple: [
    { url: " public/images/adpetlogo.jpeg" },
    { url: " public/images/adpetlogo.jpeg", sizes: "180x180", type: "image/jpeg" },
  ],
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}