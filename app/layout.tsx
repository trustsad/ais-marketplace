import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIS Marketplace",
  description: "AI Services Marketplace — powered by Aptean Intelligence Studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
