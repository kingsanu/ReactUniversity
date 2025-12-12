import { NextRequest, NextResponse } from "next/server";
import { getTimelineStats } from "@/services/timelineService";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from JWT token
    const userId = getUserIdFromRequest(request);

    // Parse query parameters
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "all";
    const lang = url.searchParams.get("lang") || "en";

    // Get timeline stats
    const stats = await getTimelineStats(userId, lang as "en" | "sp");

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Timeline stats API error:", error);

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
          message: "Failed to fetch timeline stats",
        },
      },
      { status: 500 }
    );
  }
}
