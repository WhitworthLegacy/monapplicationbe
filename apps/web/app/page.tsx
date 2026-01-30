import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-[#0A1929] font-bold text-xl">M</span>
            </div>
            <span className="font-semibold text-lg">MonApplication</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#fonctionnalites"
              className="text-gray-300 hover:text-white transition"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#comment"
              className="text-gray-300 hover:text-white transition"
            >
              Comment ça marche
            </Link>
            <Link
              href="#tarifs"
              className="text-gray-300 hover:text-white transition"
            >
              Tarifs
            </Link>
            <Link
              href="#contact"
              className="text-gray-300 hover:text-white transition"
            >
              Contact
            </Link>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0A1929] font-semibold px-6 py-2 rounded-lg transition">
              Essayer gratuitement
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pb-32">
        <div className="container mx-auto px-6 pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm mb-8">
              ⚡ Nouvelle génération
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Votre secrétaire digitale.
              <br />
              <span className="text-yellow-500">Disponible 24h/24.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Une secrétaire coûte <strong>2 400€/mois</strong>. Notre système
              fait le travail{" "}
              <strong className="text-yellow-500">5 fois moins cher</strong>.
              Opérationnel en 30 jours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-[#0A1929] font-semibold px-8 py-4 rounded-lg text-lg transition shadow-lg shadow-yellow-500/20">
                Demander une démo
              </button>
              <button className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition">
                Consulter nos dévis
              </button>
            </div>

            {/* Feature Points */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Seulement en service client</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>72h de paramétrage</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Serveurs hébergés en UE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Shape at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 8C120 16 240 32 360 42.7C480 53 600 59 720 58.7C840 59 960 53 1080 48C1200 43 1320 37 1380 34.7L1440 32V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}
