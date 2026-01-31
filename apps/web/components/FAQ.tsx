"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "C'est quoi exactement une secrétaire digitale ?",
    answer:
      "C'est un système automatisé qui gère vos tâches admin : réponse aux messages (WhatsApp, Messenger, Instagram), prise de RDV, envoi de devis, suivi clients... avec des réponses automatisées disponibles 24h/24. Le système ne prend jamais de congés.",
  },
  {
    question: "Combien de temps pour mettre en place ?",
    answer:
      "30 jours entre notre premier appel et la mise en ligne de votre système. On s'occupe de tout : configuration, personnalisation à vos couleurs, import de vos données existantes si besoin.",
  },
  {
    question: "Comment fonctionne l'automatisation des réponses ?",
    answer:
      "Le système répond automatiquement sur WhatsApp, Messenger et Instagram. Il est configuré selon votre métier et vos services. Les réponses sont personnalisées et disponibles 24h/24.",
  },
  {
    question: "C'est compliqué à utiliser ?",
    answer:
      "Pas du tout. L'interface est conçue pour être simple et intuitive. Si vous savez utiliser un smartphone, vous saurez utiliser votre secrétaire digitale. Et on vous forme pendant 2 heures pour vous montrer toutes les fonctionnalités.",
  },
  {
    question: "Ça marche pour mon métier ?",
    answer:
      "Si vous encodez des lignes dans Excel, répondez au téléphone, envoyez des emails et faites des devis — ce système est fait pour vous. Peu importe votre secteur : BTP, maçonnerie, plomberie, électricité, HVAC, chauffagiste, menuiserie, carrelage, peinture, toiture, transport, déménagement, nettoyage, jardinage, rénovation... Tous les artisans et entrepreneurs de service gagnent du temps avec notre secrétaire digitale.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer:
      "Non. Les prix affichés sont tout compris. Les seuls frais récurrents sont les coûts d'hébergement (~20-50€/mois) que vous payez directement aux fournisseurs, pas à nous. Pas d'abonnement vers monapplication.be.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Questions fréquentes
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-text-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
