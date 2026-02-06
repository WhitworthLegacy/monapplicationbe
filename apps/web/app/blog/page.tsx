"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { seoPages } from "@/content/seo";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="pt-20 md:pt-24">
      {/* Hero */}
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
              Blog
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Nos articles pour
              <br />
              <span className="text-accent">entrepreneurs</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Conseils, guides et actualités sur l'automatisation, la gestion
              d'entreprise et la productivité pour artisans et entrepreneurs
              belges.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {seoPages.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {seoPages.map((article) => {
                const slug = article.slug.replace("/blog/", "");
                return (
                  <motion.article
                    key={article.slug}
                    variants={fadeInUp}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
                  >
                    {/* Color header */}
                    <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                          <BookOpen className="w-3 h-3" />
                          Article
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          {article.sections.length} min de lecture
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {article.h1}
                      </h2>

                      <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.seo.description}
                      </p>

                      <Link
                        href={`/blog/${slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors"
                      >
                        Lire l'article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
              <p className="text-text-muted text-lg">
                Nos articles arrivent bientôt. Restez connecté !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-primary mb-4"
            >
              Prêt à automatiser votre business ?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted mb-8"
            >
              Découvrez comment notre secrétaire digitale peut vous faire gagner
              +15h par semaine.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
