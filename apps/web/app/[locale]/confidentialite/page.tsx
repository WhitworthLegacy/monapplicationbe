"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function ConfidentialitePage() {
  const t = useTranslations("Confidentialite");
  const s3Items = t.raw("s3Items") as string[];
  const s8Items = t.raw("s8Items") as string[];

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
            {/* 1. Responsable du traitement */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s1Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-2">
                <p>{t("s1Intro")}</p>
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

            {/* 2. Données collectées */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s2Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s2Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">{t("s2Contact").split(":")[0]} :</strong>{" "}
                    {t("s2Contact").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s2Quote").split(":")[0]} :</strong>{" "}
                    {t("s2Quote").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s2Navigation").split(":")[0]} :</strong>{" "}
                    {t("s2Navigation").split(":").slice(1).join(":").trim()}
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* 3. Finalité du traitement */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s3Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s3Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  {s3Items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p>{t("s3NoShare")}</p>
              </div>
            </motion.div>

            {/* 4. Base légale du traitement */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s4Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s4Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">{t("s4Consent").split(":")[0]} :</strong>{" "}
                    {t("s4Consent").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s4Contract").split(":")[0]} :</strong>{" "}
                    {t("s4Contract").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s4Legitimate").split(":")[0]} :</strong>{" "}
                    {t("s4Legitimate").split(":").slice(1).join(":").trim()}
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* 5. Durée de conservation */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s5Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s5Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">{t("s5Contact").split(":")[0]} :</strong>{" "}
                    {t("s5Contact").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s5Contract").split(":")[0]} :</strong>{" "}
                    {t("s5Contract").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s5Cookies").split(":")[0]} :</strong>{" "}
                    {t("s5Cookies").split(":").slice(1).join(":").trim()}
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* 6. Vos droits */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s6Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s6Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">{t("s6Access").split(":")[0]} :</strong>{" "}
                    {t("s6Access").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s6Rectification").split(":")[0]} :</strong>{" "}
                    {t("s6Rectification").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s6Erasure").split(":")[0]} :</strong>{" "}
                    {t("s6Erasure").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s6Restriction").split(":")[0]} :</strong>{" "}
                    {t("s6Restriction").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s6Portability").split(":")[0]} :</strong>{" "}
                    {t("s6Portability").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s6Objection").split(":")[0]} :</strong>{" "}
                    {t("s6Objection").split(":").slice(1).join(":").trim()}
                  </li>
                </ul>
                <p>
                  {t("s6Exercise")}{" "}
                  <a
                    href="mailto:contact@monapplication.be"
                    className="text-accent hover:underline"
                  >
                    contact@monapplication.be
                  </a>
                  {t("s6Response")}
                </p>
              </div>
            </motion.div>

            {/* 7. Cookies */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s7Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s7Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong className="text-primary">{t("s7Essential").split(":")[0]} :</strong>{" "}
                    {t("s7Essential").split(":").slice(1).join(":").trim()}
                  </li>
                  <li>
                    <strong className="text-primary">{t("s7Analytics").split(":")[0]} :</strong>{" "}
                    {t("s7Analytics").split(":").slice(1).join(":").trim()}
                  </li>
                </ul>
                <p>{t("s7Manage")}</p>
              </div>
            </motion.div>

            {/* 8. Sécurité */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s8Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s8Intro")}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  {s8Items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 9. Autorité de contrôle */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s9Title")}
              </h2>
              <div className="text-text-muted leading-relaxed space-y-4">
                <p>{t("s9Intro")}</p>
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

            {/* 10. Modification de la politique */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t("s10Title")}
              </h2>
              <div className="text-text-muted leading-relaxed">
                <p>{t("s10Text")}</p>
                <p className="mt-4 text-sm">
                  {t("s10LastUpdate")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
