"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  ArrowRight,
  Clock,
  Zap,
  BrainCircuit,
  EuroIcon,
  AlertTriangle,
  Bot,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-red-200 px-4 py-2 rounded-full text-sm font-medium border border-red-400/20">
              <AlertTriangle size={16} className="text-red-400" />
              Plombier, chauffagiste, mécanicien, artisan... Vous n&apos;êtes pas secrétaire.
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Vous faites plus d&apos;admin
            <br />
            <span className="text-accent">que de business.</span>
          </motion.h1>

          {/* Sub-headline - the problem */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed"
          >
            Appels manqués, devis en retard, Excel le soir, mails à 22h, oublis de rappels...
            <br />
            <span className="text-white font-medium">Cassons ce cycle.</span>
          </motion.p>

          {/* Pain points - quick hits */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {[
              "Appels manqués",
              "Devis en retard",
              "Excel le soir",
              "Oublis de rappels",
              "Mails à 22h",
              "Secrétaire trop chère",
            ].map((pain) => (
              <span
                key={pain}
                className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 px-3 py-1.5 rounded-full text-sm"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                {pain}
              </span>
            ))}
          </motion.div>

          {/* The solution */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed"
          >
            Votre <span className="text-accent font-semibold">secrétaire digitale propulsée par l&apos;IA</span> gère
            vos appels, devis, rendez-vous, relances et toute votre admin —{" "}
            <span className="text-white font-semibold">24h/24, sans congés, sans erreurs.</span>
          </motion.p>

          {/* Value props - time & money */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10 max-w-3xl mx-auto"
          >
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-accent" />
                <span className="text-white font-semibold text-sm">Vous faites tout seul ?</span>
              </div>
              <p className="text-gray-400 text-sm">
                Gagnez <span className="text-white font-medium">+15h/semaine</span>. Fini l&apos;admin le soir.
                L&apos;automatisation travaille pendant que vous dormez.
              </p>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <EuroIcon size={18} className="text-accent" />
                <span className="text-white font-semibold text-sm">Vous avez une secrétaire ?</span>
              </div>
              <p className="text-gray-400 text-sm">
                Économisez <span className="text-white font-medium">2 500€/mois</span>. Plus de salaire,
                plus de congés, plus d&apos;erreurs humaines.
              </p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="#problemes"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
            >
              Voir ce qu&apos;on résout
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            >
              Demander un devis gratuit
            </Link>
          </motion.div>

          {/* Trust Indicators - automation/IA focused */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 md:gap-12"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Bot size={20} className="text-accent" />
              <span className="text-sm">Secrétaire Digitale IA</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap size={20} className="text-accent" />
              <span className="text-sm">Automatisation complète</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <BrainCircuit size={20} className="text-accent" />
              <span className="text-sm">Intelligence Artificielle</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={20} className="text-accent" />
              <span className="text-sm">1ère version en 30 jours</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 35.8C384 39 480 54 576 57.2C672 60.3 768 51.7 864 48.5C960 45.3 1056 47.7 1152 51.8C1248 56 1344 62 1392 65L1440 68V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="#f1f5f9"
          />
        </svg>
      </div>
    </section>
  );
}
