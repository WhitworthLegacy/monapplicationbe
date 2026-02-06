"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  Globe,
  ShoppingCart,
  Search,
  Bot,
  Palette,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Création de site web",
    description:
      "Site vitrine professionnel, landing page, site multi-pages — design moderne, responsive, optimisé pour convertir vos visiteurs en clients.",
    highlights: ["Design sur mesure", "Mobile-first", "Rapide & sécurisé"],
    color: "from-blue-500 to-blue-700",
    marketPrice: "~1 500€",
    marketLabel: "Prix du marché",
  },
  {
    icon: Palette,
    title: "Refonte de site web",
    description:
      "Votre site est daté ou ne convertit pas ? On le refait de A à Z avec un design moderne, du contenu optimisé et une vraie stratégie digitale.",
    highlights: ["Audit complet", "Nouveau design", "Migration incluse"],
    color: "from-purple-500 to-purple-700",
    marketPrice: "~2 000€",
    marketLabel: "Prix du marché",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Boutique en ligne complète : catalogue produits, panier, paiement sécurisé, gestion des commandes, suivi livraison. Prêt à vendre.",
    highlights: ["Paiement sécurisé", "Gestion stock", "Suivi commandes"],
    color: "from-green-500 to-green-700",
    marketPrice: "~3 000€",
    marketLabel: "Prix du marché",
  },
  {
    icon: Search,
    title: "SEO & Référencement",
    description:
      "Soyez trouvé sur Google. Optimisation technique, contenu SEO, stratégie de mots-clés. Les agences facturent 500€/mois pour 4 articles. Nous, on en génère 1 par jour grâce à l'IA.",
    highlights: ["1 article/jour par IA", "Audit SEO", "Résultats mesurables"],
    color: "from-orange-500 to-orange-700",
    marketPrice: "~500€/mois",
    marketLabel: "Agences : 4 articles/mois",
    badge: "IA",
  },
  {
    icon: Bot,
    title: "Automatisation & ERP",
    description:
      "Booking, devis, CRM, notifications WhatsApp, réponses automatiques — votre secrétaire digitale gère l'admin 24h/24 pendant que vous travaillez.",
    highlights: ["CRM intégré", "WhatsApp auto", "Devis en 2 clics"],
    color: "from-primary to-secondary",
    marketPrice: "~2 500€/mois",
    marketLabel: "Coût d'une secrétaire",
  },
  {
    icon: TrendingUp,
    title: "Marketing digital",
    description:
      "Réseaux sociaux, campagnes publicitaires, email marketing, automatisation — on met en place la machine qui génère des leads en continu.",
    highlights: ["Réseaux sociaux", "Publicité ciblée", "Leads qualifiés"],
    color: "from-red-500 to-red-700",
    marketPrice: "~1 000€/mois",
    marketLabel: "Agences marketing",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-background scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
          >
            On fait aussi
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Besoin d&apos;un site web ?
            <br />
            <span className="text-accent">D&apos;un e-shop ? De SEO ?</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            En plus de votre secrétaire digitale, on s&apos;occupe aussi de votre
            présence en ligne. Un seul interlocuteur pour tout.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {service.badge && (
                <div className="absolute top-4 right-4 z-10 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {service.badge}
                </div>
              )}
              <div
                className={`bg-gradient-to-r ${service.color} p-5 flex items-center gap-4`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {service.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium bg-primary/5 text-primary px-3 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                {/* Prix du marché */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      {service.marketLabel}
                    </span>
                    <span className="text-sm font-bold text-red-500 line-through">
                      {service.marketPrice}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom message */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-full mb-8">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">
              On fait tout ça sans exploser votre portefeuille.
            </span>
          </div>
          <div className="block">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
            >
              Demandez votre devis gratuit
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
