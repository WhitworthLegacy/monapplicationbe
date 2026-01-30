import { createServerClient } from "@/lib/supabase/server";

interface LogActivityParams {
  userId: string;
  userEmail?: string;
  userRole?: string;
  action:
    | "created"
    | "updated"
    | "deleted"
    | "viewed"
    | "sent"
    | "accepted"
    | "refused";
  entityType: "client" | "appointment" | "quote" | "user" | "setting";
  entityId: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    const supabase = createServerClient();

    await supabase.from("activities").insert([
      {
        user_id: params.userId,
        user_email: params.userEmail,
        user_role: params.userRole,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId,
        description: params.description,
        metadata: params.metadata || {},
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      },
    ]);
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging should not break the main flow
  }
}
