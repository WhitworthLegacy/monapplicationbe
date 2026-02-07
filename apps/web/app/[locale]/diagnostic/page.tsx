"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
// STEP DATA (icons/emojis/ids only - labels come from translations)
// ============================================

const TOTAL_STEPS = 8;

const SECTOR_META = [
  { id: "artisan", emoji: "\u{1F527}", icon: Wrench, metierKeys: ["Plombier", "Chauffagiste", "\u00c9lectricien", "Menuisier", "Peintre", "Ma\u00e7on", "Couvreur", "Autre"] },
  { id: "atelier", emoji: "\u{1F529}", icon: Cog, metierKeys: ["M\u00e9canicien auto", "R\u00e9parateur v\u00e9lo", "Cordonnerie", "Atelier couture", "Autre"] },
  { id: "bien_etre", emoji: "\u{1F486}", icon: Heart, metierKeys: ["Dentiste", "Kin\u00e9sith\u00e9rapeute", "Coiffeur", "Esth\u00e9ticienne", "Coach sportif", "Autre"] },
  { id: "services", emoji: "\u{1F4BC}", icon: Briefcase, metierKeys: ["Agence marketing", "Consultant", "Avocat", "Comptable", "Photographe", "Autre"] },
  { id: "restauration", emoji: "\u{1F37D}\u{FE0F}", icon: UtensilsCrossed, metierKeys: ["Restaurant", "Traiteur", "Food truck", "Boulangerie", "Autre"] },
  { id: "autre", emoji: "\u{2728}", icon: Sparkles, metierKeys: [] },
];

const ADMIN_HOURS_VALUES = ["<5h", "5-10h", "10-15h", "15h+"];
const ADMIN_HOURS_DETAIL = [
  { value: "<5h", hours: 5, yearlyHours: 260 },
  { value: "5-10h", hours: 7.5, yearlyHours: 400 },
  { value: "10-15h", hours: 12.5, yearlyHours: 650 },
  { value: "15h+", hours: 17.5, yearlyHours: 800 },
];

const PAIN_POINT_IDS = [
  { id: "appels_manques", icon: Phone },
  { id: "devis_retard", icon: FileX },
  { id: "mails_soir", icon: Mail },
  { id: "excel_papier", icon: MonitorX },
  { id: "oublis_rappels", icon: BellOff },
  { id: "no_shows", icon: UserX },
  { id: "relances_impayes", icon: Receipt },
  { id: "pas_suivi", icon: MessageCircle },
];

const TOOL_IDS = [
  "google_agenda",
  "excel",
  "whatsapp",
  "comptable",
  "crm",
  "papier",
  "rien",
  "autre",
];

