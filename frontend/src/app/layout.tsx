import type { Metadata } from "next";


import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import Head from "next/head";

import "./globals.css";

export const metadata:Metadata = {
  title: "ONCHAIN-DAO",
  description: "A decentralized autonomous organization on the blockchain",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
        <html lang="en" suppressHydrationWarning>

      <body >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
