"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  Check,
  X,
  ArrowRight,
  Layers,
  Zap,
  Bell,
  MessageCircle,
  Globe,
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  FileCheck,
  Users,
  Mail,
  Bot,
} from "lucide-react";

const packages = [
  {
    id: "fondations",
    name: "Fondations",
    icon: Layers,
    color: "bg-primary",
    price: "5 000€",
    priceNote: "Base",
    description: "Votre secrétaire digitale complète",
    detailedDescription: "Tout ce qu'il faut pour automatiser votre admin : site web pro optimisé SEO, booking RDV en ligne 24h/24, générateur de devis en 2 clics, CRM clients complet, calendrier intelligent. Plus une formation de 2h et 30 jours de support.",
    features: [
      "Site web professionnel + SEO",
      "Booking RDV en ligne 24h/24",
      "Générateur de devis",
      "CRM clients complet",
      "Calendrier intelligent",
      "Formation (2h) + Support 30j",
    ],
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    color: "bg-green-600",
    price: "+1 500€",
    priceNote: "Add-on",
    description: "Zéro oubli, zéro no-show",
    detailedDescription: "Inclut tout le package Fondations + rappels SMS automatiques avant chaque RDV, emails de confirmation, alertes personnalisées et suivi complet de tous vos envois. Réduisez les no-shows de 80%.",
    features: [
      "Tout Fondations inclus",
      "Rappels SMS avant RDV",
      "Emails automatiques",
      "Alertes personnalisées",
      "Confirmations auto",
      "Suivi des envois",
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: MessageCircle,
    color: "bg-accent",
    price: "+2 500€",
    priceNote: "Add-on",
    description: "Automatisation 24h/24 sur tous les canaux",
    detailedDescription: "Inclut tout le package Fondations + Notifications. Soyez disponible partout, tout le temps : WhatsApp Business, Messenger et Instagram DM intégrés avec réponses automatisées. Disponible 24h/24.",
    features: [
      "Tout Fondations + Notifications inclus",
      "WhatsApp Business intégré",
      "Messenger automatisé",
      "Instagram DM",
      "Réponses automatisées",
      "Disponible 24h/24",
    ],
  },
];

const packs = [
  {
    name: "FONDATIONS",
    price: "5 000€",
    originalPrice: null,
    popular: false,
    description: "Votre secrétaire digitale",
    savings: null,
    features: {
      fondations: true,
      notifications: false,
      marketing: false,
    },
  },
  {
    name: "PRO",
    price: "6 500€",
    originalPrice: null,
    popular: true,
    description: "Le plus populaire",
    savings: null,
    features: {
      fondations: true,
      notifications: true,
      marketing: false,
    },
  },
  {
    name: "FULL",
    price: "8 000€",
    originalPrice: "9 000€",
    popular: false,
    description: "Tout automatisé",
    savings: "Économisez 1 000€",
    features: {
      fondations: true,
      notifications: true,
      marketing: true,
    },
  },
];

const comparisonData = [
  {
    feature: "Coût mensuel",
    secretary: "~2 400€ brut",
    digital: "0€/mois",
  },
  {
    feature: "Coût première année",
    secretary: "~29 000€",
    digital: "À partir de 5 000€",
  },
  {
    feature: "Mise en place",
    secretary: "Formation + adaptation",
    digital: "30 jours clé en main",
  },
  {
    feature: "Disponibilité",
    secretary: "8h - 17h",
    digital: "24h/24, 7j/7",
  },
  {
    feature: "Canaux",
    secretary: "Téléphone, email",
    digital: "WhatsApp, Messenger, Instagram",
  },
];

export default function TarifsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
            >
              Tarifs
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Construisez votre système
              <br />
              <span className="text-accent">bloc par bloc.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Choisissez les packages dont vous avez besoin. Payez une fois,
              utilisez pour toujours. Opérationnel en 30 jours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 md:py-24 bg-background -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              Les 3 packages
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted">
              Combinez-les selon vos besoins
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={fadeInUp}
                className="bg-surface rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`${pkg.color} p-4 flex items-center gap-3`}>
                  <pkg.icon className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white">{pkg.name}</h3>
                    <span className="text-white/80 text-sm">{pkg.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-text-muted text-sm mb-4">
                    {pkg.description}
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Détail des packages */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              Que contient chaque package ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted">
              Chaque bloc apporte des fonctionnalités complémentaires
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-6"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  <div className={`${pkg.color} p-6 flex flex-col justify-center`}>
                    <div className="flex items-center gap-3 mb-2">
                      <pkg.icon className="w-8 h-8 text-white" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        <span className="text-white/80 text-sm">{pkg.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6">
                    <p className="text-text-muted mb-4 leading-relaxed">
                      {pkg.detailedDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-gray-100 text-text-muted text-sm px-3 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packs recommandés */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              Choisissez votre formule
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted">
              Prix one-shot. Pas d&apos;abonnement. Opérationnel en 30 jours.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {packs.map((pack) => (
              <motion.div
                key={pack.name}
                variants={fadeInUp}
                className={`relative bg-white rounded-2xl border-2 overflow-hidden ${
                  pack.popular
                    ? "border-accent shadow-xl shadow-accent/10"
                    : pack.name === "FULL"
                    ? "border-green-500 shadow-xl shadow-green-500/10"
                    : "border-gray-100"
                }`}
              >
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAIRE
                  </div>
                )}
                {pack.savings && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MEILLEURE OFFRE
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {pack.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-4">
                    {pack.description}
                  </p>
                  <div className="mb-2">
                    {pack.originalPrice && (
                      <span className="text-xl text-text-muted line-through mr-2">
                        {pack.originalPrice}
                      </span>
                    )}
                    <span className={`text-3xl font-bold ${pack.savings ? "text-green-600" : "text-accent"}`}>
                      {pack.price}
                    </span>
                  </div>
                  {pack.savings && (
                    <p className="text-green-600 text-sm font-semibold mb-4">
                      {pack.savings}
                    </p>
                  )}
                  {!pack.savings && <div className="mb-4" />}
                  <div className="space-y-2 mb-6">
                    {pack.includes.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      pack.popular
                        ? "bg-accent hover:bg-accent-light text-white"
                        : pack.savings
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-primary/10 hover:bg-primary/20 text-primary"
                    }`}
                  >
                    Choisir ce pack
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              Comparez les coûts
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted">
              Secrétaire classique (2 400€/mois) vs Secrétaire Digitale
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="grid grid-cols-3 bg-primary text-white text-sm md:text-base">
              <div className="p-4 md:p-6 font-medium">Critère</div>
              <div className="p-4 md:p-6 font-medium text-center border-l border-white/10">
                Secrétaire
              </div>
              <div className="p-4 md:p-6 font-medium text-center border-l border-white/10 bg-accent">
                Digitale
              </div>
            </div>
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 text-sm md:text-base ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="p-4 md:p-6 text-primary font-medium">
                  {row.feature}
                </div>
                <div className="p-4 md:p-6 text-center text-text-muted border-l border-gray-100">
                  {row.secretary}
                </div>
                <div className="p-4 md:p-6 text-center border-l border-gray-100 font-semibold text-accent">
                  {row.digital}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mt-8 text-text-muted"
          >
            <span className="text-primary font-semibold">
              Économie sur 5 ans :
            </span>{" "}
            <span className="text-accent font-bold text-xl">+120 000€</span>
          </motion.p>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="bg-primary/5 rounded-2xl p-6 md:p-8"
          >
            <h3 className="font-semibold text-primary mb-3">
              Frais d&apos;infrastructure (payés directement aux fournisseurs)
            </h3>
            <p className="text-text-muted mb-2">
              <span className="font-medium">Hébergement :</span> ~20-50€/mois
              (Vercel + Supabase)
            </p>
            <p className="text-sm text-text-muted">
              <em>
                Pas d&apos;abonnement vers monapplication.be — vous êtes
                propriétaire de votre système.
              </em>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              Prêt à automatiser votre admin ?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 mb-8 max-w-xl mx-auto"
            >
              Appelez-nous ou demandez une démo gratuite. On vous rappelle sous
              24h.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                Demander une démo
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+32460242427"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all"
              >
                +32 460 24 24 27
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
