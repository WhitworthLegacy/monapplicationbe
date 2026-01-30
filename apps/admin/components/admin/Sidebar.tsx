"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import type { RolePermissions } from "@/lib/auth/roles";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  permission: keyof RolePermissions;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "📊",
    permission: "canAccessDashboard",
  },
  { label: "CRM", href: "/admin/crm", icon: "🎯", permission: "canAccessCRM" },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: "👥",
    permission: "canAccessClients",
  },
  {
    label: "Rendez-vous",
    href: "/admin/appointments",
    icon: "📅",
    permission: "canAccessAppointments",
  },
  {
    label: "Devis",
    href: "/admin/quotes",
    icon: "📄",
    permission: "canAccessQuotes",
  },
  {
    label: "Activité",
    href: "/admin/activities",
    icon: "📝",
    permission: "canAccessActivities",
  },
  {
    label: "Paramètres",
    href: "/admin/settings",
    icon: "⚙️",
    permission: "canAccessSettings",
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { permissions, profile, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <aside className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-4">
          <div className="h-8 bg-gray-700 rounded animate-pulse mb-6"></div>
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const filteredNavItems = navItems.filter(
    (item) => permissions[item.permission],
  );

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          {profile && (
            <p className="text-sm text-gray-400 mt-1">
              {profile.full_name || profile.email}
            </p>
          )}
        </div>

        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-800">
        <button
          onClick={async () => {
            const { createBrowserClient } =
              await import("@/lib/supabase/client");
            const supabase = createBrowserClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <span className="mr-3 text-lg">🚪</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
