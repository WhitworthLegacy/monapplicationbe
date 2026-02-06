"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
  hoverLift,
} from "@/lib/animations";
import {
  FileSpreadsheet,
  PhoneMissed,
  Mail,
  FileText,
  Calendar,
  Wallet,
  Clock,
  AlertTriangle,
} from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Excel le soir, Excel le week-end",
    description:
      "Vous rentrez crevé du chantier et vous devez encore encoder vos heures, vos matériaux, vos factures. Pendant que votre famille vous attend.",
    stat: "~8h/semaine perdues",
  },
  {
    icon: PhoneMissed,
    title: "3 appels manqués = 3 clients perdus",
    description:
      "Vous êtes sur un toit, les mains dans le plâtre, sous une voiture... Le téléphone sonne. Vous rappelez 2h plus tard : trop tard, ils ont trouvé quelqu'un d'autre.",
    stat: "Clients perdus",
  },
  {
    icon: Clock,
    title: "\"Je vous rappelle\" — mais quand ?",
    description:
      "Vous notez sur un bout de papier, vous oubliez. Le client attend. Il relance. Vous passez pour quelqu'un de pas sérieux alors que vous bossez 12h/jour.",
    stat: "Réputation en jeu",
  },
  {
    icon: FileText,
    title: "Le devis qui traîne 3 jours",
    description:
      "Le client est chaud, prêt à signer. Mais vous avez 2 chantiers en cours. Le temps de faire le devis, il a signé ailleurs. Vous avez perdu le job.",
    stat: "Concurrent plus rapide",
  },
  {
    icon: Mail,
    title: "21h : vous répondez encore aux mails",
    description:
      "Confirmations de RDV, relances de paiement, demandes de devis... Votre boîte mail déborde. Vos soirées y passent. Votre vie perso trinque.",
    stat: "0 déconnexion",
  },
  {
    icon: Wallet,
    title: "2 500€/mois pour du copier-coller ?",
    description:
      "Une secrétaire à 2 500€ brut/mois pour encoder des lignes, envoyer des mails de confirmation et répondre au téléphone. Des tâches répétitives qu'un système fait mieux, plus vite, et sans congés.",
    stat: "Budget mieux investi",
  },
];

export function Problems() {
  return (
    <section className="py-20 md:py-28 bg-background">
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
            className="inline-block text-red-500 font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Ça vous parle ?
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Vous êtes artisan,
            <br />
            <span className="text-red-500">pas secrétaire.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Votre métier c'est d'être sur le terrain — pas derrière un écran à 22h
            pour encoder des lignes dans Excel ou répondre à des mails.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              {...hoverLift}
              className="bg-surface rounded-2xl p-6 md:p-8 border border-red-100 hover:border-red-200 cursor-default group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                  <problem.icon className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                  {problem.stat}
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-3">
                {problem.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              Résultat : vous travaillez 60h/semaine mais vous n'avancez pas.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
