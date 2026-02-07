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
  Lightbulb,
  Heart,
  Target,
  Rocket,
  Award,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const valeurIcons = [Lightbulb, Heart, Target, Rocket];

export default function AboutPage() {
  const t = useTranslations("About");
  const values = t.raw("values") as {
    title: string;
    description: string;
  }[];

  return (
    <main className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
            >
              {t("tagline")}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {t("title")}
              <br />
              <span className="text-accent">{t("titleAccent")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* About Section with Photo */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Photo */}
            <motion.div variants={fadeInLeft} className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src="/fondateur.jpg"
                  alt={t("founderAlt")}
                  fill
                  className="object-cover rounded-3xl"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-xl -z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={fadeInRight}>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                {t("founderTagline")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t("founderTitle")}
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>{t("founderP1")}</p>
                <p>
                  {t("founderP2")}
                </p>
                <p>{t("founderP3")}</p>
              </div>

              <div className="flex items-center gap-2 mt-6 text-sm text-text-muted">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{t("founderLocation")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4"
            >
              {t("valuesTagline")}
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-primary mb-6"
            >
              {t("valuesTitle")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((valeur, index) => {
              const Icon = valeurIcons[index] || Lightbulb;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {valeur.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {valeur.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Award className="w-8 h-8 text-accent" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-primary mb-6"
            >
              {t("missionTitle")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-text-muted leading-relaxed mb-8"
            >
              {t("missionText")}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                {t("missionCta")}
                <Rocket className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
