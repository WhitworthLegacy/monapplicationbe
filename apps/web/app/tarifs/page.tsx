"use client";

import Link from "next/link";
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

const blocs = [
  {
    id: "fondations",
    name: "Fondations Techniques",
    icon: Server,
    color: "from-slate-600 to-slate-800",
    tagline: "On pose les bases. Vous ne touchez à rien.",
    description:
      "L'infrastructure de votre application admin : hébergement, base de données, sécurité, sauvegardes. On gère tout le technique pour que vous n'ayez jamais à y penser.",
    features: [
      {
        icon: Server,
        name: "Hébergement dédié",
        desc: "Votre application tourne sur un serveur rapide et fiable. Toujours en ligne, toujours accessible.",
      },
      {
        icon: Database,
        name: "Base de données sécurisée",
        desc: "Toutes vos données (clients, devis, RDV) stockées et sauvegardées automatiquement chaque jour.",
      },
      {
        icon: Shield,
        name: "Sécurité & SSL",
        desc: "Connexion chiffrée, accès protégé par mot de passe. Vos données et celles de vos clients sont en sécurité.",
      },
      {
        icon: RefreshCw,
        name: "Sauvegardes automatiques",
        desc: "Backup quotidien de toutes vos données. En cas de problème, on restaure tout en quelques minutes.",
      },
      {
        icon: Wrench,
        name: "Maintenance & mises à jour",
        desc: "On garde votre application à jour et fonctionnelle. Aucune intervention de votre part.",
      },
      {
        icon: Link2,
        name: "Connexion à vos outils existants",
        desc: "Votre site web, votre agenda Google, vos outils actuels — on raccorde tout ensemble.",
      },
    ],
  },
  {
    id: "secretaire",
    name: "Application Admin",
    icon: Bot,
    color: "from-primary to-secondary",
    tagline: "Votre secrétaire digitale. Le coeur du système.",
    description:
      "Une application sur mesure pour gérer toute votre activité : clients, RDV, devis, factures. Accessible depuis votre téléphone, entre deux chantiers. Fini Excel, fini les papiers.",
    features: [
      {
        icon: Users,
        name: "CRM Clients",
        desc: "Fiche pour chaque client : coordonnées, historique, devis, paiements. Tout centralisé en 1 clic.",
      },
      {
        icon: CalendarCheck,
        name: "Agenda & Booking 24h/24",
        desc: "Vos clients réservent eux-mêmes, même à 23h. Synchronisé avec votre agenda existant.",
      },
      {
        icon: FileCheck,
        name: "Générateur de devis",
        desc: "Créez un devis en 2 clics depuis votre téléphone. Templates prêts, calcul automatique.",
      },
      {
        icon: EuroIcon,
        name: "Factures automatiques",
        desc: "Générées à partir des devis validés. Envoyées automatiquement au client.",
      },
      {
        icon: BarChart3,
        name: "Tableau de bord",
        desc: "Vue d'ensemble en temps réel : RDV du jour, devis en attente, chiffre d'affaires, clients actifs.",
      },
      {
        icon: Smartphone,
        name: "100% mobile",
        desc: "Interface pensée pour le terrain. Gérez tout depuis votre smartphone, pas besoin d'un PC.",
      },
    ],
  },
  {
    id: "automatisation",
    name: "Automatisation & IA",
    icon: Zap,
    color: "from-green-600 to-green-800",
    tagline: "Zéro oubli. Zéro tâche répétitive. Zéro erreur.",
    description:
      "Le système fait le travail à votre place : rappels, confirmations, relances, réponses automatiques. Vous n'avez plus rien à penser — tout se déclenche au bon moment.",
    features: [
      {
        icon: Bell,
        name: "Rappels automatiques",
        desc: "WhatsApp, SMS ou email envoyés 24h et 1h avant chaque RDV. Résultat : -80% de no-shows.",
      },
      {
        icon: Check,
        name: "Confirmations automatiques",
        desc: "RDV confirmé ? Le client reçoit un message instantanément. Zéro effort de votre part.",
      },
      {
        icon: EuroIcon,
        name: "Relances de paiement",
        desc: "Facture impayée ? Le système relance poliment à 7, 14 et 30 jours. Sans que vous y pensiez.",
      },
      {
        icon: Bot,
        name: "Réponses IA",
        desc: "Un prospect vous contacte à 22h ? L'IA répond immédiatement, de façon personnalisée.",
      },
      {
        icon: Mail,
        name: "Emails automatiques",
        desc: "Bienvenue, merci, suivi, rappel... Tout part tout seul au bon moment.",
      },
      {
        icon: Clock,
        name: "Workflows intelligents",
        desc: "Enchaînements automatiques : nouveau client → bienvenue → rappel RDV → suivi post-prestation.",
      },
    ],
  },
  {
    id: "communication",
    name: "Communication Multi-Canal",
    icon: MessageCircle,
    color: "from-accent to-yellow-700",
    tagline: "Soyez partout, sans y être.",
    description:
      "Vos clients vous contactent par WhatsApp, Messenger, Instagram, email... Le système centralise tout au même endroit et peut répondre automatiquement.",
    features: [
      {
        icon: Phone,
        name: "WhatsApp Business",
        desc: "Le système répond sur WhatsApp, prend les RDV et envoie les rappels. Automatiquement.",
      },
      {
        icon: MessageCircle,
        name: "Messenger",
        desc: "Facebook Messenger intégré. Réponses instantanées 24h/24 sans intervention.",
      },
      {
        icon: MessageCircle,
        name: "Instagram DM",
        desc: "Vos messages Instagram sont gérés automatiquement. Aucun message ignoré.",
      },
      {
        icon: Mail,
        name: "Inbox centralisée",
        desc: "Tous vos messages — peu importe le canal — au même endroit dans votre application admin.",
      },
      {
        icon: Bell,
        name: "Alertes intelligentes",
        desc: "Notification sur votre téléphone uniquement quand c'est vraiment important.",
      },
      {
        icon: Bot,
        name: "Réponses personnalisées",
        desc: "L'IA apprend votre métier et répond comme vous le feriez. Professionnel et naturel.",
      },
    ],
  },
  {
    id: "accompagnement",
    name: "Accompagnement",
    icon: GraduationCap,
    color: "from-purple-600 to-purple-800",
    tagline: "On ne vous lâche pas.",
    description:
      "De l'appel découverte à la mise en production, on est là. Formation, support, évolutions — vous n'êtes jamais seul face au système.",
    features: [
      {
        icon: Phone,
        name: "Appel découverte",
        desc: "15 minutes pour comprendre votre métier, vos outils actuels et vos besoins. Gratuit.",
      },
      {
        icon: FileCheck,
        name: "Devis sur mesure",
        desc: "Proposition claire et adaptée. Pas de package imposé, pas de surprise.",
      },
      {
        icon: Clock,
        name: "1ère version en 30 jours",
        desc: "Votre application admin est opérationnelle. Vous commencez à gagner du temps immédiatement.",
      },
      {
        icon: GraduationCap,
        name: "Version finale en 60 jours",
        desc: "Système complet + formation incluse. Vous êtes 100% autonome.",
      },
      {
        icon: Wrench,
        name: "Support continu",
        desc: "Questions, ajustements, nouvelles fonctionnalités — on reste disponible.",
      },
      {
        icon: Link2,
        name: "Évolutions sur demande",
        desc: "Votre business évolue ? On adapte votre application. Un seul interlocuteur.",
      },
    ],
  },
];

