"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Phone, FileText, Settings, GraduationCap, Headphones } from "lucide-react";

const steps = [
  {
    icon: Phone,
    number: "01",
    title: "Appel découverte",
    description: "15 minutes pour comprendre votre métier et vos besoins",
    duration: "15 min",
  },
  {
    icon: FileText,
    number: "02",
    title: "Proposition sur-mesure",
    description: "On choisit ensemble les modules adaptés à votre activité",
    duration: "2-3 jours",
  },
  {
    icon: Settings,
    number: "03",
    title: "Mise en place",
    description: "On configure tout pour vous. Vous n'avez rien à faire",
    duration: "30 jours",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Formation",
    description: "On vous montre comment utiliser votre nouveau système",
    duration: "2 heures",
  },
  {
    icon: Headphones,
    number: "05",
    title: "Support continu",
    description: "On reste disponible si vous avez des questions",
    duration: "3 mois inclus",
  },
];

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-secondary scroll-mt-20"
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
            Le processus
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Comment ça marche ?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            De l'appel découverte à la mise en production, on s'occupe de tout.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative"
        >
          {/* Timeline line - hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 transform -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                  }`}
                >
                  <div
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 ${
                      index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                    } lg:max-w-md`}
                  >
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0
                          ? "lg:flex-row-reverse lg:justify-start"
                          : ""
                      }`}
                    >
                      <span className="text-accent font-bold text-sm">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    <span className="inline-block bg-accent/20 text-accent text-sm font-medium px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                </div>

                {/* Icon Circle */}
                <div className="relative z-10 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30 shrink-0">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
