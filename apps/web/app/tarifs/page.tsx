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
  ArrowRight,
  Layers,
  Bell,
  MessageCircle,
  Globe,
  CalendarCheck,
  FileCheck,
  Users,
  Mail,
  Bot,
  Shield,
  Sparkles,
  Phone,
} from "lucide-react";

const packages = [
  {
    id: "fondations",
    name: "Fondations",
    icon: Layers,
    color: "bg-primary",
    tagline: "Base",
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
    tagline: "Add-on",
    description: "Zéro oubli, zéro no-show",
    detailedDescription: "Inclut tout le package Fondations + rappels WhatsApp automatiques avant chaque RDV, emails de confirmation, alertes personnalisées et suivi complet de tous vos envois. Réduisez les no-shows de 80%.",
    features: [
      "Tout Fondations inclus",
      "Rappels WhatsApp avant RDV",
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
    tagline: "Add-on",
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
    popular: false,
    description: "Votre secrétaire digitale",
    features: {
      fondations: true,
      notifications: false,
      marketing: false,
    },
  },
  {
    name: "PRO",
    popular: true,
    description: "Le plus populaire",
    features: {
      fondations: true,
      notifications: true,
      marketing: false,
    },
  },
  {
    name: "FULL",
    popular: false,
    description: "Tout automatisé",
    badge: "COMPLET",
    features: {
      fondations: true,
      notifications: true,
      marketing: true,
    },
  },
];

const advantages = [
  {
    icon: Shield,
    title: "Paiement unique",
    description: "Pas d'abonnement. Vous payez une fois, vous utilisez pour toujours.",
  },
  {
    icon: Sparkles,
    title: "Clé en main",
    description: "On s'occupe de tout. Opérationnel en 30 jours.",
  },
  {
    icon: Users,
    title: "Vous êtes propriétaire",
    description: "Le système vous appartient. Aucune dépendance.",
  },
  {
    icon: Phone,
    title: "Support inclus",
    description: "Formation de 2h + 30 jours de support après mise en ligne.",
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
              Nos formules
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Un système sur mesure,
              <br />
              <span className="text-accent">adapté à votre métier.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Choisissez les packages dont vous avez besoin. On construit
              votre solution ensemble. Opérationnel en 30 jours.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                Demander un devis gratuit
                <ArrowRight size={20} />
              </Link>
            </motion.div>
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
                    <span className="text-white/80 text-sm">{pkg.tagline}</span>
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
            {packages.map((pkg) => (
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
                        <span className="text-white/80 text-sm">{pkg.tagline}</span>
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
                          className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                            feature.startsWith("Tout")
                              ? "bg-primary/10 text-primary font-semibold"
                              : "bg-gray-100 text-text-muted"
                          }`}
                        >
                          <Check className={`w-3 h-3 ${feature.startsWith("Tout") ? "text-primary" : "text-green-500"}`} />
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

      {/* Choisissez votre formule */}
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
              Paiement unique. Pas d&apos;abonnement. Opérationnel en 30 jours.
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
                    : pack.badge
                    ? "border-green-500 shadow-xl shadow-green-500/10"
                    : "border-gray-100"
                }`}
              >
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAIRE
                  </div>
                )}
                {pack.badge && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {pack.badge}
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {pack.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-4">
                    {pack.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-accent">
                      Devis sur mesure
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-text-muted">Fondations</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      {pack.features.notifications ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4 text-gray-300 text-center">—</span>
                      )}
                      <span className={pack.features.notifications ? "text-text-muted" : "text-gray-400"}>Notifications</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      {pack.features.marketing ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4 text-gray-300 text-center">—</span>
                      )}
                      <span className={pack.features.marketing ? "text-text-muted" : "text-gray-400"}>Marketing</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      pack.popular
                        ? "bg-accent hover:bg-accent-light text-white"
                        : pack.badge
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-primary/10 hover:bg-primary/20 text-primary"
                    }`}
                  >
                    Demander un devis
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 md:py-24 bg-background">
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
              Pourquoi nous choisir ?
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
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
              Appelez-nous ou demandez un devis gratuit. On vous rappelle sous
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
                Demander un devis gratuit
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
