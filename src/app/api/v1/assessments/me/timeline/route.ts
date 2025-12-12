import { NextRequest, NextResponse } from "next/server";
import { getTimelineEvents } from "@/services/timelineService";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from JWT token
    const userId = getUserIdFromRequest(request);

    // Parse query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;
    const types =
      url.searchParams.getAll("types").length > 0
        ? url.searchParams.getAll("types")
        : undefined;
    const status =
      url.searchParams.getAll("status").length > 0
        ? url.searchParams.getAll("status")
        : undefined;
    const lang = url.searchParams.get("lang") || "en";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    // Build filters
    const filters = {
      dateRange: startDate || endDate ? { startDate, endDate } : undefined,
      types: types as any,
      status: status as any,
    };

    // Get timeline events
    const result = await getTimelineEvents(
      userId,
      filters,
      lang as "en" | "sp"
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Timeline API error:", error);

    if (error instanceof Error) {
      if (
        error.message === "No authorization token provided" ||
        error.message === "Invalid token"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication required",
            },
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch timeline events",
        },
      },
      { status: 500 }
    );
  }
}
