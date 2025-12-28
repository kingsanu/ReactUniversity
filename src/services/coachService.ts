import {
  Coach,
  OnboardingStatus,
  OnboardingData,
  CoachesResponse,
  Booking,
  BookingResponse,
  Availability,
  Review,
  CoachAnalytics,
  StudentSummary,
  StudentDetails,
  Payout,
  BankAccount,
  Notification,
  CoachSlotsResponse,
} from "../types/coach";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to get token
const getToken = () => localStorage.getItem("token");

// Helper for headers
const getHeaders = (isMultipart = false) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// --- Onboarding Endpoints ---

export async function getOnboardingStatus(
  coachId: string
): Promise<OnboardingStatus> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/${coachId}/onboarding-status`
  );
  if (!response.ok) throw new Error("Failed to get onboarding status");
  const json = await response.json();
  return json.data;
}

export async function submitOnboardingData(
  coachId: string,
  data: OnboardingData
): Promise<{ success: boolean; coachId: string; redirectUrl: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/${coachId}/onboarding`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to submit onboarding data");
  return response.json();
}

export async function getCalendarAuthUrl(
  provider: "google" | "outlook",
  email?: string
): Promise<{ url: string }> {
  const query = new URLSearchParams();
  if (email) query.append("email", email);
  const requestUrl = `${API_BASE_URL}/api/v1/auth/${provider}/url${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  console.log(`[getCalendarAuthUrl] Requesting: ${requestUrl}`);

  const response = await fetch(requestUrl, {
    headers: getHeaders(),
  });

  console.log(`[getCalendarAuthUrl] Response status: ${response.status}`);

  if (!response.ok) throw new Error(`Failed to get ${provider} auth URL`);
  const data = await response.json();
  // Handle both 'url' and 'callbackurl' response formats and nested response payloads
  // Some APIs return { data: { url: '...' } } while others return { url: '...' }

  console.log(
    `[getCalendarAuthUrl] Response data:`,
    JSON.stringify(data, null, 2)
  );
  debugger;
  const nested = data && typeof data === "object" ? data.data || data : data;
  const url =
    nested?.url || nested?.callbackurl || data?.url || data?.callbackurl;
  if (!url) {
    throw new Error(
      `API did not return a valid URL. Response: ${JSON.stringify(data)}`
    );
  }
  return { url };
}

export async function checkGoogleAuthStatus(email: string): Promise<{
  isAuthenticated: boolean;
  email: string;
  userId: string;
  authDetails: {
    connected: boolean;
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isTokenValid: boolean;
    isTokenExpired: boolean;
    tokenStatus: string;
  };
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/google/status?email=${email}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to check Google auth status");
  const json = await response.json();
  return json.data || json;
}

// --- User Side APIs ---

export async function getCoaches(
  params: {
    page?: number;
    limit?: number;
    specialization?: string;
    search?: string;
  } = {}
): Promise<CoachesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.specialization)
    query.append("specialization", params.specialization);
  if (params.search) query.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach?${query.toString()}`
  );
  if (!response.ok) throw new Error("Failed to fetch coaches");
  return response.json();
}

// --- New Coach Dashboard APIs ---
export async function getCoachAnalytics(): Promise<{ data: CoachAnalytics }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/analytics`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch coach analytics");
  return response.json();
}

export async function getCoachAnalyticsReport(
  startDate?: string,
  endDate?: string,
  type: "csv" | "pdf" = "pdf"
): Promise<Blob | { data: any }> {
  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);
  if (type) query.append("type", type);
  const url = `${API_BASE_URL}/api/v1/coach/me/analytics/report?${query.toString()}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch analytics report");
  // If we request pdf/csv the API might return a file, attempt to return blob
  const contentType = response.headers.get("content-type") || "";
  if (
    contentType.includes("application/pdf") ||
    contentType.includes("text/csv")
  ) {
    return response.blob();
  }
  return response.json();
}

export async function getBookingNotes(
  bookingId: string
): Promise<{ notes: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/bookings/${bookingId}/notes`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch booking notes");
  return response.json();
}

export async function updateBookingNotes(
  bookingId: string,
  notes: string
): Promise<{ success: boolean; notes: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/bookings/${bookingId}/notes`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ notes }),
    }
  );
  if (!response.ok) throw new Error("Failed to update booking notes");
  return response.json();
}

