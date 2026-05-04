import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./components/CartContext";

export const metadata: Metadata = {
  title: "Aptean AI Agent Marketplace",
  description: "Aptean AI Agent Marketplace — powered by AIaaS",
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
