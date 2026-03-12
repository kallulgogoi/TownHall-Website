import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Ribbons from "@/components/ui/Ribbons";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Townhall Arena",
  description: "Coding Club NIT Silchar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-arena-900 text-white antialiased overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          <Ribbons
            baseThickness={6}
            colors={["#facc15", "#ffffff"]}
            speedMultiplier={0.5}
            maxAge={400}
            enableFade={true}
            enableShaderEffect={true}
          />
        </div>

        {/* --- MAIN UI CONTENT --- */}
        <div className="relative z-10">
          <ScrollToTop />
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