export async function getCoachStudentById(
  studentId: string
): Promise<{ data: StudentDetails }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/students/${studentId}`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch coach student details");
  return response.json();
}

export async function getCoachPayouts(): Promise<{ data: Payout[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/payouts`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch payouts");
  return response.json();
}

export async function getCoachBankAccount(): Promise<{ data: BankAccount }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/bank-account`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch bank account info");
  return response.json();
}

export async function linkCoachBankAccount(data?: {
  accountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  accountType?: "checking" | "savings";
  provider?: "stripe" | "manual";
}): Promise<{
  onboardingUrl?: string;
  success?: boolean;
  message?: string;
  accountId?: string;
  status?: string;
}> {
  // Default to Stripe Connect with minimal required fields
  const requestBody = {
    provider: data?.provider || "stripe",
    accountType: data?.accountType || "checking",
    accountHolderName: data?.accountHolderName || "",
    bankName: data?.bankName || "",
    ...(data?.accountNumber && { accountNumber: data.accountNumber }),
    ...(data?.routingNumber && { routingNumber: data.routingNumber }),
  };

  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/bank-account`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to initiate bank account linking" }));
    throw new Error(error.message || "Failed to initiate bank account linking");
  }

  return response.json();
}

export async function getNotifications(): Promise<{ data: Notification[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: getHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to mark notification as read");
  return response.json();
}

export async function getCoachDetails(coachId: string): Promise<Coach> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/${coachId}`);
  if (!response.ok) throw new Error("Failed to fetch coach details");
  const json = await response.json();
  return json.data;
}

// Get coach availability for a specific date
export async function getCoachAvailableSlots(
  coachId: string,
  date: string,
  timezone?: string
): Promise<CoachSlotsResponse> {
  const query = new URLSearchParams();
  query.append("date", date);
  if (timezone) query.append("timezone", timezone);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/${coachId}/slots?${query.toString()}`
  );

  if (!response.ok) {
    // If endpoint returns 404 or other error, return a safe empty object matching the interface
    // so the UI can handle it gracefully (e.g. show "no availability")
    console.warn("Coach slots endpoint not available or returned error");
    return {
      date,
      timezone: timezone || "UTC",
      coachId,
      sessionDurationMinutes: 30, // Fallback default
      price: { amount: 0, currency: "USD" },
      slots: [],
    };
  }

  const json = await response.json();
  return json.data;
}

export async function bookSession(data: {
  coachId: string;
  slot: { start: string; end: string };
  topic: string;
  notes?: string;
}): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to book session");
  return response.json();
}

// --- User Sessions API ---

export async function getUserSessions(
  status: "upcoming" | "past" | "all" = "all"
): Promise<{ data: Booking[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/bookings/me?status=${status}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch user sessions");
  return response.json();
}

// --- Coach Dashboard APIs ---

export async function getCoachSessions(
  status: "upcoming" | "past" | "all" = "all"
): Promise<{ data: Booking[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/sessions?status=${status}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json();
}

export async function rescheduleSession(
  bookingId: string,
  newSlot: { start: string; end: string }
): Promise<BookingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/bookings/${bookingId}/reschedule`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ newSlot }),
    }
  );

  if (!response.ok) throw new Error("Failed to reschedule session");
  return response.json();
}

export async function getAvailability(): Promise<Availability> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/availability`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch availability");
  const json = await response.json();
  return json.data;
}

export async function updateAvailability(
  availability: Availability
): Promise<Availability> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/availability`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(availability),
  });

  if (!response.ok) throw new Error("Failed to update availability");
  const json = await response.json();
  return json.data;
}

export async function updateCoachProfile(data: Partial<Coach>): Promise<Coach> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
}

export async function cancelSession(
  bookingId: string,
  reason: string
): Promise<BookingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) throw new Error("Failed to cancel session");
  return response.json();
}

// --- Reviews ---

export async function submitReview(
  coachId: string,
  data: { bookingId: string; rating: number; comment: string }
): Promise<Review> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/${coachId}/reviews`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to submit review");
  return response.json();
}

