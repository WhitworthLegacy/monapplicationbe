import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { ADMIN_ROLES, STAFF_ROLES, MANAGER_ROLES } from "./roles";

interface AuthResult {
  error?: NextResponse;
  supabase?: any;
  userId?: string;
  role?: string;
  profile?: any;
}

async function requireRole(
  request: NextRequest,
  allowedRoles: Set<string>,
): Promise<AuthResult> {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.has(profile.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { supabase, userId: user.id, role: profile.role, profile };
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  return requireRole(request, ADMIN_ROLES);
}

export async function requireStaff(request: NextRequest): Promise<AuthResult> {
  return requireRole(request, STAFF_ROLES);
}

export async function requireManager(
  request: NextRequest,
): Promise<AuthResult> {
  return requireRole(request, MANAGER_ROLES);
}

export async function getAuthUser(request: NextRequest): Promise<AuthResult> {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      error: NextResponse.json({ error: "Profile not found" }, { status: 404 }),
    };
  }

  return { supabase, userId: user.id, role: profile.role, profile };
}
