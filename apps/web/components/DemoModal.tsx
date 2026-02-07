"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutDashboard,
  Users,
  FileText,
  PiggyBank,
  Kanban,
  Plus,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  Euro,
  ChevronRight,
  Zap,
  MousePointerClick,
  Wrench,
  Package,
  Bike,
  AlertCircle,
  CheckCircle2,
  Timer,
} from "lucide-react";

type TabType = "dashboard" | "crm" | "clients" | "devis" | "finances" | "atelier" | "stock" | "rdv";

interface TabConfig {
  id: TabType;
  label: string;
  icon: any;
}

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectColor: string;
}

const veloDocterTabs: TabConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crm", label: "CRM", icon: Kanban },
  { id: "clients", label: "Clients", icon: Users },
  { id: "atelier", label: "Atelier", icon: Wrench },
  { id: "stock", label: "Stock", icon: Package },
  { id: "devis", label: "Devis", icon: FileText },
  { id: "finances", label: "Finances", icon: PiggyBank },
];

const airCoolingTabs: TabConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crm", label: "CRM", icon: Kanban },
  { id: "clients", label: "Clients", icon: Users },
  { id: "rdv", label: "RDV", icon: Calendar },
  { id: "devis", label: "Devis", icon: FileText },
  { id: "finances", label: "Finances", icon: PiggyBank },
];

