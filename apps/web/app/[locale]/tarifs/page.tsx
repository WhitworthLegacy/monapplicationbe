"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import {
  Check,
  ArrowRight,
  Server,
  Bot,
  Zap,
  MessageCircle,
  GraduationCap,
  Database,
  Shield,
  Mail,
  Wrench,
  CalendarCheck,
  FileCheck,
  Users,
  BarChart3,
  Smartphone,
  Bell,
  Clock,
  Phone,
  EuroIcon,
  Link2,
  RefreshCw,
} from "lucide-react";

// Icon and color mappings for each bloc (by index)
const blocMeta = [
  {
    icon: Server,
    color: "from-slate-600 to-slate-800",
    featureIcons: [Server, Database, Shield, RefreshCw, Wrench, Link2],
  },
  {
    icon: Bot,
    color: "from-primary to-secondary",
    featureIcons: [Users, CalendarCheck, FileCheck, EuroIcon, BarChart3, Smartphone],
  },
  {
    icon: Zap,
    color: "from-green-600 to-green-800",
    featureIcons: [Bell, Check, EuroIcon, Bot, Mail, Clock],
  },
  {
    icon: MessageCircle,
    color: "from-accent to-yellow-700",
    featureIcons: [Phone, MessageCircle, MessageCircle, Mail, Bell, Bot],
  },
  {
    icon: GraduationCap,
    color: "from-purple-600 to-purple-800",
    featureIcons: [Phone, FileCheck, Clock, GraduationCap, Wrench, Link2],
  },
];

const howStepIcons = [Phone, FileCheck, Zap];

export default function TarifsPage() {
  const t = useTranslations("Tarifs");
  const blocs = t.raw("blocs") as {
    name: string;
    tagline: string;
    description: string;
    features: { name: string; desc: string }[];
  }[];
  const howSteps = t.raw("howSteps") as {
    title: string;
    desc: string;
  }[];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-secondary">
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              {t("title")}
              <br />
              <span className="text-accent">{t("titleAccent")}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            >
              {t("subtitle")}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Shield size={16} className="text-accent" />
                {t("badgePayment")}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Clock size={16} className="text-accent" />
                {t("badgeDelivery")}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Link2 size={16} className="text-accent" />
                {t("badgeCompatible")}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                {t("heroCta")}
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blocs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              {t("blocsTitle")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted max-w-xl mx-auto">
              {t("blocsSubtitle")}
            </motion.p>
          </motion.div>

          <div className="space-y-12">
            {blocs.map((bloc, blocIndex) => {
              const meta = blocMeta[blocIndex];
              const BlocIcon = meta?.icon || Server;
              return (
                <motion.div
                  key={blocIndex}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="bg-surface rounded-3xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-100/50"
                >
                  {/* Bloc Header */}
                  <div className={`bg-gradient-to-r ${meta?.color || "from-slate-600 to-slate-800"} p-6 md:p-8`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <BlocIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          {bloc.name}
                        </h3>
                        <p className="text-white/70 text-sm">{bloc.tagline}</p>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                      {bloc.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bloc.features.map((feature, i) => {
                        const FeatureIcon = meta?.featureIcons[i] || Check;
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <FeatureIcon className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary text-sm mb-1">
                                {feature.name}
                              </h4>
                              <p className="text-text-muted text-xs leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              {t("howTitle")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted max-w-xl mx-auto">
              {t("howSubtitle")}
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {howSteps.map((step, index) => {
              const StepIcon = howStepIcons[index] || Phone;
              const isHighlighted = index === 1;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`bg-white rounded-2xl ${isHighlighted ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-100"} p-6 text-center`}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <StepIcon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-text-muted text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Infrastructure note */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6 text-center"
          >
            <p className="text-green-800 font-medium mb-1">
              {t("infraNote")}
            </p>
            <p className="text-green-700 text-sm">
              {t("infraNoteDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              {t("ctaTitle")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 mb-8 max-w-xl mx-auto"
            >
              {t("ctaSubtitle")}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                {t("ctaPrimary")}
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+32460242427"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all"
              >
                +32 460 24 24 27
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
