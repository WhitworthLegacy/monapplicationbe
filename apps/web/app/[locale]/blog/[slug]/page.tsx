"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { seoPages } from "@/content/seo";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";

export default function BlogArticlePage() {
  const t = useTranslations("Blog");
  const params = useParams();
  const slug = params.slug as string;

  const article = seoPages.find(
    (p) => p.slug === `/blog/${slug}`
  );

  if (!article) {
    return (
      <main className="pt-20 md:pt-24">
        <section className="py-24 bg-surface">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">
              {t("notFoundTitle")}
            </h1>
            <p className="text-text-muted mb-8">
              {t("notFoundMessage")}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToBlog")}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToBlog")}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 mb-6"
            >
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-white/10 px-2.5 py-1 rounded-full">
                <BookOpen className="w-3 h-3" />
                {t("article")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/60">
                <Clock className="w-3 h-3" />
                {t("readTime", { count: article.sections.length })}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              {article.h1}
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-12"
          >
            {article.sections.map((section, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  {section.heading}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-text-muted leading-relaxed
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary [&_h3]:mt-8 [&_h3]:mb-4
                    [&_p]:mb-4
                    [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:space-y-2
                    [&_li]:text-text-muted
                    [&_strong]:text-primary [&_strong]:font-semibold
                    [&_a]:text-accent [&_a]:hover:underline"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA in article */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-16 p-8 bg-gradient-to-r from-primary to-secondary rounded-2xl text-center"
          >
            <motion.h3
              variants={fadeInUp}
              className="text-2xl font-bold text-white mb-4"
            >
              {t("articleCtaTitle")}
            </motion.h3>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 mb-6 max-w-lg mx-auto"
            >
              {t("articleCtaSubtitle")}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                {t("articleCtaButton")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
