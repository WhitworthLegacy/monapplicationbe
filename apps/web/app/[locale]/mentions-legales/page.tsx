"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function MentionsLegalesPage() {
  const t = useTranslations("MentionsLegales");

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
              {t("title")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg max-w-2xl mx-auto"
            >
              {t("subtitle")}
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
                {t("s1Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>
                  {t("s1Intro")}
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
                {t("s2Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>{t("s2Intro")}</p>
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
                {t("s3Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s3P1")}</p>
                <p>{t("s3P2")}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s4Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s4P1")}</p>
                <p>{t("s4P2")}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s5Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s5Text")}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s6Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s6Text")}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s7Title")}
              </h2>
              <div className="text-text-muted leading-relaxed">
                <p>
                  {t("s7Text")}{" "}
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
