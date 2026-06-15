import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import FloatingActions from "./components/floating-actions";
import CookieConsent from "./components/cookie-consent";
import { ConsentProvider } from "./components/consent-provider";
import AnalyticsLoader from "./components/analytics-loader";
import PageLoader from "./components/page-loader";
import DevIndicatorRemover from "./components/dev-indicator-remover";
import SmoothScroll from "./components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://valley-computers.co.za"),
  title: {
    default: "Valley Computers | ISP and IT Solutions",
    template: "%s | Valley Computers",
  },
  description:
    "Valley Computers — Riebeek Valley's local ISP and IT support shop. Fibre & wireless internet, PC repairs, and network engineering across the Swartland, Western Cape.",
  keywords: [
    "ISP",
    "fibre internet",
    "wireless internet",
    "PC repairs",
    "network engineering",
    "Western Cape",
    "Riebeek Valley",
    "Swartland",
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
        <div className="cursor">
          <div className="cursor-border">
            <span className="text">VIEW</span>
          </div>
        </div>
        <ConsentProvider>
          <PageLoader />
          <DevIndicatorRemover />
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <CookieConsent />
          <FloatingActions />
          <AnalyticsLoader />
        </ConsentProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                if (window.matchMedia('(hover: none)').matches) return;

                var cursor = document.querySelector('.cursor');
                var border = document.querySelector('.cursor-border');
                if (!cursor || !border) return;

                cursor.classList.add('cursor--initialized');

                var mouseX = -30, mouseY = -30;

                document.addEventListener('mousemove', function(e) {
                  mouseX = e.clientX;
                  mouseY = e.clientY;
                  cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
                  cursor.classList.remove('cursor--off-screen');
                });

                document.addEventListener('mouseleave', function() {
                  cursor.classList.add('cursor--off-screen');
                });

                document.querySelectorAll('a, button').forEach(function(el) {
                  el.addEventListener('mouseenter', function() {
                    cursor.classList.add('cursor--focused');
                  });
                  el.addEventListener('mouseleave', function() {
                    cursor.classList.remove('cursor--focused');
                  });
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
