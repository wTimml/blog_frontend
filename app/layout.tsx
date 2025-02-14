import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/sidebar";
import { Providers } from "./providers";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Fullstack Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-slate-800 text-black dark:text-white flex`} suppressHydrationWarning
        >
          <Providers >
            <SideBar/>

              <Suspense>

                {children}
              </Suspense>

            </Providers>
        </body>
    </html>
  );
}
