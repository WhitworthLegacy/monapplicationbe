"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface KPIData {
  totalClients: number;
  appointmentsToday: number;
  quotesPending: number;
  conversionRate: number;
  revenue: number;
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIData>({
    totalClients: 0,
    appointmentsToday: 0,
    quotesPending: 0,
    conversionRate: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      const supabase = createBrowserClient();

      try {
        const [
          { count: totalClients },
          { data: appointments },
          { count: quotesPending },
          { data: quotes },
        ] = await Promise.all([
          supabase.from("clients").select("*", { count: "exact", head: true }),
          supabase
            .from("appointments")
            .select("*")
            .gte("scheduled_at", new Date().toISOString().split("T")[0])
            .lt(
              "scheduled_at",
              new Date(Date.now() + 86400000).toISOString().split("T")[0],
            ),
          supabase
            .from("quotes")
            .select("*", { count: "exact", head: true })
            .eq("status", "draft"),
          supabase.from("quotes").select("total, status"),
        ]);

        const totalQuotes = quotes?.length || 0;
        const closedQuotes =
          quotes?.filter((q) => q.status === "accepted").length || 0;
        const conversionRate =
          totalQuotes > 0 ? (closedQuotes / totalQuotes) * 100 : 0;

        const revenue =
          quotes
            ?.filter((q) => q.status === "accepted")
            .reduce((sum, q) => sum + ((q.total || 0) / 100), 0) || 0;

        setKpis({
          totalClients: totalClients || 0,
          appointmentsToday: appointments?.length || 0,
          quotesPending: quotesPending || 0,
          conversionRate,
          revenue,
        });
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-12 w-96 bg-linear-to-r from-primary to-accent bg-clip-text animate-pulse rounded mb-2"></div>
          <div className="h-6 w-64 bg-text-muted/20 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="h-24 bg-background rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Clients",
      value: kpis.totalClients,
      change: "+12%",
      isPositive: true,
      icon: Users,
      gradient: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      href: "/admin/clients",
    },
    {
      title: "Rendez-vous Aujourd'hui",
      value: kpis.appointmentsToday,
      change: "+8%",
      isPositive: true,
      icon: Calendar,
      gradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      href: "/admin/appointments",
    },
    {
      title: "Devis en Attente",
      value: kpis.quotesPending,
      change: "-3%",
      isPositive: false,
      icon: FileText,
      gradient: "from-amber-50 to-orange-50",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      href: "/admin/quotes",
    },
    {
      title: "Taux de Conversion",
      value: `${kpis.conversionRate.toFixed(1)}%`,
      change: "+5%",
      isPositive: true,
      icon: TrendingUp,
      gradient: "from-purple-50 to-violet-50",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      href: "/admin/crm",
    },
    {
      title: "Revenu Total",
      value: `${kpis.revenue.toLocaleString("fr-FR")} €`,
      change: "+18%",
      isPositive: true,
      icon: DollarSign,
      gradient: "from-accent/10 to-accent/20",
      iconColor: "text-accent",
      iconBg: "bg-accent/20",
      href: "/admin/quotes",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Bienvenue sur votre Dashboard
        </h1>
        <p className="text-text-muted text-lg">
          Vue d'ensemble de votre activité et performances
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpiCards.map((kpi, index) => (
          <Link key={index} href={kpi.href}>
            <Card
              className={`overflow-hidden border-2 bg-linear-to-br ${kpi.gradient} hover:shadow-lg transition-all duration-300 group cursor-pointer`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      kpi.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-text">
                    {kpi.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-2">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-text mb-6">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-background hover:border-accent hover:bg-accent/5 transition-all duration-200 group">
              <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-text">Nouveau Client</p>
                <p className="text-sm text-text-muted">Ajouter un client</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-background hover:border-primary hover:bg-primary/5 transition-all duration-200 group">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-text">Rendez-vous</p>
                <p className="text-sm text-text-muted">Planifier un RDV</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-background hover:border-secondary hover:bg-secondary/5 transition-all duration-200 group">
              <div className="p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-text">Créer Devis</p>
                <p className="text-sm text-text-muted">Nouveau devis</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
