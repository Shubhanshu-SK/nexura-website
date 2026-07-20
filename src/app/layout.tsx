import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageLoader from "@/components/ui/PageLoader";
import RouteProgressBar from "@/components/ui/RouteProgressBar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nexura Club · UIT-RGPV",
  description: "Creation Leads, Victory Follows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} bg-nx-bg`}>
      <body className="min-h-screen bg-nx-bg text-nx-text font-inter antialiased">
        <PageLoader />
        <RouteProgressBar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
