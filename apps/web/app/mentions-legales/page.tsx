"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function MentionsLegalesPage() {
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
              Mentions légales
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              Informations légales relatives au site monapplication.be
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
                1. Éditeur du site
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>
                  Le site <strong className="text-primary">monapplication.be</strong> est édité par :
                </p>
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
                  <li>
                    Téléphone :{" "}
                    <a
                      href="tel:+32460242427"
                      className="text-accent hover:underline"
                    >
                      +32 460 24 24 27
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                2. Hébergement
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>Le site est hébergé par :</p>
                <ul className="list-none space-y-1 mt-4">
                  <li><strong className="text-primary">Vercel Inc.</strong></li>
                  <li>440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
                  <li>
                    Site web :{" "}
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      vercel.com
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                3. Propriété intellectuelle
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  L'ensemble du contenu du site monapplication.be (textes,
                  images, graphismes, logo, icônes, logiciels, etc.) est la
                  propriété exclusive d'AJ SRL ou de ses partenaires et est
                  protégé par les lois belges et internationales relatives à la
                  propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication
                  ou adaptation de tout ou partie des éléments du site, quel que
                  soit le moyen ou le procédé utilisé, est interdite sans
                  l'autorisation écrite préalable d'AJ SRL.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                4. Limitation de responsabilité
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  AJ SRL s'efforce de fournir sur le site monapplication.be des
                  informations aussi précises que possible. Toutefois, elle ne
                  pourra être tenue responsable des omissions, des inexactitudes
                  ou des carences dans la mise à jour, qu'elles soient de son
                  fait ou du fait de tiers.
                </p>
                <p>
                  Les informations présentes sur le site sont fournies à titre
                  indicatif et sont susceptibles d'être modifiées à tout moment
                  sans préavis.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                5. Liens hypertextes
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Le site monapplication.be peut contenir des liens vers d'autres
                  sites. AJ SRL n'exerce aucun contrôle sur ces sites et décline
                  toute responsabilité quant à leur contenu ou leurs pratiques en
                  matière de protection des données personnelles.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                6. Droit applicable
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>
                  Les présentes mentions légales sont régies par le droit belge.
                  En cas de litige, les tribunaux de Bruxelles seront seuls
                  compétents.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                7. Contact
              </h2>
              <div className="text-text-muted leading-relaxed">
                <p>
                  Pour toute question relative aux présentes mentions légales,
                  vous pouvez nous contacter à{" "}
                  <a
                    href="mailto:contact@monapplication.be"
                    className="text-accent hover:underline"
                  >
                    contact@monapplication.be
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
