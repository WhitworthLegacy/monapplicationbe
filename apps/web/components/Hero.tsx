"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { ArrowRight, Clock, Zap, Shield, Globe, ShoppingCart } from "lucide-react";

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
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              <Zap size={16} className="text-accent" />
              Site web, E-commerce, SEO &amp; Automatisation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Votre secrétaire digitale.
            <br />
            <span className="text-accent">Disponible 24h/24.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Une secrétaire coûte{" "}
            <span className="text-white font-semibold">2 500€/mois</span> pour des tâches répétitives.
            Notre système fait le même travail{" "}
            <span className="text-accent font-semibold">24h/24, sans congés</span>.{" "}
            Booking, devis, CRM, notifications — plus site web, e-commerce &amp; SEO.{" "}
            <span className="text-white font-semibold">Opérationnel en 30 jours.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="#fonctionnalites"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105"
            >
              Découvrir comment
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            >
              Demander un devis gratuit
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 md:gap-12"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Globe size={20} className="text-accent" />
              <span className="text-sm">Sites web &amp; E-commerce</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield size={20} className="text-accent" />
              <span className="text-sm">SEO &amp; Référencement</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap size={20} className="text-accent" />
              <span className="text-sm">Automatisation complète</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={20} className="text-accent" />
              <span className="text-sm">Opérationnel en 30 jours</span>
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
