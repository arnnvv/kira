import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KIRA",
  description: "Generated for KIRA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </html>
  );
}
