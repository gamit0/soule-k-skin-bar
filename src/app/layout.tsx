import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { useState, useEffect } from "react";
import { N8nChatBot } from "@/components/ai/n8n-chatbot";
import { SessionProvider } from "next-auth/react";

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

function ClientChatWrapper() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <N8nChatBot
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <SessionProvider>
          <CartProvider>
            {children}
            <ChatMount />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function ChatMount() {
  // Use client component to avoid SSR hydration issues with local state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ClientChatWrapper />;
}
