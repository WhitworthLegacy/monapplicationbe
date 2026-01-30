"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Activity {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

const actionColors: Record<
  string,
  "success" | "warning" | "danger" | "info" | "default"
> = {
  create: "success",
  update: "info",
  delete: "danger",
  view: "default",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuperAdmin } = useUserRole();

  useEffect(() => {
    if (!isSuperAdmin) {
      setIsLoading(false);
      return;
    }

    const fetchActivities = async () => {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("activity_logs")
        .select("*, user:profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) {
        setActivities(data);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, [isSuperAdmin]);

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Accès non autorisé. Cette page est réservée aux super
                administrateurs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Journal d'activité
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{activities.length} activités récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.user?.full_name ||
                        activity.user?.email ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={actionColors[activity.action] || "default"}
                      >
                        {activity.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.entity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.entity_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {activity.metadata &&
                      typeof activity.metadata === "object" ? (
                        <pre className="text-xs bg-gray-50 p-2 rounded">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
