"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  Wrench,
  Cog,
  Heart,
  Briefcase,
  UtensilsCrossed,
  Sparkles,
  Clock,
  EuroIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  User,
  Building2,
  Calendar,
  MessageCircle,
  FileX,
  MonitorX,
  BellOff,
  UserX,
  Receipt,
  PenLine,
  CalendarCheck,
  Loader2,
  CheckCircle2,
  Video,
} from "lucide-react";

// ============================================
// STEP DATA
// ============================================

const TOTAL_STEPS = 8;

const SECTORS = [
  {
    id: "artisan",
    label: "Artisan / Construction",
    emoji: "🔧",
    icon: Wrench,
    metiers: [
      "Plombier",
      "Chauffagiste",
      "Électricien",
      "Menuisier",
      "Peintre",
      "Maçon",
      "Couvreur",
      "Autre",
    ],
  },
  {
    id: "atelier",
    label: "Atelier / Réparation",
    emoji: "🔩",
    icon: Cog,
    metiers: [
      "Mécanicien auto",
      "Réparateur vélo",
      "Cordonnerie",
      "Atelier couture",
      "Autre",
    ],
  },
  {
    id: "bien_etre",
    label: "Bien-être / Santé",
    emoji: "💆",
    icon: Heart,
    metiers: [
      "Dentiste",
      "Kinésithérapeute",
      "Coiffeur",
      "Esthéticienne",
      "Coach sportif",
      "Autre",
    ],
  },
  {
    id: "services",
    label: "Services / Conseil",
    emoji: "💼",
    icon: Briefcase,
    metiers: [
      "Agence marketing",
      "Consultant",
      "Avocat",
      "Comptable",
      "Photographe",
      "Autre",
    ],
  },
  {
    id: "restauration",
    label: "Restauration / Alimentation",
    emoji: "🍽️",
    icon: UtensilsCrossed,
    metiers: ["Restaurant", "Traiteur", "Food truck", "Boulangerie", "Autre"],
  },
  {
    id: "autre",
    label: "Autre secteur",
    emoji: "✨",
    icon: Sparkles,
    metiers: [],
  },
];

const ADMIN_HOURS = [
  {
    value: "<5h",
    label: "Moins de 5h",
    hours: 5,
    pain: "Même 5h, c'est 260h/an perdues. Un mois et demi de travail.",
    yearlyHours: 260,
  },
  {
    value: "5-10h",
    label: "5 à 10 heures",
    hours: 7.5,
    pain: "~400h/an. Un mois entier de travail perdu en paperasse.",
    yearlyHours: 400,
  },
  {
    value: "10-15h",
    label: "10 à 15 heures",
    hours: 12.5,
    pain: "~650h/an. Presque 2 mois de votre vie passés à faire de l'admin.",
    yearlyHours: 650,
  },
  {
    value: "15h+",
    label: "Plus de 15 heures",
    hours: 17.5,
    pain: "800h+/an. Vous travaillez plus pour l'admin que pour vos clients.",
    yearlyHours: 800,
  },
];

const PAIN_POINTS = [
  { id: "appels_manques", label: "Appels manqués", icon: Phone },
  { id: "devis_retard", label: "Devis en retard", icon: FileX },
  { id: "mails_soir", label: "Mails le soir", icon: Mail },
  { id: "excel_papier", label: "Excel / papier partout", icon: MonitorX },
  { id: "oublis_rappels", label: "Oublis de rappels", icon: BellOff },
  { id: "no_shows", label: "No-shows (RDV oubliés)", icon: UserX },
  { id: "relances_impayes", label: "Relances d'impayés", icon: Receipt },
  { id: "pas_suivi", label: "Pas de suivi client", icon: MessageCircle },
];

const TOOLS = [
  { id: "google_agenda", label: "Google Agenda" },
  { id: "excel", label: "Excel / Google Sheets" },
  { id: "whatsapp", label: "WhatsApp Business" },
  { id: "comptable", label: "Logiciel comptable" },
  { id: "crm", label: "CRM existant" },
  { id: "papier", label: "Papier / carnet" },
  { id: "rien", label: "Rien du tout" },
  { id: "autre", label: "Autre" },
];