export function DemoModal({ isOpen, onClose, projectName, projectColor }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const t = useTranslations("DemoModal");

  const isVeloDoctor = projectName === "VeloDoctor";
  const tabs = isVeloDoctor ? veloDocterTabs : airCoolingTabs;

  // Reset to dashboard when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("dashboard");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${projectColor} px-6 py-4 flex items-center justify-between`}>
            <div>
              <h3 className="text-xl font-bold text-white">{projectName}</h3>
              <p className="text-white/80 text-sm">{t("adminPreview")}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-gray-50 px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 bg-gray-100 min-h-[400px] max-h-[60vh] overflow-y-auto">
            {activeTab === "dashboard" && <DashboardPreview isVeloDoctor={isVeloDoctor} t={t} />}
            {activeTab === "crm" && <CrmPreview isVeloDoctor={isVeloDoctor} t={t} />}
            {activeTab === "clients" && <ClientsPreview isVeloDoctor={isVeloDoctor} t={t} />}
            {activeTab === "devis" && <DevisPreview isVeloDoctor={isVeloDoctor} t={t} />}
            {activeTab === "finances" && <FinancesPreview isVeloDoctor={isVeloDoctor} t={t} />}
            {activeTab === "atelier" && <AtelierPreview t={t} />}
            {activeTab === "stock" && <StockPreview t={t} />}
            {activeTab === "rdv" && <RdvPreview t={t} />}
          </div>

          {/* Footer with benefits */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Zap className="w-4 h-4" />
                <span>{t("autoEmails")}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <MousePointerClick className="w-4 h-4" />
                <span>{t("quickQuotes")}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Clock className="w-4 h-4" />
                <span>{isVeloDoctor ? t("hoursGainedVelo") : t("hoursGainedAir")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

type TranslationFn = ReturnType<typeof useTranslations>;

function DashboardPreview({ isVeloDoctor, t }: { isVeloDoctor: boolean; t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* KPI Cards - Different values per project */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isVeloDoctor ? (
          <>
            <KpiCard icon={Calendar} label={t("kpiLabels.todayRdv")} value="6" color="blue" />
            <KpiCard icon={Users} label={t("kpiLabels.newClients")} value="9" color="green" />
            <KpiCard icon={Wrench} label={t("kpiLabels.inWorkshop")} value="4" color="orange" />
            <KpiCard icon={Euro} label={t("kpiLabels.monthlyRevenue")} value="3.8K€" color="purple" />
          </>
        ) : (
          <>
            <KpiCard icon={Calendar} label={t("kpiLabels.todayRdv")} value="5" color="blue" />
            <KpiCard icon={Users} label={t("kpiLabels.newClients")} value="7" color="green" />
            <KpiCard icon={FileText} label={t("kpiLabels.pendingQuotes")} value="8" color="orange" />
            <KpiCard icon={Euro} label={t("kpiLabels.monthlyRevenue")} value="6.2K€" color="purple" />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{t("quickActions")}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <QuickActionButton icon={Plus} label={t("newClient")} />
          <QuickActionButton icon={FileText} label={t("createQuote")} highlight />
          <QuickActionButton icon={Calendar} label={t("planRdv")} />
          <QuickActionButton icon={Mail} label={t("sendReminder")} />
        </div>
      </div>

      {/* Today's appointments preview */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{t("nextRdv")}</h4>
        <div className="space-y-2">
          {isVeloDoctor ? (
            <>
              <AppointmentRow time="09:30" client="Thomas B." service="Réparation vélo" />
              <AppointmentRow time="11:00" client="Marie L." service="Révision complète" />
              <AppointmentRow time="14:30" client="Paul D." service="Changement pneus" />
            </>
          ) : (
            <>
              <AppointmentRow time="08:30" client="Entreprise ABC" service="Installation clim" />
              <AppointmentRow time="13:00" client="Restaurant Le Soleil" service="Maintenance" />
              <AppointmentRow time="16:00" client="Cabinet Dr. Martin" service="Dépannage" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CrmPreview({ isVeloDoctor, t }: { isVeloDoctor: boolean; t: TranslationFn }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{t("pipeline")}</h4>
        <span className="text-xs text-gray-500">{t("dragDrop")}</span>
      </div>

      {/* Kanban Board Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isVeloDoctor ? (
          <>
            <KanbanColumn title={t("kanbanLabels.new")} count={3} color="blue">
              <KanbanCard name="Claire M." info="Vélo électrique" />
              <KanbanCard name="Antoine R." info="Trottinette" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.toCallback")} count={2} color="yellow">
              <KanbanCard name="Julie P." info="Devis envoyé" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.inProgress")} count={4} color="purple">
              <KanbanCard name="Marc D." info="En atelier" />
              <KanbanCard name="Sophie B." info="Pièce commandée" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.done")} count={12} color="green">
              <KanbanCard name="Luc T." info="Livré ✓" />
            </KanbanColumn>
          </>
        ) : (
          <>
            <KanbanColumn title={t("kanbanLabels.prospects")} count={5} color="blue">
              <KanbanCard name="Hôtel Bellevue" info="Demande devis" />
              <KanbanCard name="Boulangerie Martin" info="Premier contact" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.visitPlanned")} count={3} color="yellow">
              <KanbanCard name="Bureau Dupont SA" info="Jeudi 14h" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.quoteSent")} count={6} color="purple">
              <KanbanCard name="Pharmacie Centrale" info="2,400€" />
              <KanbanCard name="Cabinet Avocat" info="1,850€" />
            </KanbanColumn>
            <KanbanColumn title={t("kanbanLabels.signed")} count={9} color="green">
              <KanbanCard name="Resto La Terrasse" info="Installation lundi" />
            </KanbanColumn>
          </>
        )}
      </div>
    </div>
  );
}

function ClientsPreview({ isVeloDoctor, t }: { isVeloDoctor: boolean; t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-400">
          {t("searchClient")}
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("new")}
        </button>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isVeloDoctor ? (
          <>
            <ClientCard name="Thomas Berger" email="thomas.b@email.com" phone="0470 12 34 56" lastVisit="Hier" extra="VTT électrique" />
            <ClientCard name="Marie Lambert" email="marie.l@email.com" phone="0486 78 90 12" lastVisit="Il y a 3 jours" extra="Vélo de ville" />
            <ClientCard name="Paul Dubois" email="paul.d@email.com" phone="0495 34 56 78" lastVisit="Il y a 1 semaine" extra="Trottinette" />
            <ClientCard name="Emma Martin" email="emma.m@email.com" phone="0477 90 12 34" lastVisit="Aujourd'hui" extra="Vélo cargo" />
          </>
        ) : (
          <>
            <ClientCard name="Hôtel Bellevue" email="contact@bellevue.be" phone="02 123 45 67" lastVisit="Il y a 2 jours" extra="Multi-split" />
            <ClientCard name="Restaurant Le Soleil" email="info@lesoleil.be" phone="02 234 56 78" lastVisit="Hier" extra="Gainable" />
            <ClientCard name="Cabinet Dr. Martin" email="cabinet@martin.be" phone="02 345 67 89" lastVisit="Aujourd'hui" extra="Split mural" />
            <ClientCard name="Pharmacie Centrale" email="pharma@centrale.be" phone="02 456 78 90" lastVisit="Il y a 5 jours" extra="Cassette" />
          </>
        )}
      </div>
    </div>
  );
}

function AtelierPreview({ t }: { t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Bike className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500">{t("kpiLabels.inRepair")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Timer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-500">{t("kpiLabels.waitingPart")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500">{t("kpiLabels.readyDeliver")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-500">{t("statusLabels.urgent")}</p>
        </div>
      </div>

      {/* Atelier list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-semibold text-gray-700">{t("bikesInWorkshop")}</h4>
          <button className="text-sm text-primary font-medium">{t("add")}</button>
        </div>
        <AtelierRow client="Thomas B." bike="VTT Rockrider" status="repair" task="Changement freins" statusLabel={t("statusLabels.repair")} />
        <AtelierRow client="Marie L." bike="Vélo électrique Decathlon" status="waiting" task="Attente batterie" statusLabel={t("statusLabels.waiting")} />
        <AtelierRow client="Paul D." bike="Trottinette Xiaomi" status="ready" task="Réparation terminée" statusLabel={t("statusLabels.ready")} />
        <AtelierRow client="Sophie K." bike="Vélo de course Giant" status="repair" task="Révision complète" statusLabel={t("statusLabels.repair")} />
        <AtelierRow client="Marc R." bike="Vélo cargo Urban Arrow" status="urgent" task="Panne moteur" statusLabel={t("statusLabels.urgent")} />
      </div>
    </div>
  );
}

function StockPreview({ t }: { t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-400">
          {t("searchPart")}
        </div>
        <select className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 border-0">
          <option>{t("allCategories")}</option>
          <option>Freins</option>
          <option>Pneus</option>
          <option>Transmission</option>
          <option>Électrique</option>
        </select>
      </div>

      {/* Low stock alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <div>
          <p className="text-sm font-medium text-orange-800">3 {t("lowStockItems")}</p>
          <p className="text-xs text-orange-600">Pneus 26", Chambre à air 700c, Patins de frein V-Brake</p>
        </div>
      </div>

      {/* Stock list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-semibold text-gray-700">{t("inventory")}</h4>
          <button className="text-sm text-primary font-medium">{t("newPart")}</button>
        </div>
        <StockRow name="Pneu VTT 27.5&quot;" category="Pneus" stock={12} minStock={5} price="24.90€" />
        <StockRow name="Chambre à air 700c" category="Pneus" stock={3} minStock={10} price="8.50€" lowStock />
        <StockRow name="Chaîne Shimano 8v" category="Transmission" stock={8} minStock={4} price="18.00€" />
        <StockRow name="Patins frein V-Brake" category="Freins" stock={2} minStock={6} price="12.00€" lowStock />
        <StockRow name="Batterie Bosch 500Wh" category="Électrique" stock={2} minStock={2} price="549.00€" />
      </div>
    </div>
  );
}

function RdvPreview({ t }: { t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
        <button className="text-gray-400 hover:text-gray-600">{t("prevWeek")}</button>
        <span className="font-semibold text-gray-700">27 Jan - 2 Fév 2024</span>
        <button className="text-gray-400 hover:text-gray-600">{t("nextWeek")}</button>
      </div>

      {/* Calendar view */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 border-b border-gray-100">
          {["Lun 27", "Mar 28", "Mer 29", "Jeu 30", "Ven 31"].map((day, i) => (
            <div key={day} className={`p-3 text-center text-sm font-medium ${i === 1 ? "bg-primary/10 text-primary" : "text-gray-600"}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 min-h-[250px]">
          {/* Lundi */}
          <div className="border-r border-gray-100 p-2 space-y-2">
            <RdvCard time="09:00" client="Hôtel Bellevue" type="Installation" />
            <RdvCard time="14:00" client="Bureau ABC" type="Maintenance" />
          </div>
          {/* Mardi - aujourd'hui */}
          <div className="border-r border-gray-100 p-2 space-y-2 bg-primary/5">
            <RdvCard time="08:30" client="Entreprise XYZ" type="Dépannage" urgent />
            <RdvCard time="11:00" client="Resto Le Midi" type="Visite" />
            <RdvCard time="15:30" client="Pharmacie Plus" type="Installation" />
          </div>
          {/* Mercredi */}
          <div className="border-r border-gray-100 p-2 space-y-2">
            <RdvCard time="10:00" client="Cabinet Med" type="Maintenance" />
          </div>
          {/* Jeudi */}
          <div className="border-r border-gray-100 p-2 space-y-2">
            <RdvCard time="09:00" client="Boulangerie" type="Installation" />
            <RdvCard time="13:00" client="Salon Coiffure" type="Visite" />
          </div>
          {/* Vendredi */}
          <div className="p-2 space-y-2">
            <RdvCard time="08:00" client="Supermarché" type="Maintenance" />
            <RdvCard time="14:00" client="Crèche Les Petits" type="Installation" />
          </div>
        </div>
      </div>

      {/* Add RDV button */}
      <button className="w-full bg-accent hover:bg-accent-light text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-5 h-5" />
        {t("planNewRdv")}
      </button>
    </div>
  );
}

function DevisPreview({ isVeloDoctor, t }: { isVeloDoctor: boolean; t: TranslationFn }) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatusBadge label={t("kpiLabels.all")} count={isVeloDoctor ? 18 : 31} active />
        <StatusBadge label={t("statusLabels.draft")} count={isVeloDoctor ? 2 : 4} />
        <StatusBadge label={t("statusLabels.sent")} count={isVeloDoctor ? 5 : 12} />
        <StatusBadge label={t("statusLabels.accepted")} count={isVeloDoctor ? 11 : 15} />
      </div>

      {/* Create quote CTA */}
      <div className="bg-gradient-to-r from-accent to-accent-light rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold">{t("createIn2Clicks")}</h4>
          <p className="text-white/80 text-sm">{t("createDesc")}</p>
        </div>
        <button className="bg-white text-accent px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-shadow">
          <Plus className="w-4 h-4" />
          {t("newQuote")}
        </button>
      </div>

      {/* Quote list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isVeloDoctor ? (
          <>
            <QuoteRow number="VD-2024-056" client="Thomas B." amount="185€" status="accepted" statusLabel={t("statusLabels.accepted")} />
            <QuoteRow number="VD-2024-055" client="Marie L." amount="420€" status="sent" statusLabel={t("statusLabels.sent")} />
            <QuoteRow number="VD-2024-054" client="Paul D." amount="95€" status="accepted" statusLabel={t("statusLabels.accepted")} />
            <QuoteRow number="VD-2024-053" client="Emma M." amount="310€" status="draft" statusLabel={t("statusLabels.draft")} />
          </>
        ) : (
          <>
            <QuoteRow number="AC-2024-089" client="Hôtel Bellevue" amount="4,200€" status="accepted" statusLabel={t("statusLabels.accepted")} />
            <QuoteRow number="AC-2024-088" client="Restaurant Le Soleil" amount="2,850€" status="sent" statusLabel={t("statusLabels.sent")} />
            <QuoteRow number="AC-2024-087" client="Cabinet Dr. Martin" amount="1,650€" status="sent" statusLabel={t("statusLabels.sent")} />
            <QuoteRow number="AC-2024-086" client="Pharmacie Centrale" amount="3,100€" status="draft" statusLabel={t("statusLabels.draft")} />
          </>
        )}
      </div>

      {/* Auto features */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span>{t("autoEmailSend")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{t("autoReminder3d")}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>{t("eSignature")}</span>
        </div>
      </div>
    </div>
  );
}

function FinancesPreview({ isVeloDoctor, t }: { isVeloDoctor: boolean; t: TranslationFn }) {
  const months = t.raw("months") as string[];

  return (
    <div className="space-y-4">
      {/* Month selector */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
        <button className="text-gray-400 hover:text-gray-600">←</button>
        <span className="font-semibold text-gray-700">Janvier 2024</span>
        <button className="text-gray-400 hover:text-gray-600">→</button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isVeloDoctor ? (
          <>
            <FinanceCard label={t("kpiLabels.acceptedRevenue")} value="3,840€" trend="+12%" positive />
            <FinanceCard label={t("kpiLabels.conversionRate")} value="68%" trend="+3%" positive />
            <FinanceCard label={t("kpiLabels.quotesCreated")} value="16" trend="+2" positive />
            <FinanceCard label={t("kpiLabels.avgBasket")} value="142€" trend="+8%" positive />
          </>
        ) : (
          <>
            <FinanceCard label={t("kpiLabels.acceptedRevenue")} value="18,650€" trend="+22%" positive />
            <FinanceCard label={t("kpiLabels.conversionRate")} value="74%" trend="+6%" positive />
            <FinanceCard label={t("kpiLabels.quotesCreated")} value="24" trend="+5" positive />
            <FinanceCard label={t("kpiLabels.avgBasket")} value="2,180€" trend="-3%" positive={false} />
          </>
        )}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">{t("revenueEvolution")}</h4>
        <div className="h-32 flex items-end gap-2">
          {(isVeloDoctor
            ? [30, 45, 35, 60, 40, 70, 55, 75, 50, 65, 55, 80]
            : [50, 75, 55, 90, 65, 100, 85, 110, 70, 95, 80, 120]
          ).map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {months.map((month, i) => (
            <span key={i}>{month}</span>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="text-center">
        <button className="text-sm text-primary hover:underline">
          {t("exportCsv")}
        </button>
      </div>
    </div>
  );
}

// Sub-components
function KpiCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-lg ${colors[color as keyof typeof colors]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, highlight }: { icon: any; label: string; highlight?: boolean }) {
  return (
    <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      highlight
        ? "bg-accent text-white hover:bg-accent-light"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function AppointmentRow({ time, client, service }: { time: string; client: string; service: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
      <span className="text-sm font-mono text-primary font-semibold">{time}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{client}</p>
        <p className="text-xs text-gray-500">{service}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
}

function KanbanColumn({ title, count, color, children }: { title: string; count: number; color: string; children: React.ReactNode }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
  };
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${colors[color as keyof typeof colors]}`}>{title}</span>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KanbanCard({ name, info }: { name: string; info: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{info}</p>
    </div>
  );
}

function ClientCard({ name, email, phone, lastVisit, extra }: { name: string; email: string; phone: string; lastVisit: string; extra?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{phone}</p>
          {extra && <p className="text-xs text-primary mt-1">{extra}</p>}
        </div>
        <span className="text-xs text-gray-400">{lastVisit}</span>
      </div>
    </div>
  );
}

function StatusBadge({ label, count, active }: { label: string; count: number; active?: boolean }) {
  return (
    <button className={`rounded-xl p-3 text-center transition-all ${
      active ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"
    }`}>
      <p className="text-lg font-bold">{count}</p>
      <p className="text-xs">{label}</p>
    </button>
  );
}

function QuoteRow({ number, client, amount, status, statusLabel }: { number: string; client: string; amount: string; status: string; statusLabel: string }) {
  const statusStyles = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-600",
    accepted: "bg-green-100 text-green-600",
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
      <div>
        <p className="text-sm font-semibold text-gray-900">{number}</p>
        <p className="text-xs text-gray-500">{client}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900">{amount}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

function FinanceCard({ label, value, trend, positive }: { label: string; value: string; trend: string; positive: boolean }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className={`text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
        {trend}
      </p>
    </div>
  );
}

function AtelierRow({ client, bike, status, task, statusLabel }: { client: string; bike: string; status: string; task: string; statusLabel: string }) {
  const statusStyles = {
    repair: { bg: "bg-blue-100", text: "text-blue-700" },
    waiting: { bg: "bg-orange-100", text: "text-orange-700" },
    ready: { bg: "bg-green-100", text: "text-green-700" },
    urgent: { bg: "bg-red-100", text: "text-red-700" },
  };
  const style = statusStyles[status as keyof typeof statusStyles];
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{client}</p>
        <p className="text-xs text-gray-500">{bike}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-600 mb-1">{task}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

function StockRow({ name, category, stock, minStock, price, lowStock }: { name: string; category: string; stock: number; minStock: number; price: string; lowStock?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-0 ${lowStock ? "bg-orange-50" : "hover:bg-gray-50"}`}>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="text-center px-4">
        <p className={`text-lg font-bold ${lowStock ? "text-orange-600" : "text-gray-900"}`}>{stock}</p>
        <p className="text-xs text-gray-400">min: {minStock}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{price}</p>
      </div>
    </div>
  );
}

function RdvCard({ time, client, type, urgent }: { time: string; client: string; type: string; urgent?: boolean }) {
  return (
    <div className={`rounded-lg p-2 text-xs ${urgent ? "bg-red-100 border border-red-200" : "bg-blue-50 border border-blue-100"}`}>
      <p className={`font-semibold ${urgent ? "text-red-700" : "text-blue-700"}`}>{time}</p>
      <p className="text-gray-700 font-medium truncate">{client}</p>
      <p className="text-gray-500">{type}</p>
    </div>
  );
}
