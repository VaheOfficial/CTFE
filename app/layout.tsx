import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission Control - Real-Time Rocket Launch Monitoring",
  description: "Access high-frequency radio audio, live video feeds, and real-time weather data from rocket launch facilities around the world.",
  keywords: "rocket launch, real-time monitoring, space launch, launchpad data, rocket telemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-950 text-gray-200`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
