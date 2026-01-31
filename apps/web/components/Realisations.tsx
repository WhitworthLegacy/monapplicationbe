"use client";

import { useState } from "react";
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
  Mail,
  FileText,
  Clock,
  MousePointerClick,
  Send,
  Bell,
  Eye,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { DemoModal } from "./DemoModal";

const realisations = [
  {
    icon: Bike,
    name: "VeloDoctor",
    tagline: "Réparation vélo à domicile",
    description:
      "Service de réparation de vélos et trottinettes à domicile. Gestion complète des interventions, du premier contact jusqu'à la facturation.",
    benefits: [
      {
        icon: MousePointerClick,
        text: "Devis généré en 2 clics",
      },
      {
        icon: Mail,
        text: "Emails de confirmation automatiques",
      },
      {
        icon: Bell,
        text: "Rappels SMS avant chaque RDV",
      },
      {
        icon: Clock,
        text: "Plus de 10h gagnées par semaine",
      },
    ],
    color: "from-green-500 to-emerald-600",
    accentColor: "green",
  },
  {
    icon: Wind,
    name: "AirCooling",
    tagline: "Installation & maintenance climatisation",
    description:
      "Entreprise de climatisation professionnelle. Suivi des prospects, devis automatisés et planification des interventions techniques.",
    benefits: [
      {
        icon: Send,
        text: "Devis envoyé en moins de 5 minutes",
      },
      {
        icon: FileText,
        text: "Relance automatique après 3 jours",
      },
      {
        icon: Sparkles,
        text: "Pipeline commercial visuel (Kanban)",
      },
      {
        icon: Clock,
        text: "Zéro paperasse, tout est digital",
      },
    ],
    color: "from-blue-500 to-cyan-600",
    accentColor: "blue",
  },
];

export function Realisations() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof realisations[0] | null>(null);

  const openDemo = (project: typeof realisations[0]) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <>
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
              Ils l'utilisent
              <br />
              <span className="text-accent">au quotidien</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted text-lg max-w-2xl mx-auto"
            >
              Découvrez comment ces entreprises ont simplifié leur gestion
              et gagné un temps précieux chaque semaine.
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
                <div className={`bg-gradient-to-r ${projet.color} p-6 md:p-8`}>
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
                  {/* Benefits - Ce qui change vraiment */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Ce qui a changé pour eux
                    </h4>
                    <ul className="space-y-3">
                      {projet.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            projet.accentColor === "green" ? "bg-green-100" : "bg-blue-100"
                          }`}>
                            <benefit.icon className={`w-4 h-4 ${
                              projet.accentColor === "green" ? "text-green-600" : "text-blue-600"
                            }`} />
                          </div>
                          <span className="text-text-muted text-sm">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => openDemo(projet)}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      projet.accentColor === "green"
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Voir l'interface en détail
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Votre activité aussi</span> mérite d'être simplifiée.
              </p>
              <p className="text-text-muted text-sm mb-6">
                Plombier, électricien, coach, thérapeute... On s'adapte à votre métier.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Discutons de votre projet
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      {selectedProject && (
        <DemoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          projectName={selectedProject.name}
          projectColor={selectedProject.color}
        />
      )}
    </>
  );
}
