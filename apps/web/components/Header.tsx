"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#realisations", label: "Réalisations" },
  { href: "/about", label: "Qui sommes-nous" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          {/* Logo - Grille 9 dots style Rubik's cube */}
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
                href={link.href}
                className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-light text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Demander une démo
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-muted hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-background text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-accent hover:bg-accent-light text-white px-5 py-3 rounded-lg text-sm font-semibold text-center mt-2 transition-all"
              >
                Demander une démo
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
