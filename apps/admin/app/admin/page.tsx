"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

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
          supabase.from("quotes").select("amount, status"),
        ]);

        const totalQuotes = quotes?.length || 0;
        const closedQuotes =
          quotes?.filter((q) => q.status === "accepted").length || 0;
        const conversionRate =
          totalQuotes > 0 ? (closedQuotes / totalQuotes) * 100 : 0;

        const revenue =
          quotes
            ?.filter((q) => q.status === "accepted")
            .reduce((sum, q) => sum + (q.amount || 0), 0) || 0;

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
      icon: "👥",
      color: "text-blue-600",
    },
    {
      title: "Rendez-vous Aujourd'hui",
      value: kpis.appointmentsToday,
      icon: "📅",
      color: "text-green-600",
    },
    {
      title: "Devis en Attente",
      value: kpis.quotesPending,
      icon: "📄",
      color: "text-yellow-600",
    },
    {
      title: "Taux de Conversion",
      value: `${kpis.conversionRate.toFixed(1)}%`,
      icon: "📈",
      color: "text-purple-600",
    },
    {
      title: "Revenu Total",
      value: `${kpis.revenue.toLocaleString("fr-FR")} €`,
      icon: "💰",
      color: "text-emerald-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${kpi.color}`}>
                    {kpi.value}
                  </p>
                </div>
                <div className="text-4xl">{kpi.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
