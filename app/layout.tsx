import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MSHA Mine Safety Analytics | Data-Driven Risk Intelligence",
  description:
    "Mine fatalities are not random. MSHA already has the data to identify high-risk mines earlier — this platform shows how.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
