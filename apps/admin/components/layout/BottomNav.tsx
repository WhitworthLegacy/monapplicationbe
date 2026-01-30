'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Target,
  Calendar,
  FileText,
  Activity,
  Settings,
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  roles?: string[];
  mobileOnly?: boolean;
};

// Navigation complète avec contrôle de visibilité mobile/desktop
// Ordre logique du workflow:
// 1. Dashboard (vue d'ensemble)
// 2. Clients (gestion clients)
// 3. CRM (pipeline commercial)
// 4. Appointments (rendez-vous)
// 5. Quotes (devis)
// 6. Activities (activités)
// 7. Settings (paramètres)
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Clients', href: '/admin/clients', icon: Users, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { label: 'CRM', href: '/admin/crm', icon: Target, roles: ['super_admin', 'admin', 'manager'] },
  { label: 'RDV', href: '/admin/appointments', icon: Calendar, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { label: 'Devis', href: '/admin/quotes', icon: FileText, roles: ['super_admin', 'admin', 'manager'] },
  { label: 'Activités', href: '/admin/activities', icon: Activity, roles: ['super_admin'] },
  { label: 'Réglages', href: '/admin/settings', icon: Settings, roles: ['super_admin', 'admin'] },
];

export default function BottomNav() {
  const pathname = usePathname() || '';
  const { role } = useUserRole();

  // Filtrer les items selon le rôle de l'utilisateur
  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden lg:block fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* SVG gradient definition for icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="nav-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-[#0f172a]/10 border border-[#e2e8f0]">
        {filteredItems.map((item) => {
          // Home is active only when exactly on /dashboard
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center gap-0.5 md:gap-1
                px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl
                text-[10px] md:text-xs font-medium tracking-wide uppercase whitespace-nowrap
                transition-all duration-300 ease-out min-w-[50px] md:min-w-[60px]
                ${isActive
                  ? 'bg-gradient-to-br from-[#1e3a8a] to-[#b8860b] text-white shadow-lg shadow-[#1e3a8a]/30 scale-105'
                  : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] active:scale-95'
                }
              `}
            >
              <Icon
                className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                style={{ stroke: isActive ? 'white' : 'url(#nav-icon-gradient)' }}
              />
              <span
                className={
                  isActive
                    ? 'font-semibold text-white'
                    : 'font-semibold bg-gradient-to-r from-[#b8860b] to-[#1e3a8a] bg-clip-text text-transparent'
                }
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
