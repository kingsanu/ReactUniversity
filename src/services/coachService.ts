import {
  Coach,
  OnboardingStatus,
  OnboardingData,
  CoachesResponse,
  Booking,
  BookingResponse,
  Availability,
  Review
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

export async function getOnboardingStatus(coachId: string): Promise<OnboardingStatus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/${coachId}/onboarding-status`);
  if (!response.ok) throw new Error("Failed to get onboarding status");
  const json = await response.json();
  return json.data;
}

export async function uploadProfileImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload image");
  return response.json();
}

export async function submitOnboardingData(coachId: string, data: OnboardingData): Promise<{ success: boolean; coachId: string; redirectUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coach/${coachId}/onboarding`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to submit onboarding data");
  return response.json();
}

export async function getCalendarAuthUrl(provider: 'google' | 'outlook'): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/${provider}/url`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to get ${provider} auth URL`);
  return response.json();
}

// --- User Side APIs ---

export async function getCoaches(params: { page?: number; limit?: number; specialization?: string; search?: string } = {}): Promise<CoachesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.specialization) query.append("specialization", params.specialization);
  if (params.search) query.append("search", params.search);

  const response = await fetch(`${API_BASE_URL}/api/v1/coaches?${query.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch coaches");
  return response.json();
}

export async function getCoachDetails(coachId: string): Promise<Coach> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/${coachId}`);
  if (!response.ok) throw new Error("Failed to fetch coach details");
  return response.json();
}

export async function bookSession(data: { coachId: string; slot: { start: string; end: string }; topic: string; notes?: string }): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to book session");
  return response.json();
}

// --- Coach Dashboard APIs ---

export async function getCoachSessions(status: 'upcoming' | 'past' | 'all' = 'all'): Promise<{ data: Booking[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/me/sessions?status=${status}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json();
}

export async function rescheduleSession(bookingId: string, newSlot: { start: string; end: string }): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/reschedule`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ newSlot }),
  });

  if (!response.ok) throw new Error("Failed to reschedule session");
  return response.json();
}

export async function getAvailability(): Promise<Availability> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/me/availability`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch availability");
  return response.json();
}

export async function updateAvailability(availability: Availability): Promise<Availability> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/me/availability`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(availability),
  });

  if (!response.ok) throw new Error("Failed to update availability");
  return response.json();
}

export async function updateCoachProfile(data: Partial<Coach>): Promise<Coach> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/me`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
}

export async function cancelSession(bookingId: string, reason: string): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) throw new Error("Failed to cancel session");
  return response.json();
}

// --- Reviews ---

export async function submitReview(coachId: string, data: { bookingId: string; rating: number; comment: string }): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/v1/coaches/${coachId}/reviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to submit review");
  return response.json();
}

// --- Admin APIs ---

export async function getAllCoachesAdmin(params: { page?: number; limit?: number; search?: string } = {}): Promise<CoachesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);

  const response = await fetch(`${API_BASE_URL}/authapi/coaches?${query.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch coaches (admin)");
  return response.json();
}

export async function inviteCoach(email: string): Promise<{ message: string; invitationId: string }> {
  const response = await fetch(`${API_BASE_URL}/authapi/invite-coach`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email }),
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

export async function signupCoachBulk(coaches: { fullName: string; email: string; password?: string }[]): Promise<any[]> {
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