const CLIENTS_PER_MONTH_VALUES = ["<10", "10-30", "30-50", "50+"];

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
  const t = useTranslations("Diagnostic");
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

  // Get translated data arrays
  const adminHoursTranslated = t.raw("adminHours") as { label: string; pain: string }[];
  const clientsPerMonthTranslated = t.raw("clientsPerMonth") as { label: string; pain: string }[];

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

  const selectedAdminHoursDetail = ADMIN_HOURS_DETAIL.find(
    (h) => h.value === data.adminHours
  );
  const hoursLostYear = selectedAdminHoursDetail?.yearlyHours || 0;
  const moneyLostYear = data.hasSecretary === true ? 30000 : 0;
  const hourlyRate = 50; // assumed
  const timeCostYear = hoursLostYear * hourlyRate;

  const selectedSectorMeta = SECTOR_META.find((s) => s.id === data.sector);

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
        alert(t("error"));
      }
    } catch {
      alert(t("error"));
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
              {t("successTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-lg mb-8"
            >
              {t("successMessage")}{" "}
              <strong className="text-accent">
                {new Date(data.selectedDate).toLocaleDateString("fr-BE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>{" "}
              {t("successAt")} <strong className="text-accent">{data.selectedTime}</strong>.
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
                {t("meetLink")}
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
                {t("stepOf", { step, total: TOTAL_STEPS })}
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
                      {t("step1Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step1Subtitle")}
                    </p>

                    {!data.sector || data.sector === "" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {SECTOR_META.map((sector) => (
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
                              {t(`sectors.${sector.id}`)}
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
                          <ArrowLeft className="w-3 h-3" /> {t("changeSector")}
                        </button>
                        <label className="block text-sm font-medium text-primary mb-2">
                          {t("describeActivity")}
                        </label>
                        <input
                          type="text"
                          value={data.metierCustom}
                          onChange={(e) =>
                            updateData({ metierCustom: e.target.value })
                          }
                          placeholder={t("describeActivityPlaceholder")}
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
                          <ArrowLeft className="w-3 h-3" /> {t("changeSector")}
                        </button>
                        <p className="text-sm text-text-muted mb-3">
                          <span className="font-medium text-primary">
                            {selectedSectorMeta?.emoji} {t(`sectors.${selectedSectorMeta?.id}`)}
                          </span>{" "}
                          {t("whatJob")}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedSectorMeta?.metierKeys.map((metier) => (
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
                      {t("step2Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step2Subtitle")}
                    </p>

                    <div className="space-y-3">
                      {ADMIN_HOURS_VALUES.map((value, index) => {
                        const translated = adminHoursTranslated[index];
                        return (
                          <button
                            key={value}
                            onClick={() =>
                              updateData({ adminHours: value })
                            }
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              data.adminHours === value
                                ? "border-accent bg-accent/5"
                                : "border-gray-100 hover:border-accent/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Clock
                                  className={`w-5 h-5 ${
                                    data.adminHours === value
                                      ? "text-accent"
                                      : "text-text-muted"
                                  }`}
                                />
                                <span className="font-medium text-primary">
                                  {translated?.label}
                                </span>
                              </div>
                              {data.adminHours === value && (
                                <Check className="w-5 h-5 text-accent" />
                              )}
                            </div>
                            {data.adminHours === value && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                              >
                                <AlertTriangle className="w-4 h-4 inline mr-1" />
                                {translated?.pain}
                              </motion.p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ======================== STEP 3 ======================== */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {t("step3Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step3Subtitle")}
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
                          {t("yes")}
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
                          {t("no")}
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
                              {t("secretaryCost")}
                            </p>
                            <p className="text-sm text-red-600">
                              {t("secretaryCostDesc")}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-amber-700 mb-1">
                              {hoursLostYear > 0
                                ? t("hoursLostYear", { hours: hoursLostYear })
                                : t("hoursLostDefault")}
                            </p>
                            <p className="text-sm text-amber-600">
                              {t("hoursLostDesc")}
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
                      {t("step4Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step4Subtitle")}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {PAIN_POINT_IDS.map((pain) => {
                        const selected = data.painPoints.includes(pain.id);
                        const PainIcon = pain.icon;
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
                            <PainIcon
                              className={`w-4 h-4 shrink-0 ${
                                selected ? "text-red-500" : "text-text-muted"
                              }`}
                            />
                            <span className="font-medium">{t(`painPoints.${pain.id}`)}</span>
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
                        {t("storyLabel")}
                      </label>
                      <textarea
                        value={data.painStory}
                        onChange={(e) =>
                          updateData({ painStory: e.target.value })
                        }
                        placeholder={t("storyPlaceholder")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-sm"
                      />
                      <p className="text-xs text-text-muted mt-1">
                        {t("storyHint")}
                      </p>
                    </div>
                  </div>
                )}

                {/* ======================== STEP 5 ======================== */}
                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {t("step5Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step5Subtitle")}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {TOOL_IDS.map((toolId) => {
                        const selected = data.currentTools.includes(toolId);
                        return (
                          <button
                            key={toolId}
                            onClick={() => toggleTool(toolId)}
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
                            {t(`tools.${toolId}`)}
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
                      {t("step6Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step6Subtitle")}
                    </p>

                    <div className="space-y-3">
                      {CLIENTS_PER_MONTH_VALUES.map((value, index) => {
                        const translated = clientsPerMonthTranslated[index];
                        return (
                          <button
                            key={value}
                            onClick={() =>
                              updateData({ clientsPerMonth: value })
                            }
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              data.clientsPerMonth === value
                                ? "border-accent bg-accent/5"
                                : "border-gray-100 hover:border-accent/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-primary">
                                {translated?.label}
                              </span>
                              {data.clientsPerMonth === value && (
                                <Check className="w-5 h-5 text-accent" />
                              )}
                            </div>
                            {data.clientsPerMonth === value && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 text-sm text-text-muted"
                              >
                                {translated?.pain}
                              </motion.p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ======================== STEP 7 ======================== */}
                {step === 7 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {t("step7Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step7Subtitle")}
                    </p>

                    {/* Big stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                        <Clock className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">
                          {hoursLostYear}h
                        </p>
                        <p className="text-xs text-red-500">{t("lostPerYear")}</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                        <EuroIcon className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">
                          {(data.hasSecretary
                            ? 30000
                            : timeCostYear
                          ).toLocaleString("fr-BE")}
                          &euro;
                        </p>
                        <p className="text-xs text-red-500">
                          {data.hasSecretary
                            ? t("secretaryCostPerYear")
                            : t("opportunityCostPerYear")}
                        </p>
                      </div>
                    </div>

                    {/* Pain points solved */}
                    <div className="bg-green-50 rounded-xl p-5 border border-green-100 mb-6">
                      <h3 className="font-semibold text-green-800 mb-3">
                        {t("solvedTitle")}
                      </h3>
                      <div className="space-y-2">
                        {data.painPoints.map((id) => {
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-2 text-sm text-green-700"
                            >
                              <Check className="w-4 h-4 text-green-500 shrink-0" />
                              <span>{t(`painPoints.${id}`)}</span>
                              <ArrowRight className="w-3 h-3 text-green-400" />
                              <span className="font-medium">{t("automated")}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Promise */}
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-5 text-white">
                      <p className="font-semibold mb-2">
                        {t("promiseTitle")}
                      </p>
                      <p className="text-sm text-white/80">
                        {t("promiseText")}
                      </p>
                    </div>
                  </div>
                )}

                {/* ======================== STEP 8 ======================== */}
                {step === 8 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {t("step8Title")}
                    </h2>
                    <p className="text-text-muted mb-6">
                      {t("step8Subtitle")}
                    </p>

                    {/* Contact fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <User className="w-3.5 h-3.5 inline mr-1" />
                          {t("nameLabel")}
                        </label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => updateData({ name: e.target.value })}
                          placeholder={t("namePlaceholder")}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Building2 className="w-3.5 h-3.5 inline mr-1" />
                          {t("companyLabel")}
                        </label>
                        <input
                          type="text"
                          value={data.company}
                          onChange={(e) =>
                            updateData({ company: e.target.value })
                          }
                          placeholder={t("companyPlaceholder")}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Mail className="w-3.5 h-3.5 inline mr-1" />
                          {t("emailLabel")}
                        </label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) =>
                            updateData({ email: e.target.value })
                          }
                          placeholder={t("emailPlaceholder")}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          <Phone className="w-3.5 h-3.5 inline mr-1" />
                          {t("phoneLabel")}
                        </label>
                        <input
                          type="tel"
                          value={data.phone}
                          onChange={(e) =>
                            updateData({ phone: e.target.value })
                          }
                          placeholder={t("phonePlaceholder")}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Date picker */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-primary mb-1">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        {t("dateLabel")}
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
                          {t("slotsLabel")}
                        </label>

                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-text-muted text-sm py-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t("loadingSlots")}
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
                            {t("noSlots")}
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
                {t("back")}
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
                {t("continue")}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 7 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transition-all"
              >
                {t("bookCall")}
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
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    {t("confirm")}
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reassurance */}
          <p className="text-center text-xs text-text-muted mt-6">
            {step <= 6 && t("reassurance1")}
            {step === 7 && t("reassurance2")}
            {step === 8 && t("reassurance3")}
          </p>
        </div>
      </section>
    </main>
  );
}
