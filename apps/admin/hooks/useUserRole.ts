"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  getRolePermissions,
  RolePermissions,
  UserRole,
} from "@/lib/auth/roles";

export interface UseUserRoleReturn {
  role: UserRole | null;
  permissions: RolePermissions;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  profile: any;
}

export function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    const fetchUserRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setRole(profileData.role as UserRole);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const permissions = getRolePermissions(role);

  return {
    role,
    permissions,
    isLoading,
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "super_admin" || role === "admin",
    isManager: role === "super_admin" || role === "admin" || role === "manager",
    isStaff: !!role,
    profile,
  };
}
