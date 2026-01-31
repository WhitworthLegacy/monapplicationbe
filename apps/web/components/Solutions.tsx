"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  CalendarCheck,
  FileCheck,
  Users,
  MessageCircle,
  LayoutDashboard,
  Bot,
  Globe,
} from "lucide-react";

const solutions = [
  {
    icon: Bot,
    title: "Plus jamais d'appel manqué",
    before: "Vous êtes sur un chantier, le téléphone sonne, vous rappelez trop tard.",
    after: "Le système répond instantanément sur WhatsApp, Messenger, Instagram. Le client est pris en charge en 30 secondes.",
    result: "0 client perdu",
  },
  {
    icon: FileCheck,
    title: "Devis envoyé en 2 minutes",
    before: "Le devis traîne 3 jours. Le client a signé ailleurs.",
    after: "Templates prêts, calcul auto, envoi en 2 clics depuis votre téléphone entre 2 chantiers.",
    result: "Devis le jour même",
  },
  {
    icon: CalendarCheck,
    title: "RDV qui se gèrent tout seuls",
    before: "Coups de fil, SMS, \"je vous rappelle\", post-it perdus...",
    after: "Les clients réservent en ligne 24h/24. Rappels WhatsApp automatiques. Zéro no-show.",
    result: "Planning rempli",
  },
  {
    icon: Users,
    title: "Fini les infos éparpillées",
    before: "Notes sur papier, Excel, WhatsApp... Vous cherchez 10 minutes l'adresse du client.",
    after: "Tout au même endroit : coordonnées, historique, devis, paiements. En 1 clic.",
    result: "Tout centralisé",
  },
  {
    icon: MessageCircle,
    title: "Réponses pro 24h/24",
    before: "21h, vous répondez encore aux mails au lieu d'être avec votre famille.",
    after: "L'automatisation répond à votre place. Vos soirées sont à vous.",
    result: "Vie pro/perso",
  },
  {
    icon: Globe,
    title: "Visible sur Google",
    before: "Pas de site web, les clients ne vous trouvent pas en ligne.",
    after: "Site pro inclus + SEO. Quand on cherche \"plombier Bruxelles\", vous apparaissez.",
    result: "Nouveaux clients",
  },
];

export function Solutions() {
  return (
    <section
      id="fonctionnalites"
      className="py-20 md:py-28 bg-surface scroll-mt-20"
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
            className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-4"
          >
            La solution
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Elle gère tout.
            <br />
            <span className="text-accent">Vous, vous bossez.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Votre secrétaire digitale s'occupe de l'administratif pendant que
            vous êtes sur le terrain. Voyez la différence.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <solution.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {solution.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Before */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">AVANT</span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {solution.before}
                  </p>
                </div>

                {/* After */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">APRÈS</span>
                  </div>
                  <p className="text-primary text-sm leading-relaxed font-medium">
                    {solution.after}
                  </p>
                </div>

                {/* Result badge */}
                <div className="pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {solution.result}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
