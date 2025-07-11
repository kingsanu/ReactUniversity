import { apiRequest } from '@/lib/api/apiClient';

export interface Role {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export async function getAllRoles(): Promise<Role[]> {
  return apiRequest('/api/roleapi', { method: 'GET' });
}

export async function getActiveRoles(): Promise<Role[]> {
  return apiRequest('/api/roleapi/active', { method: 'GET' });
}

export async function getRoleById(roleId: string): Promise<Role> {
  return apiRequest(`/api/roleapi/${roleId}`, { method: 'GET' });
}

export async function getRoleByName(roleName: string): Promise<Role> {
  return apiRequest(`/api/roleapi/name/${encodeURIComponent(roleName)}`, { method: 'GET' });
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  return apiRequest('/api/roleapi', { method: 'POST', data: payload });
}

export async function updateRole(roleId: string, payload: UpdateRolePayload): Promise<Role> {
  return apiRequest(`/api/roleapi/${roleId}`, { method: 'PUT', data: payload });
}

export async function deleteRole(roleId: string): Promise<void> {
  return apiRequest(`/api/roleapi/${roleId}`, { method: 'DELETE' });
}

export async function activateRole(roleId: string): Promise<Role> {
  return apiRequest(`/api/roleapi/${roleId}/activate`, { method: 'PATCH' });
}

export async function deactivateRole(roleId: string): Promise<Role> {
  return apiRequest(`/api/roleapi/${roleId}/deactivate`, { method: 'PATCH' });
}
