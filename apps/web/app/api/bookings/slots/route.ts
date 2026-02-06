import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Date parameter required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return NextResponse.json({ slots: [] });
    }

    const slots = await getAvailableSlots(date);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Slots API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch available slots" },
      { status: 500 }
    );
  }
}
