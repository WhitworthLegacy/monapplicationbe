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
      <aside className="w-64 bg-primary text-white min-h-screen">
        <div className="p-4">
          <div className="h-8 bg-secondary rounded animate-pulse mb-6"></div>
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-secondary rounded animate-pulse"
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
    <aside className="w-64 bg-linear-to-b from-primary via-primary to-secondary text-white min-h-screen flex flex-col">
      <div className="p-4">
        <div className="mb-6">
          {/* Logo 9 dots - même que web */}
          <Link href="/admin" className="flex items-center gap-3 group mb-4">
            <div className="grid grid-cols-3 gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors border border-white/20" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors border border-white/20" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors border border-white/20" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors border border-white/20" />
              <div className="w-3 h-3 rounded-sm bg-accent group-hover:bg-accent-light transition-colors" />
              <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-primary/80 transition-colors border border-white/20" />
              <div className="w-3 h-3 rounded-sm bg-secondary group-hover:bg-secondary/80 transition-colors border border-white/20" />
            </div>
            <span className="font-semibold text-lg">Admin</span>
          </Link>
          {profile && (
            <p className="text-sm text-gray-300 mt-1">
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
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/10">
        <button
          onClick={async () => {
            const { createBrowserClient } =
              await import("@/lib/supabase/client");
            const supabase = createBrowserClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          <span className="mr-3 text-lg">🚪</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
