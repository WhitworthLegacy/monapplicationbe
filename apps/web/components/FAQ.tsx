"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "C'est quoi exactement une secrétaire digitale ?",
    answer:
      "C'est un système propulsé par l'IA qui remplace toutes les tâches admin répétitives : réponse automatique aux messages (WhatsApp, Messenger, Instagram), prise de RDV en ligne 24h/24, envoi de devis en 2 clics, relances automatiques, suivi clients, rappels... Bref, tout ce que fait une secrétaire — sans salaire, sans congés, sans erreurs d'oubli.",
  },
  {
    question: "En quoi c'est mieux qu'une secrétaire classique ?",
    answer:
      "Une secrétaire coûte ~2 500€/mois brut + charges sociales, soit plus de 30 000€/an. Elle travaille 8h/jour, prend des congés, peut tomber malade ou démissionner. Et l'erreur est humaine : oublis de rappels, devis envoyés en retard, RDV mal notés... Notre système travaille 24h/24, ne fait jamais d'erreur, et coûte un investissement unique.",
  },
  {
    question: "Je fais tout seul, je n'ai pas de secrétaire. C'est pour moi ?",
    answer:
      "Surtout pour vous. Si vous perdez vos soirées à répondre aux mails, encoder des factures sur Excel et faire des devis au lieu de développer vos affaires — c'est exactement ce qu'on résout. On vous libère +15h/semaine d'admin pour que vous vous concentriez sur votre métier.",
  },
  {
    question: "Combien de temps pour la mise en place ?",
    answer:
      "1ère version opérationnelle en 30 jours : votre secrétaire digitale fonctionne, vous gagnez déjà du temps. Version finale livrée en 60 jours : système complet, optimisé, avec formation incluse pour que vous soyez 100% autonome.",
  },
  {
    question: "Ça marche pour mon métier ?",
    answer:
      "Si vous êtes entrepreneur, artisan ou prestataire de services et que vous perdez du temps en admin — c'est fait pour vous. Plombier, chauffagiste, électricien, mécanicien, menuisier, nettoyage, bien-être, restauration... On s'adapte à votre réalité terrain.",
  },
  {
    question: "C'est compliqué à utiliser ?",
    answer:
      "Pas du tout. Tout est conçu pour être utilisable depuis votre smartphone, entre deux chantiers. Si vous savez envoyer un WhatsApp, vous saurez tout gérer. Et on vous forme pour que vous soyez à l'aise dès le premier jour.",
  },
  {
    question: "Et le site web, e-commerce, SEO — c'est inclus ?",
    answer:
      "C'est du bonus. Le coeur de notre offre, c'est votre secrétaire digitale et l'automatisation. Mais on va plus loin : site web professionnel, boutique en ligne, référencement Google avec des articles générés par IA (1/jour). Un seul interlocuteur pour tout.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer:
      "Non. Le devis est clair et tout compris. On gère votre base de données et l'hébergement pour 50€/mois — et la 1ère année est gratuite. Pas de surprise, pas de petites lignes.",
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
