"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  MessageCircle,
  Eye,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Bell,
  Zap,
} from "lucide-react";
import { DemoModal } from "./DemoModal";

const veloBenefitIcons = [MousePointerClick, Mail, MessageCircle, Clock];
const airBenefitIcons = [Zap, Bell, Send, Sparkles];

const projectConfigs = [
  {
    key: "velodoctor" as const,
    icon: Bike,
    name: "VeloDoctor",
    benefitIcons: veloBenefitIcons,
    color: "from-green-500 to-emerald-600",
    accentColor: "green",
  },
  {
    key: "aircooling" as const,
    icon: Wind,
    name: "AirCooling",
    benefitIcons: airBenefitIcons,
    color: "from-blue-500 to-cyan-600",
    accentColor: "blue",
  },
];

export function Realisations() {
  const t = useTranslations("Realisations");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projectConfigs[0] | null>(null);

  const openDemo = (project: typeof projectConfigs[0]) => {
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
              {t("tagline")}
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
            >
              {t("title")}
              <br />
              <span className="text-accent">{t("titleAccent")}</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted text-lg max-w-2xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {projectConfigs.map((projet, index) => {
              const benefits = t.raw(`${projet.key}.benefits`) as string[];
              return (
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
                        <p className="text-white/80 text-sm">{t(`${projet.key}.tagline`)}</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {t(`${projet.key}.description`)}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {/* Benefits - Ce qui change vraiment */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {t("changedTitle")}
                      </h4>
                      <ul className="space-y-3">
                        {benefits.map((benefitText, i) => {
                          const BenefitIcon = projet.benefitIcons[i];
                          return (
                            <li key={i} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                projet.accentColor === "green" ? "bg-green-100" : "bg-blue-100"
                              }`}>
                                <BenefitIcon className={`w-4 h-4 ${
                                  projet.accentColor === "green" ? "text-green-600" : "text-blue-600"
                                }`} />
                              </div>
                              <span className="text-text-muted text-sm">{benefitText}</span>
                            </li>
                          );
                        })}
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
                      {t("viewDetail")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
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
                <span className="font-semibold">{t("bottomBold")}</span> {t("bottomText")}
              </p>
              <p className="text-text-muted text-sm mb-6">
                {t("bottomSubtitle")}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                {t("bottomCta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
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
