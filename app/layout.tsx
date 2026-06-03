import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
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
        <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var dot  = document.createElement('div');
    var ring = document.createElement('div');
    dot.className  = 'vc-dot';
    ring.className = 'vc-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function tick() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    })();
    function bindHover() {
      document.querySelectorAll('a,button,[role="button"],article').forEach(function(el) {
        el.addEventListener('mouseenter', function() {
          dot.classList.add('vc-dot-hover');
          ring.classList.add('vc-ring-hover');
        });
        el.addEventListener('mouseleave', function() {
          dot.classList.remove('vc-dot-hover');
          ring.classList.remove('vc-ring-hover');
        });
      });
    }
    bindHover();
    new MutationObserver(bindHover).observe(document.body, { childList:true, subtree:true });
  })();
` }} />
        <ConsentProvider>
          <PageLoader />
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
