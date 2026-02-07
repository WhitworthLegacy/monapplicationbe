"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Check, X, AlertTriangle } from "lucide-react";

const highlightedIndices = [0, 1, 2, 9];

export function Comparison() {
  const t = useTranslations("Comparison");

  const rows = t.raw("rows") as Array<{
    feature: string;
    secretary: string;
    digital: string;
  }>;

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
            <br />
            <span className="text-primary font-semibold">{t("subtitleHighlight")}</span>
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
              {t("headerCriteria")}
            </div>
            <div className="p-4 md:p-6 font-medium text-sm md:text-base text-center border-l border-white/10">
              <span className="hidden md:inline">{t("headerHumanFull")}</span>
              <span className="md:hidden">{t("headerHumanShort")}</span>
            </div>
            <div className="p-4 md:p-6 font-medium text-sm md:text-base text-center border-l border-white/10 bg-accent">
              <span className="hidden md:inline">{t("headerDigitalFull")}</span>
              <span className="md:hidden">{t("headerDigitalShort")}</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, index) => {
            const isHighlighted = highlightedIndices.includes(index);
            return (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } ${isHighlighted ? "font-medium" : ""}`}
              >
                <div className="p-4 md:p-6 text-sm md:text-base text-primary font-medium">
                  {row.feature}
                </div>
                <div className="p-4 md:p-6 text-sm md:text-base text-center text-text-muted border-l border-gray-100">
                  <span className={isHighlighted ? "text-red-500 font-semibold" : ""}>
                    {row.secretary}
                  </span>
                </div>
                <div
                  className={`p-4 md:p-6 text-sm md:text-base text-center border-l border-gray-100 font-semibold ${
                    isHighlighted ? "text-accent" : "text-green-600"
                  }`}
                >
                  {row.digital}
                </div>
              </div>
            );
          })}
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
            <div className="text-2xl font-bold text-green-600 mb-1">{t("highlightCharges")}</div>
            <p className="text-xs text-green-700">{t("highlightChargesLabel")}</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-green-50 border border-green-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">{t("highlightErrors")}</div>
            <p className="text-xs text-green-700">{t("highlightErrorsLabel")}</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="bg-green-50 border border-green-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">{t("highlightAvailability")}</div>
            <p className="text-xs text-green-700">{t("highlightAvailabilityLabel")}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
