"use client";

import { useTranslations } from "next-intl";
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

const icons = [Clock, PhoneMissed, Wallet, UserX, FileText, Mail, FileSpreadsheet, BrainCircuit];

export function Problems() {
  const t = useTranslations("Problems");

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    stat: string;
    category: string;
  }>;

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
            {t("tagline")}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {t("title")}
            <br />
            <span className="text-red-500">{t("titleAccent")}</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            {t("subtitle")}
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
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">{t("statHours")}</div>
            <p className="text-sm text-red-600 font-medium">{t("statHoursDesc")}</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">{t("statMoney")}</div>
            <p className="text-sm text-red-600 font-medium">{t("statMoneyDesc")}</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {items.map((problem, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                {...hoverLift}
                className="bg-surface rounded-2xl p-6 border border-red-100 hover:border-red-200 cursor-default group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-red-500" />
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
            );
          })}
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
              {t("callout")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
