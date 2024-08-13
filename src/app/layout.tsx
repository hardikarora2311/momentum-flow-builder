import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentum: Workflow",
  description: "Submission by Hardik Arora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