const CLIENTS_PER_MONTH = [
  {
    value: "<10",
    label: "Moins de 10",
    pain: "Chaque client perdu compte double. Vous ne pouvez pas vous permettre un seul oubli.",
  },
  {
    value: "10-30",
    label: "10 à 30",
    pain: "À ce rythme, le suivi manuel devient un cauchemar. Les oublis se multiplient.",
  },
  {
    value: "30-50",
    label: "30 à 50",
    pain: "Impossible de tout gérer seul. Des clients passent entre les mailles du filet.",
  },
  {
    value: "50+",
    label: "Plus de 50",
    pain: "Vous êtes submergé. Sans automatisation, vous perdez du chiffre d'affaires chaque jour.",
  },
];

// ============================================
// INTERFACES
// ============================================

interface FunnelData {
  sector: string;
  metier: string;
  metierCustom: string;
  adminHours: string;
  hasSecretary: boolean | null;
  painPoints: string[];
  painStory: string;
  currentTools: string[];
  clientsPerMonth: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  selectedDate: string;
  selectedTime: string;
}

// ============================================
// COMPONENT
// ============================================

export default function DiagnosticPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; datetime: string }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [data, setData] = useState<FunnelData>({
    sector: "",
    metier: "",
    metierCustom: "",
    adminHours: "",
    hasSecretary: null,
    painPoints: [],
    painStory: "",
    currentTools: [],
    clientsPerMonth: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    selectedDate: "",
    selectedTime: "",
  });

  const updateData = (partial: Partial<FunnelData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (data.selectedDate && step === 8) {
      setLoadingSlots(true);
      setAvailableSlots([]);
      updateData({ selectedTime: "" });
      fetch(`/api/bookings/slots?date=${data.selectedDate}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.slots) setAvailableSlots(result.slots);
        })
        .catch(() => {})
        .finally(() => setLoadingSlots(false));
    }
  }, [data.selectedDate, step]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const selectedAdminHours = ADMIN_HOURS.find(
    (h) => h.value === data.adminHours
  );
  const hoursLostYear = selectedAdminHours?.yearlyHours || 0;
  const moneyLostYear = data.hasSecretary === true ? 30000 : 0;
  const hourlyRate = 50; // assumed
  const timeCostYear = hoursLostYear * hourlyRate;

  const selectedSector = SECTORS.find((s) => s.id === data.sector);

  // ============================================
  // VALIDATION
  // ============================================

  function canProceed(): boolean {
    switch (step) {
      case 1:
        if (data.sector === "autre") return data.metierCustom.trim().length > 0;
        return data.sector !== "" && data.metier !== "";
      case 2:
        return data.adminHours !== "";
      case 3:
        return data.hasSecretary !== null;
      case 4:
        return data.painPoints.length > 0;
      case 5:
        return data.currentTools.length > 0;
      case 6:
        return data.clientsPerMonth !== "";
      case 7:
        return true;
      case 8:
        return (
          data.name.trim().length > 0 &&
          data.email.includes("@") &&
          data.phone.trim().length > 0 &&
          data.selectedDate !== "" &&
          data.selectedTime !== ""
        );
      default:
        return false;
    }
  }

  function next() {
    if (!canProceed()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit() {
    if (!canProceed() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const funnelPayload = {
        sector: data.sector,
        metier: data.sector === "autre" ? data.metierCustom : data.metier,
        admin_hours: data.adminHours,
        has_secretary: data.hasSecretary,
        pain_points: data.painPoints,
        pain_story: data.painStory,
        current_tools: data.currentTools,
        clients_per_month: data.clientsPerMonth,
        hours_lost_year: hoursLostYear,
        money_lost_year: data.hasSecretary ? 30000 : timeCostYear,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        booking_date: data.selectedDate,
        booking_time: data.selectedTime,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(funnelPayload),
      });

      const result = await res.json();

      if (result.success) {
        setMeetLink(result.data?.meet_link || "");
        setIsBooked(true);
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ============================================
  // TOGGLE HELPERS
  // ============================================

  function togglePainPoint(id: string) {
    updateData({
      painPoints: data.painPoints.includes(id)
        ? data.painPoints.filter((p) => p !== id)
        : [...data.painPoints, id],
    });
  }

  function toggleTool(id: string) {
    updateData({
      currentTools: data.currentTools.includes(id)
        ? data.currentTools.filter((t) => t !== id)
        : [...data.currentTools, id],
    });
  }

  // ============================================
  // MIN DATE (tomorrow)
  // ============================================

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // ============================================
  // STEP ANIMATIONS
  // ============================================

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  // ============================================
  // SUCCESS SCREEN
  // ============================================

  if (isBooked) {
    return (
      <main className="pt-20 md:pt-24">
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary">
          <div className="max-w-xl mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Votre appel est confirmé !
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-lg mb-8"
            >
              Vous allez recevoir un email de confirmation avec le lien Google
              Meet. On se retrouve le{" "}
              <strong className="text-accent">
                {new Date(data.selectedDate).toLocaleDateString("fr-BE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>{" "}
              à <strong className="text-accent">{data.selectedTime}</strong>.
            </motion.p>
            {meetLink && (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                <Video className="w-5 h-5" />
                Lien Google Meet
              </motion.a>
            )}
          </div>
        </section>
      </main>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="pt-20 md:pt-24">
      <section className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-muted">
                Étape {step} sur {TOTAL_STEPS}
              </span>
              <span className="text-sm font-medium text-accent">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                initial={false}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                {/* ======================== STEP 1 ======================== */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Dans quel secteur travaillez-vous ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      Sélectionnez votre domaine d'activité pour que nous
                      adaptions notre diagnostic.
                    </p>

                    {!data.sector || data.sector === "" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {SECTORS.map((sector) => (
                          <button
                            key={sector.id}
                            onClick={() =>
                              updateData({
                                sector: sector.id,
                                metier: "",
                                metierCustom: "",
                              })
                            }
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-accent hover:bg-accent/5 transition-all text-center"
                          >
                            <span className="text-2xl">{sector.emoji}</span>
                            <span className="text-sm font-medium text-primary">
                              {sector.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : data.sector === "autre" ? (
                      <div>
                        <button
                          onClick={() =>
                            updateData({
                              sector: "",
                              metier: "",
                              metierCustom: "",
                            })
                          }
                          className="text-sm text-accent hover:underline mb-4 inline-flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" /> Changer de secteur
                        </button>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Décrivez votre activité
                        </label>
                        <input
                          type="text"
                          value={data.metierCustom}
                          onChange={(e) =>
                            updateData({ metierCustom: e.target.value })
                          }
                          placeholder="Ex: Coach en développement personnel"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        />
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() =>
                            updateData({
                              sector: "",
                              metier: "",
                              metierCustom: "",
                            })
                          }
                          className="text-sm text-accent hover:underline mb-4 inline-flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" /> Changer de secteur
                        </button>
                        <p className="text-sm text-text-muted mb-3">
                          <span className="font-medium text-primary">
                            {selectedSector?.emoji} {selectedSector?.label}
                          </span>{" "}
                          — Quel est votre métier ?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedSector?.metiers.map((metier) => (
                            <button
                              key={metier}
                              onClick={() => updateData({ metier })}
                              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                data.metier === metier
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-gray-100 hover:border-accent/50 text-primary"
                              }`}
                            >
                              {metier}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ======================== STEP 2 ======================== */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Combien d'heures d'admin par semaine ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      Soyez honnête. Comptez les mails, devis, factures,
                      rappels, planning, WhatsApp...
                    </p>

                    <div className="space-y-3">
                      {ADMIN_HOURS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateData({ adminHours: option.value })
                          }
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            data.adminHours === option.value
                              ? "border-accent bg-accent/5"
                              : "border-gray-100 hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock
                                className={`w-5 h-5 ${
                                  data.adminHours === option.value
                                    ? "text-accent"
                                    : "text-text-muted"
                                }`}
                              />
                              <span className="font-medium text-primary">
                                {option.label}
                              </span>
                            </div>
                            {data.adminHours === option.value && (
                              <Check className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          {data.adminHours === option.value && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                            >
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              {option.pain}
                            </motion.p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ======================== STEP 3 ======================== */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Avez-vous une secrétaire ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      Cela nous aide à calculer vos coûts réels.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateData({ hasSecretary: true })}
                        className={`p-6 rounded-xl border-2 text-center transition-all ${
                          data.hasSecretary === true
                            ? "border-accent bg-accent/5"
                            : "border-gray-100 hover:border-accent/50"
                        }`}
                      >
                        <EuroIcon
                          className={`w-8 h-8 mx-auto mb-2 ${
                            data.hasSecretary === true
                              ? "text-accent"
                              : "text-text-muted"
                          }`}
                        />
                        <span className="font-semibold text-primary block">
                          Oui
                        </span>
                      </button>
                      <button
                        onClick={() => updateData({ hasSecretary: false })}
                        className={`p-6 rounded-xl border-2 text-center transition-all ${
                          data.hasSecretary === false
                            ? "border-accent bg-accent/5"
                            : "border-gray-100 hover:border-accent/50"
                        }`}
                      >
                        <Clock
                          className={`w-8 h-8 mx-auto mb-2 ${
                            data.hasSecretary === false
                              ? "text-accent"
                              : "text-text-muted"
                          }`}
                        />
                        <span className="font-semibold text-primary block">
                          Non
                        </span>
                      </button>
                    </div>

                    {data.hasSecretary !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl ${
                          data.hasSecretary
                            ? "bg-red-50 border border-red-100"
                            : "bg-amber-50 border border-amber-100"
                        }`}
                      >
                        {data.hasSecretary ? (
                          <div>
                            <p className="font-semibold text-red-700 mb-1">
                              ~30 000€/an
                            </p>
                            <p className="text-sm text-red-600">
                              C'est le coût moyen d'une secrétaire en Belgique :
                              salaire + charges sociales + congés + risque de
                              démission. Et l'erreur est humaine.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-amber-700 mb-1">
                              {hoursLostYear > 0
                                ? `~${hoursLostYear}h/an perdues`
                                : "~15h/semaine perdues"}
                            </p>
                            <p className="text-sm text-amber-600">
                              Vous perdez votre temps le plus précieux sur des
                              tâches répétitives. À{" "}
                              {hourlyRate}€/h, c'est{" "}
                              {hoursLostYear > 0
                                ? `${(hoursLostYear * hourlyRate).toLocaleString("fr-BE")}€`
                                : "des milliers d'euros"}{" "}
                              de manque à gagner par an.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ======================== STEP 4 ======================== */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Quelles sont vos plus grosses douleurs ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      Sélectionnez tout ce qui vous parle.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {PAIN_POINTS.map((pain) => {
                        const selected = data.painPoints.includes(pain.id);
                        return (
                          <button
                            key={pain.id}
                            onClick={() => togglePainPoint(pain.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all ${
                              selected
                                ? "border-red-400 bg-red-50 text-red-700"
                                : "border-gray-100 hover:border-red-200 text-primary"
                            }`}
                          >
                            <pain.icon
                              className={`w-4 h-4 shrink-0 ${
                                selected ? "text-red-500" : "text-text-muted"
                              }`}
                            />
                            <span className="font-medium">{pain.label}</span>
                            {selected && (
                              <Check className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <PenLine className="w-4 h-4 inline mr-1" />
                        Décrivez un moment douloureux que vous avez vécu
                      </label>
                      <textarea
                        value={data.painStory}
                        onChange={(e) =>
                          updateData({ painStory: e.target.value })
                        }
                        placeholder="Ex: Un client m'a appelé pendant un chantier, j'ai rappelé 2h plus tard, il avait déjà réservé ailleurs..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-sm"
                      />
                      <p className="text-xs text-text-muted mt-1">
                        Optionnel, mais ça nous aide à personnaliser votre
                        solution.
                      </p>
                    </div>
                  </div>
                )}

                {/* ======================== STEP 5 ======================== */}
                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Quels outils utilisez-vous ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      On se connecte à vos outils existants. Dites-nous ce que
                      vous utilisez déjà.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {TOOLS.map((tool) => {
                        const selected = data.currentTools.includes(tool.id);
                        return (
                          <button
                            key={tool.id}
                            onClick={() => toggleTool(tool.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              selected
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-gray-100 hover:border-accent/50 text-primary"
                            }`}
                          >
                            {selected ? (
                              <Check className="w-4 h-4 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded border border-gray-300 shrink-0" />
                            )}
                            {tool.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ======================== STEP 6 ======================== */}
                {step === 6 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Combien de clients par mois ?
                    </h2>
                    <p className="text-text-muted mb-6">
                      Plus vous avez de clients, plus l'admin vous coûte cher.
                    </p>

                    <div className="space-y-3">
                      {CLIENTS_PER_MONTH.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateData({ clientsPerMonth: option.value })
                          }
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            data.clientsPerMonth === option.value
                              ? "border-accent bg-accent/5"
                              : "border-gray-100 hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">
                              {option.label}
                            </span>
                            {data.clientsPerMonth === option.value && (
                              <Check className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          {data.clientsPerMonth === option.value && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2 text-sm text-text-muted"
                            >
                              {option.pain}
                            </motion.p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ======================== STEP 7 ======================== */}
                {step === 7 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Votre diagnostic
                    </h2>
                    <p className="text-text-muted mb-6">
                      Voici ce que l'admin vous coûte réellement.
                    </p>

                    {/* Big stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                        <Clock className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">
                          {hoursLostYear}h
                        </p>
                        <p className="text-xs text-red-500">perdues par an</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                        <EuroIcon className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">
                          {(data.hasSecretary
                            ? 30000
                            : timeCostYear
                          ).toLocaleString("fr-BE")}
                          €
                        </p>
                        <p className="text-xs text-red-500">
                          {data.hasSecretary
                            ? "coût secrétaire/an"
                            : "manque à gagner/an"}
                        </p>
                      </div>
                    </div>

                    {/* Pain points solved */}
                    <div className="bg-green-50 rounded-xl p-5 border border-green-100 mb-6">
                      <h3 className="font-semibold text-green-800 mb-3">
                        Ce qu'on résout pour vous :
                      </h3>
                      <div className="space-y-2">
                        {data.painPoints.map((id) => {
                          const pain = PAIN_POINTS.find((p) => p.id === id);
                          return pain ? (
                            <div
                              key={id}
                              className="flex items-center gap-2 text-sm text-green-700"
                            >
                              <Check className="w-4 h-4 text-green-500 shrink-0" />
                              <span>{pain.label}</span>
                              <ArrowRight className="w-3 h-3 text-green-400" />
                              <span className="font-medium">Automatisé</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Promise */}
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-5 text-white">
                      <p className="font-semibold mb-2">
                        Votre secrétaire digitale peut résoudre tout ça.
                      </p>
                      <p className="text-sm text-white/80">
                        1ère version opérationnelle en 30 jours. Paiement
                        unique. Pas d'abonnement. Compatible avec vos outils
                        existants.
                      </p>
                    </div>
                  </div>
                )}

                {/* ======================== STEP 8 ======================== */}
                {step === 8 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Réservez votre appel découverte
                    </h2>
                    <p className="text-text-muted mb-6">
                      15 minutes, gratuit, sans engagement. On regarde ensemble
                      comment automatiser votre admin.
                    </p>

                    {/* Contact fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <User className="w-3.5 h-3.5 inline mr-1" />
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => updateData({ name: e.target.value })}
                          placeholder="Jean Dupont"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Building2 className="w-3.5 h-3.5 inline mr-1" />
                          Entreprise
                        </label>
                        <input
                          type="text"
                          value={data.company}
                          onChange={(e) =>
                            updateData({ company: e.target.value })
                          }
                          placeholder="Ma Société SRL"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Mail className="w-3.5 h-3.5 inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) =>
                            updateData({ email: e.target.value })
                          }
                          placeholder="jean@entreprise.be"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Phone className="w-3.5 h-3.5 inline mr-1" />
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={data.phone}
                          onChange={(e) =>
                            updateData({ phone: e.target.value })
                          }
                          placeholder="+32 4XX XX XX XX"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Date picker */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-primary mb-1">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Choisissez une date *
                      </label>
                      <input
                        type="date"
                        value={data.selectedDate}
                        onChange={(e) =>
                          updateData({ selectedDate: e.target.value })
                        }
                        min={minDate}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                      />
                    </div>

                    {/* Time slots */}
                    {data.selectedDate && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-primary mb-2">
                          <CalendarCheck className="w-3.5 h-3.5 inline mr-1" />
                          Créneaux disponibles
                        </label>

                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-text-muted text-sm py-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Chargement des disponibilités...
                          </div>
                        ) : availableSlots.length > 0 ? (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot.time}
                                onClick={() =>
                                  updateData({ selectedTime: slot.time })
                                }
                                className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all ${
                                  data.selectedTime === slot.time
                                    ? "border-accent bg-accent text-white"
                                    : "border-gray-200 hover:border-accent text-primary"
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-text-muted py-2">
                            Aucun créneau disponible ce jour. Essayez une autre
                            date.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            ) : (
              <div />
            )}

            {step < 7 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  canProceed()
                    ? "bg-accent hover:bg-accent-light text-white hover:shadow-lg hover:shadow-accent/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 7 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transition-all"
              >
                Réserver mon appel gratuit
                <CalendarCheck className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  canProceed() && !isSubmitting
                    ? "bg-accent hover:bg-accent-light text-white hover:shadow-lg hover:shadow-accent/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    Confirmer mon appel
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reassurance */}
          <p className="text-center text-xs text-text-muted mt-6">
            {step <= 6 &&
              "Diagnostic 100% gratuit et confidentiel. Aucun engagement."}
            {step === 7 &&
              "Nous avons aidé des dizaines d'entrepreneurs à automatiser leur admin."}
            {step === 8 &&
              "15 minutes. Gratuit. Sans engagement. On regarde ensemble votre situation."}
          </p>
        </div>
      </section>
    </main>
  );
}
