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
    "Spécialistes en automatisation pour entrepreneurs. Votre secrétaire digitale IA gère booking, devis, CRM, rappels et notifications 24h/24. Opérationnel en 30 jours.",
  keywords: [
    "secrétaire digitale",
    "automatisation",
    "IA",
    "intelligence artificielle",
    "ERP",
    "CRM",
    "booking",
    "devis automatique",
    "gestion clients",
    "artisan",
    "entrepreneur",
    "Belgique",
    "Bruxelles",
  ],
  openGraph: {
    title: "monapplication.be | Votre Secrétaire Digitale",
    description:
      "Spécialistes en automatisation. Secrétaire digitale IA : booking, devis, CRM, notifications 24h/24. Demandez votre devis gratuit.",
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