export default function TarifsPage() {
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
              Spécialistes en automatisation
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Tout ce qu&apos;on fait pour vous.
              <br />
              <span className="text-accent">Bloc par bloc.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            >
              On crée votre application admin sur mesure et on la raccorde
              à vos outils existants. Chaque bloc est un ensemble de services concrets.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Shield size={16} className="text-accent" />
                Paiement unique
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Clock size={16} className="text-accent" />
                1ère version en 30 jours
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80">
                <Link2 size={16} className="text-accent" />
                Compatible avec vos outils
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                Demander un devis gratuit
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
              5 blocs. Votre système complet.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted max-w-xl mx-auto">
              De l&apos;infrastructure à l&apos;accompagnement — on construit votre
              application admin et on automatise votre quotidien.
            </motion.p>
          </motion.div>

          <div className="space-y-12">
            {blocs.map((bloc) => (
              <motion.div
                key={bloc.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="bg-surface rounded-3xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-100/50"
              >
                {/* Bloc Header */}
                <div className={`bg-gradient-to-r ${bloc.color} p-6 md:p-8`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <bloc.icon className="w-6 h-6 text-white" />
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
                    {bloc.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <feature.icon className="w-4 h-4 text-accent" />
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
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
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
              Comment ça se passe ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-muted max-w-xl mx-auto">
              On construit votre solution sur mesure. Pas de formule imposée.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-primary mb-2">1. Appel découverte</h3>
              <p className="text-text-muted text-sm">
                15 min pour comprendre votre métier et vos outils actuels. On identifie ce dont vous avez besoin.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border-2 border-accent p-6 text-center shadow-lg shadow-accent/10"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-primary mb-2">2. Devis sur mesure</h3>
              <p className="text-text-muted text-sm">
                Paiement unique. Pas d&apos;abonnement. Vous savez exactement ce que vous payez et recevez.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-primary mb-2">3. On construit</h3>
              <p className="text-text-muted text-sm">
                1ère version en 30 jours. Version finale en 60 jours. Formation incluse.
              </p>
            </motion.div>
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
              Infrastructure : 50€/mois — 1ère année offerte
            </p>
            <p className="text-green-700 text-sm">
              On gère l&apos;hébergement, la base de données, la sécurité et les mises à jour.
              Vous n&apos;avez rien à gérer côté technique.
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
              Prêt à automatiser votre admin ?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 mb-8 max-w-xl mx-auto"
            >
              Appelez-nous ou demandez un devis gratuit. On vous rappelle sous
              24h.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                Demander un devis gratuit
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
