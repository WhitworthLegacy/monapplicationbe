export const ADMIN_ROLES = new Set(["super_admin", "admin"]);
export const STAFF_ROLES = new Set([
  "super_admin",
  "admin",
  "manager",
  "marketing",
  "staff",
]);
export const MANAGER_ROLES = new Set(["super_admin", "admin", "manager"]);
export const MARKETING_ROLES = new Set(["super_admin", "admin", "marketing"]);

export type UserRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "marketing"
  | "staff";

export interface RolePermissions {
  canAccessDashboard: boolean;
  canAccessCRM: boolean;
  canAccessClients: boolean;
  canAccessAppointments: boolean;
  canAccessQuotes: boolean;
  canManageUsers: boolean;
  canAccessFinances: boolean;
  canAccessActivities: boolean;
  canAccessSettings: boolean;
  canExportData: boolean;
}

export function getRolePermissions(role: UserRole | null): RolePermissions {
  if (!role) {
    return {
      canAccessDashboard: false,
      canAccessCRM: false,
      canAccessClients: false,
      canAccessAppointments: false,
      canAccessQuotes: false,
      canManageUsers: false,
      canAccessFinances: false,
      canAccessActivities: false,
      canAccessSettings: false,
      canExportData: false,
    };
  }

  const isSuperAdmin = role === "super_admin";
  const isAdmin = ADMIN_ROLES.has(role);
  const isManager = MANAGER_ROLES.has(role);
  const isStaff = STAFF_ROLES.has(role);

  return {
    canAccessDashboard: isStaff,
    canAccessCRM: isManager,
    canAccessClients: isStaff,
    canAccessAppointments: isStaff,
    canAccessQuotes: isManager || role === "marketing",
    canManageUsers: isAdmin,
    canAccessFinances: isSuperAdmin,
    canAccessActivities: isSuperAdmin,
    canAccessSettings: isManager,
    canExportData: isManager,
  };
}
