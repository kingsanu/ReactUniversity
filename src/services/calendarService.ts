import type {
  AcademicYear,
  AcademicYearPayload,
  AssessmentPeriod,
  AssessmentPeriodPayload,
  Holiday,
  HolidayPayload,
} from "@/types/calendar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
};

const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const buildUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error?.message || err.message || "Request failed");
  }
  const json = await res.json();
  return json.data ?? json;
};

// ============================================
// Academic Years
// ============================================

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/academic-years"), {
    headers: getHeaders(),
  });
  return handleResponse<AcademicYear[]>(res);
}

export async function createAcademicYear(payload: AcademicYearPayload): Promise<AcademicYear> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/academic-years"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AcademicYear>(res);
}

export async function updateAcademicYear(id: string, payload: Partial<AcademicYearPayload>): Promise<AcademicYear> {
  const res = await fetch(buildUrl(`/api/v1/school-admin/calendar/academic-years/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AcademicYear>(res);
}

export async function deleteAcademicYear(id: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/v1/school-admin/calendar/academic-years/${id}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete academic year");
}

// ============================================
// Assessment Periods
// ============================================

export async function getAssessmentPeriods(): Promise<AssessmentPeriod[]> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/assessment-periods"), {
    headers: getHeaders(),
  });
  return handleResponse<AssessmentPeriod[]>(res);
}

export async function createAssessmentPeriod(payload: AssessmentPeriodPayload): Promise<AssessmentPeriod> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/assessment-periods"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AssessmentPeriod>(res);
}

export async function updateAssessmentPeriod(id: string, payload: Partial<AssessmentPeriodPayload>): Promise<AssessmentPeriod> {
  const res = await fetch(buildUrl(`/api/v1/school-admin/calendar/assessment-periods/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AssessmentPeriod>(res);
}

export async function deleteAssessmentPeriod(id: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/v1/school-admin/calendar/assessment-periods/${id}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete assessment period");
}

// ============================================
// Holidays
// ============================================

export async function getHolidays(): Promise<Holiday[]> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/holidays"), {
    headers: getHeaders(),
  });
  return handleResponse<Holiday[]>(res);
}

export async function createHolidays(payload: HolidayPayload): Promise<Holiday[]> {
  const res = await fetch(buildUrl("/api/v1/school-admin/calendar/holidays"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Holiday[]>(res);
}

export async function deleteHoliday(id: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/v1/school-admin/calendar/holidays/${id}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete holiday");
}
