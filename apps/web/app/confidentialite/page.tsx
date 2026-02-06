"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function ConfidentialitePage() {
  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Politique de confidentialité
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              Comment nous protégeons vos données personnelles
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                1. Responsable du traitement
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>Le responsable du traitement des données personnelles est :</p>
                <ul className="list-none space-y-1 mt-4">
                  <li><strong className="text-primary">AJ SRL</strong></li>
                  <li>Rue des Colonies 11, 1000 Bruxelles, Belgique</li>
                  <li>TVA : BE0748911660</li>
                  <li>
                    Email :{" "}
                    <a
                      href="mailto:contact@monapplication.be"
                      className="text-accent hover:underline"
                    >
                      contact@monapplication.be
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                2. Données collectées
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Nous collectons uniquement les données nécessaires au bon
                  fonctionnement de nos services :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">Formulaire de contact :</strong>{" "}
                    nom, prénom, adresse email, numéro de téléphone, message
                  </li>
                  <li>
                    <strong className="text-primary">Demande de devis :</strong>{" "}
                    nom, prénom, nom de l'entreprise, adresse email, numéro de
                    téléphone, description du projet
                  </li>
                  <li>
                    <strong className="text-primary">Navigation :</strong>{" "}
                    données de navigation anonymisées (pages visitées, durée de
                    visite) via des cookies analytiques
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                3. Finalité du traitement
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>Vos données personnelles sont utilisées pour :</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Vous fournir les services demandés</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
                <p>
                  Nous ne vendons, ne louons ni ne partageons vos données
                  personnelles avec des tiers à des fins commerciales.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                4. Base légale du traitement
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Le traitement de vos données repose sur les bases légales
                  suivantes (conformément au RGPD) :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">Consentement :</strong>{" "}
                    lorsque vous remplissez un formulaire de contact
                  </li>
                  <li>
                    <strong className="text-primary">Exécution d'un contrat :</strong>{" "}
                    pour la fourniture de nos services
                  </li>
                  <li>
                    <strong className="text-primary">Intérêt légitime :</strong>{" "}
                    pour l'amélioration de notre site et de nos services
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                5. Durée de conservation
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Vos données personnelles sont conservées pendant la durée
                  nécessaire aux finalités pour lesquelles elles ont été
                  collectées :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">Données de contact :</strong>{" "}
                    3 ans à compter du dernier contact
                  </li>
                  <li>
                    <strong className="text-primary">Données contractuelles :</strong>{" "}
                    10 ans (obligation légale belge)
                  </li>
                  <li>
                    <strong className="text-primary">Cookies analytiques :</strong>{" "}
                    13 mois maximum
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                6. Vos droits
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Conformément au Règlement Général sur la Protection des
                  Données (RGPD), vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">Droit d'accès :</strong>{" "}
                    obtenir la confirmation que vos données sont traitées et en
                    recevoir une copie
                  </li>
                  <li>
                    <strong className="text-primary">Droit de rectification :</strong>{" "}
                    corriger vos données inexactes ou incomplètes
                  </li>
                  <li>
                    <strong className="text-primary">Droit à l'effacement :</strong>{" "}
                    demander la suppression de vos données
                  </li>
                  <li>
                    <strong className="text-primary">Droit à la limitation :</strong>{" "}
                    restreindre le traitement de vos données
                  </li>
                  <li>
                    <strong className="text-primary">Droit à la portabilité :</strong>{" "}
                    recevoir vos données dans un format structuré
                  </li>
                  <li>
                    <strong className="text-primary">Droit d'opposition :</strong>{" "}
                    vous opposer au traitement de vos données
                  </li>
                </ul>
                <p>
                  Pour exercer ces droits, contactez-nous à{" "}
                  <a
                    href="mailto:contact@monapplication.be"
                    className="text-accent hover:underline"
                  >
                    contact@monapplication.be
                  </a>
                  . Nous répondrons dans un délai de 30 jours.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                7. Cookies
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Notre site utilise des cookies essentiels au fonctionnement du
                  site et des cookies analytiques pour mesurer l'audience.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">Cookies essentiels :</strong>{" "}
                    nécessaires au fonctionnement du site (session, préférences)
                  </li>
                  <li>
                    <strong className="text-primary">Cookies analytiques :</strong>{" "}
                    mesure d'audience anonymisée pour améliorer nos services
                  </li>
                </ul>
                <p>
                  Vous pouvez à tout moment modifier vos préférences de cookies
                  via les paramètres de votre navigateur.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                8. Sécurité
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Nous mettons en œuvre des mesures techniques et
                  organisationnelles appropriées pour protéger vos données
                  personnelles contre tout accès non autorisé, toute
                  modification, divulgation ou destruction :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>Hébergement sécurisé avec sauvegardes automatiques</li>
                  <li>Accès restreint aux données personnelles</li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                9. Autorité de contrôle
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Si vous estimez que le traitement de vos données personnelles
                  constitue une violation du RGPD, vous avez le droit
                  d'introduire une réclamation auprès de :
                </p>
                <ul className="list-none space-y-1 mt-4">
                  <li>
                    <strong className="text-primary">
                      Autorité de protection des données (APD)
                    </strong>
                  </li>
                  <li>Rue de la Presse 35, 1000 Bruxelles</li>
                  <li>
                    Site web :{" "}
                    <a
                      href="https://www.autoriteprotectiondonnees.be"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      www.autoriteprotectiondonnees.be
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                10. Modification de la politique
              </h2>
              <div className="text-text-muted leading-relaxed">
                <p>
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité à tout moment. Toute modification sera publiée
                  sur cette page. Nous vous encourageons à la consulter
                  régulièrement.
                </p>
                <p className="mt-4 text-sm">
                  Dernière mise à jour : février 2026
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
