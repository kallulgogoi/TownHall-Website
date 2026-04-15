import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Ribbons from "@/components/ui/Ribbons";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import Preloader from "@/components/ui/Preloader";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const myFont = localFont({
  src: [
    {
      path: "../public/fonts/OvercameDemoRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/OvercameDemoBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom",
});

export const metadata: Metadata = {
  title: "Townhall 2026",
  description: "Coding Club NIT Silchar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${myFont.variable} font-custom bg-arena-900 text-white antialiased overflow-x-hidden`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              // fontFamily: "var(--font-custom)",
            },
          }}
        />

        <Preloader />
        <div className="fixed inset-0 z-9999 pointer-events-none overflow-hidden">
          <Ribbons
            baseThickness={6}
            colors={["#facc15", "#ffffff"]}
            speedMultiplier={0.5}
            maxAge={400}
            enableFade={true}
            enableShaderEffect={true}
          />
        </div>

        <div className="relative z-10">
          <ScrollToTop />
          <Navbar />
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
