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
  Clock,
  Wallet,
  AlertTriangle,
  BrainCircuit,
  UserX,
} from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Vous bossez 60h/semaine",
    description:
      "La journée sur le terrain, le soir derrière un écran. Devis, factures, mails, relances... Votre admin vous vole vos soirées et vos week-ends.",
    stat: "+15h/sem perdues",
    category: "temps",
  },
  {
    icon: PhoneMissed,
    title: "3 appels manqués = 3 clients perdus",
    description:
      "Vous êtes sur un chantier, les mains occupées. Le téléphone sonne. Vous rappelez 2h plus tard : trop tard, ils ont trouvé quelqu'un d'autre.",
    stat: "Clients perdus",
    category: "argent",
  },
  {
    icon: Wallet,
    title: "2 500€/mois pour du copier-coller",
    description:
      "Vous payez une secrétaire pour encoder des lignes, envoyer des confirmations et répondre au téléphone. Des tâches répétitives qu'un système fait mieux, plus vite, sans congés.",
    stat: "30 000€/an",
    category: "argent",
  },
  {
    icon: UserX,
    title: "L'erreur est humaine — et elle coûte cher",
    description:
      "Oubli de rappeler un client, facture envoyée en retard, RDV mal noté, devis perdu... Chaque erreur de votre secrétaire vous coûte des clients et de l'argent.",
    stat: "Erreurs coûteuses",
    category: "argent",
  },
  {
    icon: FileText,
    title: "Le devis qui traîne 3 jours",
    description:
      "Le client est chaud, prêt à signer. Mais vous avez 2 chantiers en cours. Le temps de faire le devis, il a signé chez le concurrent.",
    stat: "Contrats perdus",
    category: "temps",
  },
  {
    icon: Mail,
    title: "22h : vous répondez encore aux mails",
    description:
      "Confirmations de RDV, relances de paiement, demandes de devis... Votre boîte mail déborde. Vos soirées y passent. Votre vie perso trinque.",
    stat: "0 déconnexion",
    category: "temps",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel le soir, Excel le week-end",
    description:
      "Encoder les heures, les matériaux, les factures. Pendant que votre famille vous attend. Votre métier c'est pas d'être comptable.",
    stat: "~8h/sem en admin",
    category: "temps",
  },
  {
    icon: BrainCircuit,
    title: "Congés, maladie, démission",
    description:
      "Votre secrétaire est en vacances ? Malade ? Elle démissionne ? Tout s'arrête. Votre business dépend d'une seule personne. C'est risqué.",
    stat: "Business à l'arrêt",
    category: "argent",
  },
];

export function Problems() {
  return (
    <section id="problemes" className="py-20 md:py-28 bg-background scroll-mt-20">
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
            Vous êtes entrepreneur,
            <br />
            <span className="text-red-500">pas secrétaire.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Que vous fassiez tout seul ou que vous ayez une secrétaire —
            le résultat est le même : vous perdez du temps, de l&apos;argent, et des clients.
          </motion.p>
        </motion.div>

        {/* Two-column stat highlight */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">+15h</div>
            <p className="text-sm text-red-600 font-medium">d&apos;admin perdu par semaine<br />si vous faites tout seul</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">30 000€</div>
            <p className="text-sm text-red-600 font-medium">par an minimum<br />si vous avez une secrétaire</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              {...hoverLift}
              className="bg-surface rounded-2xl p-6 border border-red-100 hover:border-red-200 cursor-default group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                  <problem.icon className="w-6 h-6 text-red-500" />
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    problem.category === "argent"
                      ? "text-red-600 bg-red-50"
                      : "text-orange-600 bg-orange-50"
                  }`}
                >
                  {problem.stat}
                </span>
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
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
              Résultat : vous travaillez plus, vous gagnez moins, et votre vie perso trinque.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
