"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Check, X, AlertTriangle } from "lucide-react";

const comparisonData = [
  {
    feature: "Coût mensuel",
    secretary: "~2 500€ brut/mois",
    digital: "Paiement unique",
    highlight: true,
  },
  {
    feature: "Coût 1ère année",
    secretary: "~30 000€ minimum",
    digital: "Investissement unique",
    highlight: true,
  },
  {
    feature: "Erreurs humaines",
    secretary: "Oublis, retards, fautes",
    digital: "Zéro oubli, zéro erreur",
    highlight: true,
  },
  {
    feature: "Disponibilité",
    secretary: "8h - 17h",
    digital: "24h/24, 7j/7",
    highlight: false,
  },
  {
    feature: "Congés / Maladie",
    secretary: "5 semaines + arrêts",
    digital: "Jamais absente",
    highlight: false,
  },
  {
    feature: "Risque de démission",
    secretary: "À tout moment",
    digital: "Aucun risque",
    highlight: false,
  },
  {
    feature: "Canaux gérés",
    secretary: "Téléphone, email",
    digital: "WhatsApp, Messenger, Instagram, email",
    highlight: false,
  },
  {
    feature: "Rapidité de réponse",
    secretary: "Variable selon la charge",
    digital: "Instantanée, 30 secondes",
    highlight: false,
  },
  {
    feature: "Mise en place",
    secretary: "Recrutement + formation",
    digital: "1ère version en 30 jours",
    highlight: false,
  },
  {
    feature: "Charges sociales",
    secretary: "~35% en plus du brut",
    digital: "Aucune",
    highlight: true,
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
            Le vrai calcul
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Secrétaire classique
            <br />
            <span className="text-accent">vs Secrétaire Digitale</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Un salaire + charges sociales + congés + erreurs humaines + risque de départ...
            <br />
            <span className="text-primary font-semibold">Faites le calcul.</span>
          </motion.p>
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
              <span className="hidden md:inline">Secrétaire humaine</span>
              <span className="md:hidden">Humaine</span>
            </div>
            <div className="p-4 md:p-6 font-medium text-sm md:text-base text-center border-l border-white/10 bg-accent">
              <span className="hidden md:inline">Secrétaire Digitale IA</span>
              <span className="md:hidden">Digitale IA</span>
            </div>
          </div>

          {/* Rows */}
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${row.highlight ? "font-medium" : ""}`}
            >
              <div className="p-4 md:p-6 text-sm md:text-base text-primary font-medium">
                {row.feature}
              </div>
              <div className="p-4 md:p-6 text-sm md:text-base text-center text-text-muted border-l border-gray-100">
                <span className={row.highlight ? "text-red-500 font-semibold" : ""}>
                  {row.secretary}
                </span>
              </div>
              <div
                className={`p-4 md:p-6 text-sm md:text-base text-center border-l border-gray-100 font-semibold ${
                  row.highlight ? "text-accent" : "text-green-600"
                }`}
              >
                {row.digital}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom highlight */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-green-50 border border-green-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">0€</div>
            <p className="text-xs text-green-700">de charges sociales</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-green-50 border border-green-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">0</div>
            <p className="text-xs text-green-700">erreur d&apos;oubli</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-green-50 border border-green-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
            <p className="text-xs text-green-700">sans jamais s&apos;arrêter</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
