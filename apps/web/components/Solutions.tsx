"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  CalendarCheck,
  FileCheck,
  Users,
  MessageCircle,
  Bot,
  BarChart3,
  Bell,
  Smartphone,
  EuroIcon,
} from "lucide-react";

const icons = [Bot, FileCheck, CalendarCheck, Users, MessageCircle, EuroIcon, Bell, BarChart3, Smartphone];

export function Solutions() {
  const t = useTranslations("Solutions");

  const items = t.raw("items") as Array<{
    title: string;
    before: string;
    after: string;
    result: string;
  }>;

  return (
    <section
      id="fonctionnalites"
      className="py-20 md:py-28 bg-surface scroll-mt-20"
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
            className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-4"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((solution, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {solution.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Before */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">{t("beforeLabel")}</span>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {solution.before}
                    </p>
                  </div>

                  {/* After */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{t("afterLabel")}</span>
                    </div>
                    <p className="text-primary text-sm leading-relaxed font-medium">
                      {solution.after}
                    </p>
                  </div>

                  {/* Result badge */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {solution.result}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
