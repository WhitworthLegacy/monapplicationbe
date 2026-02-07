"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-background -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:col-span-1"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {t("infoTitle")}
                </h2>
                <p className="text-text-muted">
                  {t("infoSubtitle")}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{t("email")}</h3>
                    <a
                      href="mailto:contact@monapplication.be"
                      className="text-text-muted hover:text-accent transition-colors"
                    >
                      contact@monapplication.be
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      {t("phone")}
                    </h3>
                    <a
                      href="tel:+32460242427"
                      className="text-text-muted hover:text-accent transition-colors"
                    >
                      +32 460 24 24 27
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      {t("locationLabel")}
                    </h3>
                    <p className="text-text-muted">{t("location")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Trust badge */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 p-6 bg-surface rounded-2xl border border-gray-100"
              >
                <p className="text-sm text-text-muted">
                  <span className="font-semibold text-primary">
                    {t("trustBadgeBold")}
                  </span>{" "}
                  {t("trustBadge")}
                </p>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:col-span-2"
            >
              <div className="bg-surface rounded-3xl p-8 md:p-12 shadow-xl shadow-primary/5 border border-gray-100">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-3">
                      {t("successTitle")}
                    </h3>
                    <p className="text-text-muted">
                      {t("successMessage")}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-primary mb-2"
                        >
                          {t("nameLabel")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder={t("namePlaceholder")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-primary mb-2"
                        >
                          {t("emailLabel")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder={t("emailPlaceholder")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-primary mb-2"
                        >
                          {t("phoneLabel")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder={t("phonePlaceholder")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-primary mb-2"
                        >
                          {t("companyLabel")}
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder={t("companyPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-primary mb-2"
                      >
                        {t("messageLabel")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                        placeholder={t("messagePlaceholder")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light disabled:bg-accent/50 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-accent/30 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("submitting")}
                        </>
                      ) : (
                        <>
                          {t("submit")}
                          <Send size={20} />
                        </>
                      )}
                    </button>

                    <p className="text-sm text-text-muted text-center">
                      {t("disclaimer")}
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
