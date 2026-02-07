"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("Header");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isMobileCaseStudyOpen, setIsMobileCaseStudyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/tarifs", label: t("nav.pricing") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const caseStudies = [
    { href: "/presentations/velodoctor-case-study.html", label: "VeloDoctor", sub: t("caseStudies.velodoctor.sub") },
    { href: "/presentations/aircooling-case-study.html", label: "AirCooling", sub: t("caseStudies.aircooling.sub") },
    { href: "/presentations/closing-call.html", label: t("caseStudies.closing.label"), sub: t("caseStudies.closing.sub") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCaseStudyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="grid grid-cols-3 gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            {/* Case studies dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsCaseStudyOpen(!isCaseStudyOpen)}
                className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                {t("caseStudies.title")}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isCaseStudyOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isCaseStudyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {caseStudies.map((study) => (
                      <a
                        key={study.href}
                        href={study.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsCaseStudyOpen(false)}
                        className="flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm font-semibold text-primary">{study.label}</span>
                        <span className="text-xs text-text-muted">{study.sub}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <LanguageSwitcher />

            <Link
              href="/diagnostic"
              className="bg-accent hover:bg-accent-light text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              {t("cta")}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-gray-100"
          >
            <nav className="flex flex-col p-4 gap-2">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-muted hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-background text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {/* Case studies - mobile */}
              <button
                onClick={() => setIsMobileCaseStudyOpen(!isMobileCaseStudyOpen)}
                className="flex items-center justify-between text-text-muted hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-background text-sm font-medium"
              >
                {t("caseStudies.title")}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isMobileCaseStudyOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isMobileCaseStudyOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1 pl-4"
                  >
                    {caseStudies.map((study) => (
                      <a
                        key={study.href}
                        href={study.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col py-2 px-4 rounded-lg hover:bg-background transition-colors"
                      >
                        <span className="text-sm font-semibold text-primary">{study.label}</span>
                        <span className="text-xs text-text-muted">{study.sub}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/diagnostic"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-accent hover:bg-accent-light text-white px-5 py-3 rounded-lg text-sm font-semibold text-center mt-2 transition-all"
              >
                {t("cta")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
