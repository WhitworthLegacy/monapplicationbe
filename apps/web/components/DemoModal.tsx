"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutDashboard,
  Users,
  FileText,
  PiggyBank,
  Kanban,
  Plus,
  TrendingUp,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  Send,
  Euro,
  ChevronRight,
  Zap,
  MousePointerClick,
} from "lucide-react";

type TabType = "dashboard" | "crm" | "clients" | "devis" | "finances";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectColor: string;
}

const tabs = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
  { id: "crm" as TabType, label: "CRM", icon: Kanban },
  { id: "clients" as TabType, label: "Clients", icon: Users },
  { id: "devis" as TabType, label: "Devis", icon: FileText },
  { id: "finances" as TabType, label: "Finances", icon: PiggyBank },
];

export function DemoModal({ isOpen, onClose, projectName, projectColor }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

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
              <p className="text-white/80 text-sm">Aperçu de l'interface admin</p>
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
            {activeTab === "dashboard" && <DashboardPreview />}
            {activeTab === "crm" && <CrmPreview />}
            {activeTab === "clients" && <ClientsPreview />}
            {activeTab === "devis" && <DevisPreview />}
            {activeTab === "finances" && <FinancesPreview />}
          </div>

          {/* Footer with benefits */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Zap className="w-4 h-4" />
                <span>Mails automatiques</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <MousePointerClick className="w-4 h-4" />
                <span>Devis en 2 clics</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Clock className="w-4 h-4" />
                <span>10h gagnées/semaine</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardPreview() {
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Calendar} label="RDV aujourd'hui" value="8" color="blue" />
        <KpiCard icon={Users} label="Nouveaux clients" value="12" color="green" />
        <KpiCard icon={FileText} label="Devis en attente" value="5" color="orange" />
        <KpiCard icon={Euro} label="CA ce mois" value="4.2K€" color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions rapides</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <QuickActionButton icon={Plus} label="Nouveau client" />
          <QuickActionButton icon={FileText} label="Créer un devis" highlight />
          <QuickActionButton icon={Calendar} label="Planifier RDV" />
          <QuickActionButton icon={Mail} label="Envoyer rappel" />
        </div>
      </div>

      {/* Today's appointments preview */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Prochains RDV</h4>
        <div className="space-y-2">
          <AppointmentRow time="09:00" client="Martin D." service="Intervention" />
          <AppointmentRow time="11:30" client="Sophie L." service="Devis sur place" />
          <AppointmentRow time="14:00" client="Jean P." service="Installation" />
        </div>
      </div>
    </div>
  );
}

function CrmPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">Pipeline commercial</h4>
        <span className="text-xs text-gray-500">Glissez-déposez pour changer le statut</span>
      </div>

      {/* Kanban Board Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KanbanColumn title="Nouveaux" count={4} color="blue">
          <KanbanCard name="Marie B." info="Demande de devis" />
          <KanbanCard name="Pierre M." info="Premier contact" />
        </KanbanColumn>
        <KanbanColumn title="À contacter" count={3} color="yellow">
          <KanbanCard name="Lucas T." info="Rappeler demain" />
        </KanbanColumn>
        <KanbanColumn title="Devis envoyé" count={5} color="purple">
          <KanbanCard name="Emma R." info="850€ - En attente" />
          <KanbanCard name="Hugo D." info="1200€ - Relancé" />
        </KanbanColumn>
        <KanbanColumn title="Gagné" count={8} color="green">
          <KanbanCard name="Julie K." info="Intervention planifiée" />
        </KanbanColumn>
      </div>
    </div>
  );
}

function ClientsPreview() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-400">
          Rechercher un client...
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau
        </button>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ClientCard
          name="Martin Dupont"
          email="martin.d@email.com"
          phone="0470 12 34 56"
          lastVisit="Il y a 3 jours"
        />
        <ClientCard
          name="Sophie Lambert"
          email="sophie.l@email.com"
          phone="0486 78 90 12"
          lastVisit="Il y a 1 semaine"
        />
        <ClientCard
          name="Jean-Pierre Roux"
          email="jp.roux@email.com"
          phone="0495 34 56 78"
          lastVisit="Il y a 2 semaines"
        />
        <ClientCard
          name="Emma Leroy"
          email="emma.l@email.com"
          phone="0477 90 12 34"
          lastVisit="Aujourd'hui"
        />
      </div>
    </div>
  );
}

function DevisPreview() {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatusBadge label="Tous" count={24} active />
        <StatusBadge label="Brouillon" count={3} />
        <StatusBadge label="Envoyé" count={8} />
        <StatusBadge label="Accepté" count={13} />
      </div>

      {/* Create quote CTA */}
      <div className="bg-gradient-to-r from-accent to-accent-light rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold">Créer un devis en 2 clics</h4>
          <p className="text-white/80 text-sm">Sélectionnez un client, ajoutez les lignes, envoyez !</p>
        </div>
        <button className="bg-white text-accent px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-shadow">
          <Plus className="w-4 h-4" />
          Nouveau devis
        </button>
      </div>

      {/* Quote list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <QuoteRow number="DEV-2024-042" client="Martin D." amount="1,250€" status="accepted" />
        <QuoteRow number="DEV-2024-041" client="Sophie L." amount="890€" status="sent" />
        <QuoteRow number="DEV-2024-040" client="Jean P." amount="2,100€" status="sent" />
        <QuoteRow number="DEV-2024-039" client="Emma L." amount="650€" status="draft" />
      </div>

      {/* Auto features */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span>Email auto à l'envoi</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Relance auto après 3 jours</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Signature électronique</span>
        </div>
      </div>
    </div>
  );
}

function FinancesPreview() {
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
        <FinanceCard label="CA Accepté" value="12,450€" trend="+18%" positive />
        <FinanceCard label="Taux conversion" value="72%" trend="+5%" positive />
        <FinanceCard label="Devis créés" value="18" trend="+3" positive />
        <FinanceCard label="Panier moyen" value="691€" trend="-2%" positive={false} />
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Évolution du CA</h4>
        <div className="h-32 flex items-end gap-2">
          {[40, 65, 45, 80, 55, 90, 75, 95, 60, 85, 70, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Jan</span>
          <span>Fév</span>
          <span>Mar</span>
          <span>Avr</span>
          <span>Mai</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aoû</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Déc</span>
        </div>
      </div>

      {/* Export */}
      <div className="text-center">
        <button className="text-sm text-primary hover:underline">
          Exporter en CSV →
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

function ClientCard({ name, email, phone, lastVisit }: { name: string; email: string; phone: string; lastVisit: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{phone}</p>
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

function QuoteRow({ number, client, amount, status }: { number: string; client: string; amount: string; status: string }) {
  const statusStyles = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-600",
    accepted: "bg-green-100 text-green-600",
  };
  const statusLabels = {
    draft: "Brouillon",
    sent: "Envoyé",
    accepted: "Accepté",
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
          {statusLabels[status as keyof typeof statusLabels]}
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
