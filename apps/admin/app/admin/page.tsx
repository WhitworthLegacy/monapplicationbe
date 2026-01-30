"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/Card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Phone,
  Mail,
  Target,
  Zap,
  Activity,
} from "lucide-react";

interface DashboardData {
  kpis: {
    totalClients: number;
    totalClientsChange: number;
    appointmentsToday: number;
    appointmentsWeek: number;
    quotesPending: number;
    quotesThisMonth: number;
    conversionRate: number;
    conversionChange: number;
    revenue: number;
    revenueChange: number;
    avgDealSize: number;
  };
  revenueChart: { label: string; value: number }[];
  clientGrowthChart: { label: string; value: number }[];
  leadSourcesChart: { label: string; value: number; color: string }[];
  conversionFunnel: { label: string; value: number; color: string }[];
  recentActivity: {
    id: string;
    type: string;
    description: string;
    time: string;
    icon: any;
  }[];
  upcomingAppointments: {
    id: string;
    client_name: string;
    scheduled_at: string;
    appointment_type: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createBrowserClient();

      try {
        // Fetch all data in parallel
        const [
          { data: clients },
          { data: appointments },
          { data: quotes },
        ] = await Promise.all([
          supabase.from("clients").select("*").order("created_at", { ascending: true }),
          supabase.from("appointments").select("*").order("scheduled_at", { ascending: false }),
          supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        ]);

        // Calculate KPIs
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const totalClients = clients?.length || 0;
        const clientsLastMonth = clients?.filter(c =>
          new Date(c.created_at || '') >= startOfLastMonth &&
          new Date(c.created_at || '') <= endOfLastMonth
        ).length || 0;
        const clientsThisMonth = clients?.filter(c =>
          new Date(c.created_at || '') >= startOfMonth
        ).length || 0;
        const totalClientsChange = clientsLastMonth > 0
          ? ((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100
          : 0;

        const appointmentsToday = appointments?.filter(a =>
          new Date(a.scheduled_at) >= startOfToday &&
          new Date(a.scheduled_at) <= endOfToday
        ).length || 0;

        const appointmentsWeek = appointments?.filter(a =>
          new Date(a.scheduled_at) >= startOfWeek
        ).length || 0;

        const quotesPending = quotes?.filter(q => q.status === 'draft' || q.status === 'sent').length || 0;
        const quotesThisMonth = quotes?.filter(q =>
          new Date(q.created_at || '') >= startOfMonth
        ).length || 0;

        const totalQuotes = quotes?.length || 0;
        const acceptedQuotes = quotes?.filter(q => q.status === 'accepted').length || 0;
        const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;

        const revenue = quotes
          ?.filter(q => q.status === 'accepted')
          .reduce((sum, q) => sum + ((q.total || 0) / 100), 0) || 0;

        const revenueLastMonth = quotes
          ?.filter(q => q.status === 'accepted' && new Date(q.accepted_at || '') >= startOfLastMonth && new Date(q.accepted_at || '') <= endOfLastMonth)
          .reduce((sum, q) => sum + ((q.total || 0) / 100), 0) || 0;

        const revenueThisMonth = quotes
          ?.filter(q => q.status === 'accepted' && new Date(q.accepted_at || '') >= startOfMonth)
          .reduce((sum, q) => sum + ((q.total || 0) / 100), 0) || 0;

        const revenueChange = revenueLastMonth > 0
          ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
          : 0;

        const avgDealSize = acceptedQuotes > 0 ? revenue / acceptedQuotes : 0;

        // Revenue chart (last 6 months)
        const revenueByMonth: { [key: string]: number } = {};
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${monthNames[date.getMonth()]}`;
          revenueByMonth[monthKey] = 0;
        }

        quotes?.filter(q => q.status === 'accepted').forEach(q => {
          const date = new Date(q.accepted_at || '');
          const monthKey = `${monthNames[date.getMonth()]}`;
          if (monthKey in revenueByMonth) {
            revenueByMonth[monthKey] += (q.total || 0) / 100;
          }
        });

        const revenueChart = Object.entries(revenueByMonth).map(([label, value]) => ({
          label,
          value: Math.round(value),
        }));

        // Client growth chart (last 6 months)
        const clientsByMonth: { [key: string]: number } = {};
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${monthNames[date.getMonth()]}`;
          clientsByMonth[monthKey] = 0;
        }

        clients?.forEach(c => {
          const date = new Date(c.created_at || '');
          const monthKey = `${monthNames[date.getMonth()]}`;
          if (monthKey in clientsByMonth) {
            clientsByMonth[monthKey]++;
          }
        });

        const clientGrowthChart = Object.entries(clientsByMonth).map(([label, value]) => ({
          label,
          value,
        }));

        // Lead sources
        const sourceCount: { [key: string]: number } = {};
        clients?.forEach(c => {
          const source = c.source || 'Inconnu';
          sourceCount[source] = (sourceCount[source] || 0) + 1;
        });

        const colors = ['#1e3a8a', '#b8860b', '#059669', '#dc2626', '#7c3aed'];
        const leadSourcesChart = Object.entries(sourceCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([label, value], i) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value,
            color: colors[i] || '#64748b',
          }));

        // Conversion funnel
        const prospectCount = clients?.filter(c => c.crm_stage === 'prospect').length || 0;
        const proposalCount = clients?.filter(c => c.crm_stage === 'proposal').length || 0;
        const wonCount = clients?.filter(c => c.crm_stage === 'closed_won').length || 0;

        const conversionFunnel = [
          { label: 'Prospects', value: prospectCount, color: '#64748b' },
          { label: 'Devis', value: proposalCount, color: '#f59e0b' },
          { label: 'Gagnés', value: wonCount, color: '#10b981' },
        ];

        // Recent activity (mock for now - would come from activities table)
        const recentActivity = [
          {
            id: '1',
            type: 'client',
            description: 'Nouveau client ajouté',
            time: 'Il y a 2h',
            icon: Users,
          },
          {
            id: '2',
            type: 'quote',
            description: 'Devis accepté - 3 500€',
            time: 'Il y a 4h',
            icon: FileText,
          },
          {
            id: '3',
            type: 'appointment',
            description: 'RDV confirmé pour demain',
            time: 'Il y a 5h',
            icon: Calendar,
          },
        ];

        // Upcoming appointments
        const upcomingAppointments = appointments
          ?.filter(a => new Date(a.scheduled_at) > new Date())
          .slice(0, 5)
          .map(a => ({
            id: a.id,
            client_name: a.client_name || 'Client inconnu',
            scheduled_at: a.scheduled_at,
            appointment_type: a.appointment_type,
          })) || [];

        setData({
          kpis: {
            totalClients,
            totalClientsChange,
            appointmentsToday,
            appointmentsWeek,
            quotesPending,
            quotesThisMonth,
            conversionRate,
            conversionChange: 0, // Would calculate from historical data
            revenue,
            revenueChange,
            avgDealSize,
          },
          revenueChart,
          clientGrowthChart,
          leadSourcesChart,
          conversionFunnel,
          recentActivity,
          upcomingAppointments,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        {/* Skeleton loader */}
        <div className="animate-pulse">
          <div className="h-12 w-96 bg-[#e2e8f0] rounded-lg mb-3"></div>
          <div className="h-6 w-64 bg-[#e2e8f0] rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-[#e2e8f0] rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-[#e2e8f0] rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Clients",
      value: data.kpis.totalClients,
      change: data.kpis.totalClientsChange,
      icon: Users,
      gradient: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      href: "/admin/clients",
    },
    {
      title: "RDV Aujourd'hui",
      value: data.kpis.appointmentsToday,
      subtitle: `${data.kpis.appointmentsWeek} cette semaine`,
      icon: Calendar,
      gradient: "from-emerald-500/10 to-emerald-600/10",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      href: "/admin/appointments",
    },
    {
      title: "Devis en Attente",
      value: data.kpis.quotesPending,
      subtitle: `${data.kpis.quotesThisMonth} ce mois`,
      icon: FileText,
      gradient: "from-amber-500/10 to-amber-600/10",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      href: "/admin/quotes",
    },
    {
      title: "Taux Conversion",
      value: `${data.kpis.conversionRate.toFixed(1)}%`,
      change: data.kpis.conversionChange,
      icon: Target,
      gradient: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      href: "/admin/crm",
    },
    {
      title: "Revenu Total",
      value: `${Math.round(data.kpis.revenue).toLocaleString('fr-FR')} €`,
      change: data.kpis.revenueChange,
      icon: DollarSign,
      gradient: "from-[#b8860b]/10 to-[#d4a72c]/10",
      iconColor: "text-[#b8860b]",
      iconBg: "bg-[#b8860b]/20",
      href: "/admin/quotes",
    },
    {
      title: "Taille Moy. Deal",
      value: `${Math.round(data.kpis.avgDealSize).toLocaleString('fr-FR')} €`,
      icon: TrendingUp,
      gradient: "from-cyan-500/10 to-cyan-600/10",
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      href: "/admin/quotes",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#b8860b]" />
            <span className="text-sm font-semibold text-[#b8860b]">Tableau de bord</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Bienvenue de retour ! 👋
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Voici un aperçu de vos performances et de votre activité récente
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b8860b]/20 rounded-full blur-3xl"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi, index) => (
          <Link key={index} href={kpi.href}>
            <Card className={`group hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br ${kpi.gradient} hover:scale-[1.02] cursor-pointer`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${kpi.iconBg} group-hover:scale-110 transition-transform`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                  </div>
                  {kpi.change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                      kpi.change >= 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {kpi.change >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {Math.abs(kpi.change).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#64748b] mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-[#0f172a] mb-1">
                    {kpi.value}
                  </p>
                  {kpi.subtitle && (
                    <p className="text-xs text-[#94a3b8]">{kpi.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Évolution du Revenu</h3>
                <p className="text-sm text-[#64748b]">6 derniers mois</p>
              </div>
              <div className="p-2 rounded-lg bg-[#b8860b]/10">
                <DollarSign className="w-5 h-5 text-[#b8860b]" />
              </div>
            </div>
            <LineChart
              data={data.revenueChart}
              height={250}
              color="#b8860b"
              showGrid
              showLabels
            />
          </CardContent>
        </Card>

        {/* Client Growth */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Croissance Clients</h3>
                <p className="text-sm text-[#64748b]">6 derniers mois</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <LineChart
              data={data.clientGrowthChart}
              height={250}
              color="#1e3a8a"
              showGrid
              showLabels
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Sources */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Sources de Leads</h3>
                <p className="text-sm text-[#64748b]">Top 5 sources</p>
              </div>
              <Activity className="w-5 h-5 text-[#64748b]" />
            </div>
            <BarChart data={data.leadSourcesChart} height={220} showValues />
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#0f172a]">Pipeline CRM</h3>
              <p className="text-sm text-[#64748b]">Répartition des stages</p>
            </div>
            <DonutChart
              data={data.conversionFunnel}
              size={180}
              strokeWidth={35}
              centerText="Total"
              centerValue={`${data.conversionFunnel.reduce((s, d) => s + d.value, 0)}`}
              showLegend
            />
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Prochains RDV</h3>
                <p className="text-sm text-[#64748b]">{data.upcomingAppointments.length} à venir</p>
              </div>
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              {data.upcomingAppointments.length > 0 ? (
                data.upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] truncate">
                        {apt.client_name}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        {new Date(apt.scheduled_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#94a3b8] text-center py-8">
                  Aucun rendez-vous à venir
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/admin/clients">
              <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#e2e8f0] hover:border-[#1e3a8a] hover:shadow-lg transition-all duration-200 group">
                <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#0f172a]">Nouveau Client</p>
                  <p className="text-sm text-[#64748b]">Ajouter au CRM</p>
                </div>
              </button>
            </Link>
            <Link href="/admin/appointments">
              <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#e2e8f0] hover:border-emerald-600 hover:shadow-lg transition-all duration-200 group">
                <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#0f172a]">Planifier RDV</p>
                  <p className="text-sm text-[#64748b]">Nouveau rendez-vous</p>
                </div>
              </button>
            </Link>
            <Link href="/admin/quotes">
              <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#e2e8f0] hover:border-[#b8860b] hover:shadow-lg transition-all duration-200 group">
                <div className="p-3 rounded-lg bg-[#b8860b]/10 group-hover:bg-[#b8860b]/20 transition-colors">
                  <FileText className="w-6 h-6 text-[#b8860b]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#0f172a]">Créer Devis</p>
                  <p className="text-sm text-[#64748b]">Nouveau devis rapide</p>
                </div>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
