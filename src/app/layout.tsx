import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ChatWidget } from "@/components/ai/chat-widget";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Soule K Skin Bar | Rutinas K-Beauty Personalizadas",
    template: "%s | Soule K Skin Bar",
  },
  description:
    "Descubre tu Shot de skincare ideal con nuestro diagnóstico K-Beauty. Rutinas de alta potencia diseñadas por especialistas coreanos. Cosmética original con activos concentrados.",
  keywords: [
    "skincare coreano",
    "K-Beauty",
    "rutina de piel",
    "shot de skincare",
    "diagnóstico de piel",
    "cosmética coreana",
    "Anua",
    "Beauty of Joseon",
    "COSRX",
    "piel saludable",
    "serum coreano",
    "limpiador coreano",
  ],
  authors: [{ name: "Soule K Skin Bar" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Soule K Skin Bar",
    title: "Soule K Skin Bar | Rutinas K-Beauty Personalizadas",
    description:
      "Descubre tu Shot de skincare ideal con nuestro diagnóstico K-Beauty. Rutinas de alta potencia diseñadas por especialistas coreanos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Soule K Skin Bar - Skincare Coreano Personalizado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soule K Skin Bar | Rutinas K-Beauty Personalizadas",
    description:
      "Descubre tu Shot de skincare ideal con nuestro diagnóstico K-Beauty.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://soulekskinbar.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
