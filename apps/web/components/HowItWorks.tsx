"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Phone, FileText, Settings, GraduationCap, Headphones } from "lucide-react";

const stepIcons = [Phone, FileText, Settings, GraduationCap, Headphones];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as Array<{ number: string; title: string; description: string; duration: string }>;

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
            {t("tagline")}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            {t("subtitle")}
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
            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
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
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
