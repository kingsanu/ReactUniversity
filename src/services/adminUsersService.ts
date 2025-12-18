import { apiRequest } from "@/lib/api/apiClient";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
  subscriptionStatus: "active" | "expired" | "none";
}

export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

/**
 * Get all users with pagination and filtering (Admin only)
 */
export async function getAdminUsers(
  filters: AdminUsersFilters = {}
): Promise<AdminUsersResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.role) params.append("role", filters.role);
  if (filters.status) params.append("status", filters.status);

  const response = await apiRequest(
    `/api/v1/admin/users?${params.toString()}`,
    {
      method: "GET",
    }
  );
  return response.data || response;
}
