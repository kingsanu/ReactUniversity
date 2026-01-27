import {
  SchoolAdminDashboardStats,
  Student,
  StudentInvitePayload,
  BulkStudentInvitePayload,
  StudentsResponse,
  AnalyticsOverview,
  PerformanceTrendData,
  TopPerformer,
  StudentResult,
  StudentResultsResponse,
  StudentDetailResult,
  SchoolSettings,
} from "@/types/student";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to get token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper for headers
const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ============================================
// Dashboard Stats
// ============================================

export async function getSchoolAdminStats(): Promise<SchoolAdminDashboardStats> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/dashboard/stats`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch stats");
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.warn("getSchoolAdminStats API failed, returning mock data");
    return {
      totalStudents: 0,
      pendingInvites: 0,
      acceptedStudents: 0,
      activeStudents: 0,
      completedAssessments: 0,
      averageScore: 0,
    };
  }
}

// ============================================
// Student Management
// ============================================

export async function getStudents(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<StudentsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.status) query.append("status", params.status);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/students?${query.toString()}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  } catch (error) {
    console.warn("getStudents API failed, returning empty data");
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

export async function inviteStudent(
  data: StudentInvitePayload
): Promise<{ success: boolean; message: string; student?: Student }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/students/invite`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to invite student");
  }

  return response.json();
}

export async function bulkInviteStudents(
  data: BulkStudentInvitePayload
): Promise<{ success: boolean; invited: number; failed: number; results: any[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/students/bulk-invite`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to bulk invite students");
  }

  return response.json();
}

export async function resendStudentInvite(
  studentId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/students/${studentId}/resend-invite`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to resend invitation");
  }

  return response.json();
}

export async function removeStudent(
  studentId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/students/${studentId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove student");
  }

  return response.json();
}

// ============================================
// Analytics
// ============================================

export async function getAnalyticsOverview(
  period: "week" | "month" | "quarter" | "year" = "month"
): Promise<AnalyticsOverview> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/analytics/overview?period=${period}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch analytics");
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.warn("getAnalyticsOverview API failed, returning mock data");
    return {
      studentEngagement: { active: 0, inactive: 0, trend: 0 },
      assessmentCompletion: {
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        completionRate: 0,
      },
      averagePerformance: { score: 0, trend: 0 },
      timeSpent: { averageHours: 0, totalHours: 0, trend: 0 },
    };
  }
}

export async function getPerformanceTrends(
  period: "week" | "month" | "quarter" | "year" = "month",
  metric: "score" | "completion" | "time" = "score"
): Promise<PerformanceTrendData> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/analytics/performance-trends?period=${period}&metric=${metric}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch trends");
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.warn("getPerformanceTrends API failed, returning mock data");
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{ label: "Average Score", data: [0, 0, 0, 0, 0, 0] }],
    };
  }
}

export async function getTopPerformers(
  limit: number = 10
): Promise<{ data: TopPerformer[] }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/analytics/top-performers?limit=${limit}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch top performers");
    return response.json();
  } catch (error) {
    console.warn("getTopPerformers API failed, returning empty data");
    return { data: [] };
  }
}

// ============================================
// Results
// ============================================

export async function getStudentResults(params: {
  page?: number;
  limit?: number;
  studentId?: string;
  assessmentType?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<StudentResultsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.studentId) query.append("studentId", params.studentId);
  if (params.assessmentType) query.append("assessmentType", params.assessmentType);
  if (params.dateFrom) query.append("dateFrom", params.dateFrom);
  if (params.dateTo) query.append("dateTo", params.dateTo);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/results?${query.toString()}`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch results");
    return response.json();
  } catch (error) {
    console.warn("getStudentResults API failed, returning empty data");
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

export async function getStudentDetailResult(
  studentId: string
): Promise<StudentDetailResult | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/results/${studentId}/detail`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch student detail");
    return response.json();
  } catch (error) {
    console.warn("getStudentDetailResult API failed");
    return null;
  }
}

export async function exportResults(params: {
  format: "csv" | "pdf";
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Blob> {
  const query = new URLSearchParams();
  query.append("format", params.format);
  if (params.studentId) query.append("studentId", params.studentId);
  if (params.dateFrom) query.append("dateFrom", params.dateFrom);
  if (params.dateTo) query.append("dateTo", params.dateTo);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/results/export?${query.toString()}`,
    { headers: getHeaders() }
  );

  if (!response.ok) {
    throw new Error("Failed to export results");
  }

  return response.blob();
}

// ============================================
// Settings
// ============================================

export async function getSchoolSettings(): Promise<SchoolSettings | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/settings`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch settings");
    return response.json();
  } catch (error) {
    console.warn("getSchoolSettings API failed");
    return null;
  }
}

export async function updateAdminProfile(data: {
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/settings/profile`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/school-admin/settings/password`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to change password");
  }

  return response.json();
}

// ============================================
// School Admin Access Verification
// ============================================

export async function verifySchoolAdminAccess(): Promise<{
  isSchoolAdmin: boolean;
  schoolId?: string;
  schoolName?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/school-admin/verify`,
      { headers: getHeaders() }
    );
    if (!response.ok) {
      return { isSchoolAdmin: false };
    }
    const data = await response.json();
    return {
      isSchoolAdmin: true,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
    };
  } catch (error) {
    return { isSchoolAdmin: false };
  }
}
