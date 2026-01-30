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
    "Une secrétaire coûte 30 000€/an. Notre système fait le même travail pour 8 000€. Une seule fois. Booking, devis, CRM, notifications — tout automatisé.",
  keywords: [
    "secrétaire digitale",
    "ERP",
    "automatisation",
    "BTP",
    "bâtiment",
    "transport",
    "devis automatique",
    "CRM",
    "booking",
  ],
  openGraph: {
    title: "monapplication.be | Votre Secrétaire Digitale",
    description:
      "Une secrétaire coûte 30 000€/an. Notre système fait le même travail pour 8 000€.",
    type: "website",
    locale: "fr_BE",
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
