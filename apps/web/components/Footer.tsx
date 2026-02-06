import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="grid grid-cols-3 gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-400" />
                <div className="w-2 h-2 rounded-sm bg-gray-500" />
                <div className="w-2 h-2 rounded-sm bg-accent" />
                <div className="w-2 h-2 rounded-sm bg-gray-500" />
                <div className="w-2 h-2 rounded-sm bg-accent" />
                <div className="w-2 h-2 rounded-sm bg-gray-400" />
                <div className="w-2 h-2 rounded-sm bg-accent" />
                <div className="w-2 h-2 rounded-sm bg-gray-400" />
                <div className="w-2 h-2 rounded-sm bg-gray-500" />
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 font-medium text-xl">mon</span>
                <span className="text-white font-bold text-xl">application</span>
                <span className="text-accent font-bold text-xl">.be</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Spécialistes en automatisation pour entrepreneurs. Votre secrétaire
              digitale gère booking, devis, CRM et notifications 24h/24.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#problemes"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Le problème
                </Link>
              </li>
              <li>
                <Link
                  href="/#fonctionnalites"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  La solution
                </Link>
              </li>
              <li>
                <Link
                  href="/#realisations"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Réalisations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifs"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Formules
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-accent" />
                <a
                  href="mailto:contact@monapplication.be"
                  className="hover:text-accent transition-colors"
                >
                  contact@monapplication.be
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} className="text-accent" />
                <a
                  href="tel:+32460242427"
                  className="hover:text-accent transition-colors"
                >
                  +32 460 24 24 27
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-accent mt-0.5" />
                <span>Belgique</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} monapplication.be. Tous droits
            réservés.
          </p>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="text-gray-500 hover:text-accent transition-colors text-sm"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="text-gray-500 hover:text-accent transition-colors text-sm"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
