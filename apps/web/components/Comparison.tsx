"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Check, X } from "lucide-react";

const comparisonData = [
  {
    feature: "Coût mensuel",
    secretary: "~2 500€ brut/mois",
    digital: "Paiement unique",
    highlight: true,
  },
  {
    feature: "Coût première année",
    secretary: "~30 000€/an minimum",
    digital: "Investissement unique",
    highlight: true,
  },
  {
    feature: "Mise en place",
    secretary: "Formation + adaptation",
    digital: "30 jours clé en main",
    highlight: false,
  },
  {
    feature: "Disponibilité",
    secretary: "8h - 17h",
    digital: "24h/24, 7j/7",
    highlight: false,
  },
  {
    feature: "Canaux",
    secretary: "Téléphone, email",
    digital: "WhatsApp, Messenger, Instagram",
    highlight: false,
  },
  {
    feature: "Congés / Maladie",
    secretary: "5 semaines + arrêts",
    digital: "Jamais",
    highlight: false,
  },
];

export function Comparison() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Comparaison
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Secrétaire classique
            <br />
            <span className="text-accent">vs Secrétaire Digitale</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="bg-surface rounded-3xl overflow-hidden shadow-xl shadow-primary/5 border border-gray-100"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-primary text-white">
            <div className="p-4 md:p-6 font-medium text-sm md:text-base">
              Critère
            </div>
            <div className="p-4 md:p-6 font-medium text-sm md:text-base text-center border-l border-white/10">
              Secrétaire
            </div>
            <div className="p-4 md:p-6 font-medium text-sm md:text-base text-center border-l border-white/10 bg-accent">
              Secrétaire Digitale
            </div>
          </div>

          {/* Rows */}
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="p-4 md:p-6 text-sm md:text-base text-primary font-medium">
                {row.feature}
              </div>
              <div className="p-4 md:p-6 text-sm md:text-base text-center text-text-muted border-l border-gray-100">
                {row.secretary}
              </div>
              <div
                className={`p-4 md:p-6 text-sm md:text-base text-center border-l border-gray-100 font-semibold ${
                  row.highlight ? "text-accent" : "text-primary"
                }`}
              >
                {row.digital}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom highlight */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-8 text-center"
        >
          <p className="text-text-muted text-lg">
            <span className="text-primary font-semibold">Économie totale</span>{" "}
            sur 5 ans :{" "}
            <span className="text-accent font-bold text-2xl">Considérable</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
