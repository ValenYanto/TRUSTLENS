import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";

import { AppToaster } from "@/src/components/theme/app-toaster";
import { ThemeProvider } from "@/src/components/theme/theme-provider";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "TrustLens: Real-Time Fraud Intelligence",
    template: "%s | TrustLens",
  },

  description:
    "TrustLens adalah platform fraud intelligence real-time berbasis Graph Neural Network dan Federated Learning.",

  keywords: [
    "TrustLens",
    "fraud detection",
    "fraud intelligence",
    "Graph Neural Network",
    "Federated Learning",
    "financial security",
    "fintech",
  ],

  openGraph: {
    title: "TrustLens: Real-Time Fraud Intelligence",
    description:
      "Mendeteksi fraud sebelum menjadi kerugian melalui Graph Neural Network dan Federated Learning.",
    type: "website",
    locale: "id_ID",
    siteName: "TrustLens",
  },

  twitter: {
    card: "summary_large_image",
    title: "TrustLens: Real-Time Fraud Intelligence",
    description:
      "Mendeteksi fraud sebelum menjadi kerugian melalui Graph Neural Network dan Federated Learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${manrope.variable} min-h-svh antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}

          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}