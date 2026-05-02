import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./components/CartContext";

export const metadata: Metadata = {
  title: "AIS Marketplace",
  description: "AI Services Marketplace — powered by Aptean Intelligence Studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
