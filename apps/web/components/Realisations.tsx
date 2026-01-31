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
  Bike,
  Wind,
  CheckCircle,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const realisations = [
  {
    icon: Bike,
    name: "VeloDoctor",
    tagline: "Réparation vélo à domicile",
    description:
      "Plateforme complète pour un service de réparation de vélos à domicile. Système de réservation en ligne, gestion des interventions et suivi client.",
    features: [
      "Réservation en ligne 24h/24",
      "Gestion des techniciens",
      "Suivi des interventions",
      "Facturation automatisée",
    ],
    results: {
      clients: "+120",
      rdv: "500+/mois",
      satisfaction: "98%",
    },
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    icon: Wind,
    name: "AirCooling",
    tagline: "Installation & maintenance climatisation",
    description:
      "Solution digitale pour une entreprise de climatisation. Gestion des devis, planification des installations et suivi de maintenance.",
    features: [
      "Devis automatisés",
      "Planning techniciens",
      "Rappels maintenance",
      "CRM clients intégré",
    ],
    results: {
      clients: "+85",
      rdv: "200+/mois",
      satisfaction: "97%",
    },
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
];

export function Realisations() {
  return (
    <section id="realisations" className="py-20 md:py-28 bg-background scroll-mt-20">
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
            Nos réalisations
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Des projets qui
            <br />
            <span className="text-accent">font la différence</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Découvrez comment nous avons aidé ces entreprises à automatiser leur
            gestion et à se concentrer sur leur métier.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {realisations.map((projet, index) => (
            <motion.div
              key={projet.name}
              variants={index === 0 ? fadeInLeft : fadeInRight}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Header gradient */}
              <div
                className={`bg-gradient-to-r ${projet.color} p-6 md:p-8`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <projet.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {projet.name}
                    </h3>
                    <p className="text-white/80 text-sm">{projet.tagline}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {projet.description}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                    Fonctionnalités livrées
                  </h4>
                  <ul className="space-y-2">
                    {projet.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-text-muted text-sm">
                        <CheckCircle className={`w-4 h-4 ${projet.textColor}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className={`${projet.bgColor} rounded-2xl p-4`}>
                  <h4 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                    Résultats
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className={`w-4 h-4 ${projet.textColor}`} />
                      </div>
                      <p className={`text-xl font-bold ${projet.textColor}`}>
                        {projet.results.clients}
                      </p>
                      <p className="text-xs text-text-muted">Clients</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className={`w-4 h-4 ${projet.textColor}`} />
                      </div>
                      <p className={`text-xl font-bold ${projet.textColor}`}>
                        {projet.results.rdv}
                      </p>
                      <p className="text-xs text-text-muted">RDV gérés</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className={`w-4 h-4 ${projet.textColor}`} />
                      </div>
                      <p className={`text-xl font-bold ${projet.textColor}`}>
                        {projet.results.satisfaction}
                      </p>
                      <p className="text-xs text-text-muted">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mt-12"
        >
          <p className="text-text-muted mb-4">
            Votre projet pourrait être le prochain sur cette liste.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            Discutons de votre projet
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
