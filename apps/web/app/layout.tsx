import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "monapplication.be | Votre Secrétaire Digitale",
  description:
    "Votre secrétaire digitale : booking, devis, CRM, notifications 24h/24. Plus site web, e-commerce & SEO. Opérationnel en 30 jours. Demandez votre devis gratuit.",
  keywords: [
    "secrétaire digitale",
    "ERP",
    "automatisation",
    "CRM",
    "booking",
    "création site web",
    "e-commerce",
    "SEO",
    "référencement",
    "Belgique",
    "Bruxelles",
  ],
  openGraph: {
    title: "monapplication.be | Votre Secrétaire Digitale",
    description:
      "Booking, devis, CRM, notifications 24h/24 + site web, e-commerce & SEO. Demandez votre devis gratuit.",
    type: "website",
    locale: "fr_BE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "monapplication.be - Votre Secrétaire Digitale",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
