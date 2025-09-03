// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/layout/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple AgTech ERP - Cooperative Management Platform",
  description:
    "A simple, full-stack AgTech ERP platform for managing farmers and crops.",
  keywords: [
    "AgTech",
    "ERP",
    "agriculture",
    "cooperative management",
    "farmer management",
    "crop management",
    "full-stack",
    "technical assessment",
  ],
  openGraph: {
    title: "Simple AgTech ERP - Cooperative Management Platform",
    description:
      "A simple, full-stack AgTech ERP platform for managing farmers and crops.",
    siteName: "Simple AgTech ERP",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple AgTech ERP",
    description:
      "A simple, full-stack AgTech ERP platform for managing farmers and crops.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