// --- Admin APIs ---

// Coach Statistics Interface and API
export interface CoachStats {
  totalCoaches: number;
  activeNow: number;
  pendingInvites: number;
  expiringContracts: number;
  statusBreakdown: {
    active: number;
    invited: number;
    pending: number;
    inactive: number;
  };
}

/**
 * Get aggregated statistics for all coaches in the system.
 * This endpoint is optimized for the admin dashboard, aggregating data at the database level.
 */
export async function getCoachStats(): Promise<CoachStats> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/coaches/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch coach stats");
  const json = await response.json();
  return json.data || json;
}

export async function getAllCoachesAdmin(
  params: { page?: number; limit?: number; search?: string } = {}
): Promise<CoachesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/authapi/coaches?${query.toString()}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch coaches (admin)");
  return response.json();
}

export async function inviteCoach(data: {
  email: string;
  name?: string;
  contractStart?: string;
  contractEnd?: string;
}): Promise<{ message: string; invitationId: string }> {
  const response = await fetch(`${API_BASE_URL}/authapi/invite-coach`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to invite coach");
  return response.json();
}

export async function inviteCoachBulk(file: File): Promise<any[]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/authapi/invite-coach-bulk`, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to bulk invite coaches");
  return response.json();
}

export async function signupCoachBulk(
  coaches: { fullName: string; email: string; password?: string }[]
): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/authapi/signup-coach-bulk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ coaches }),
  });

  if (!response.ok) throw new Error("Failed to bulk signup coaches");
  return response.json();
}

// --- Test Function ---

export async function testCoachAPIs(): Promise<void> {
  console.log("🔍 Testing Coach APIs...");
  try {
    // Test get coaches
    console.log("Testing getCoaches...");
    const coaches = await getCoaches({ limit: 5 });
    console.log("✅ Coaches:", coaches);

    if (coaches.data.length > 0) {
      const coachId = coaches.data[0].id;
      console.log(`Testing getCoachDetails for ${coachId}...`);
      const details = await getCoachDetails(coachId);
      console.log("✅ Coach Details:", details);
    }
  } catch (error) {
    console.error("❌ Coach API test failed:", error);
  }
}

export async function uploadProfileImage(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        // Assuming the backend handles profile updates including the image via this endpoint
        // or a specific avatar endpoint. Based on typical patterns and the user's provided JSON:
        const response = await fetch(`${API_BASE_URL}/api/v1/coach/me`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) throw new Error("Failed to upload profile image");
        const json = await response.json();
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function getCoachStudents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: any[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.search) query.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/students?${query.toString()}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch students");
  const json = await response.json();
  return json.data;
}

export async function getCoachStudentDetails(studentId: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/students/${studentId}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch student details");
  const json = await response.json();
  return json.data;
}

// --- Earnings & Payout APIs ---

export interface CoachEarningsStats {
  totalEarnings: number;
  pendingPayout: number;
  lastPayoutAmount: number;
  lastPayoutDate: string;
}

export interface EarningsHistoryItem {
  date: string;
  description: string;
  amountGross: number;
  platformFee: number;
  amountNet: number;
  status: "completed" | "pending" | "cancelled";
}

export interface PayoutSettings {
  frequency: "biweekly" | "monthly";
  method: "stripe" | "bank_transfer";
}

export async function getCoachEarnings(): Promise<CoachEarningsStats> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/me/earnings`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch earnings");
  const json = await response.json();
  return json.data || json;
}

export async function getCoachEarningsHistory(): Promise<
  EarningsHistoryItem[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/earnings/history`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch earnings history");
  const json = await response.json();
  return json.data || json;
}

export async function getCoachPayoutSettings(): Promise<PayoutSettings> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/payout-settings`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch payout settings");
  const json = await response.json();
  return json.data || json;
}

export async function updateCoachPayoutSettings(
  settings: Partial<PayoutSettings>
): Promise<PayoutSettings> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/coach/me/payout-settings`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(settings),
    }
  );

  if (!response.ok) throw new Error("Failed to update payout settings");
  const json = await response.json();
  return json.data || json;
}
