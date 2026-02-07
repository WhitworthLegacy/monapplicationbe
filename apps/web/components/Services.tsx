"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  Globe,
  ShoppingCart,
  Search,
  Bot,
  Palette,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const iconMap = [Globe, Palette, ShoppingCart, Search, Bot, TrendingUp];
const colorMap = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-green-500 to-green-700",
  "from-orange-500 to-orange-700",
  "from-primary to-secondary",
  "from-red-500 to-red-700",
];

export function Services() {
  const t = useTranslations("Services");

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
    highlights: string[];
    marketPrice: string;
    marketLabel: string;
    badge?: string;
  }>;

  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-background scroll-mt-20"
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
            className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold text-sm uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
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
          {items.map((service, index) => {
            const Icon = iconMap[index];
            const color = colorMap[index];
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {service.badge && (
                  <div className="absolute top-4 right-4 z-10 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {service.badge}
                  </div>
                )}
                <div
                  className={`bg-gradient-to-r ${color} p-5 flex items-center gap-4`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-primary/5 text-primary px-3 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  {/* Prix du marche */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {service.marketLabel}
                      </span>
                      <span className="text-sm font-bold text-red-500 line-through">
                        {service.marketPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom message */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-full mb-8">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">
              {t("bottomMessage")}
            </span>
          </div>
          <div className="block">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
            >
              {t("bottomCta")}
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
