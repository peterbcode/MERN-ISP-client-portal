import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import MorphCursor from "./components/custom-cursor";
import FloatingActions from "./components/floating-actions";
import CookieConsent from "./components/cookie-consent";
import { ConsentProvider } from "./components/consent-provider";
import AnalyticsLoader from "./components/analytics-loader";
import PageLoader from "./components/page-loader";
import DevIndicatorRemover from "./components/dev-indicator-remover";

export const metadata: Metadata = {
  metadataBase: new URL("https://valley-computers.co.za"),
  title: {
    default: "Valley Computers | ISP and IT Solutions",
    template: "%s | Valley Computers",
  },
  description:
    "Valley Computers provides fibre, wireless internet, PC repairs and network engineering for homes and businesses in the Western Cape.",
  keywords: [
    "ISP",
    "fibre internet",
    "wireless internet",
    "PC repairs",
    "network engineering",
    "Western Cape",
    "Valley Computers",
  ],
  icons: {
    icon: '/favicon-96x96.png',
    shortcut: '/favicon-96x96.png',
    apple: '/favicon-96x96.png',
  },
  openGraph: {
    title: "Valley Computers | ISP and IT Solutions",
    description:
      "Reliable fibre and wireless internet, PC repairs, and network engineering for homes and businesses.",
    url: "https://valley-computers.co.za",
    siteName: "Valley Computers",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valley Computers | ISP and IT Solutions",
    description:
      "Reliable fibre and wireless internet, PC repairs, and network engineering for homes and businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body suppressHydrationWarning className="antialiased">
        <ConsentProvider>
          <PageLoader />
          {/* <MorphCursor /> */}
          <DevIndicatorRemover />
          {children}
          <CookieConsent />
          <FloatingActions />
          <AnalyticsLoader />
        </ConsentProvider>
      </body>
    </html>
  );
}
