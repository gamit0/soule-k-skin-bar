import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ChatWidget } from "@/components/ai/chat-widget";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Soule K Skin Bar",
  description: "Descubre el cocktail de skincare que tu piel necesita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
