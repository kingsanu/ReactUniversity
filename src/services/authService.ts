import { apiRequest } from '@/lib/api/apiClient';

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function testApi(): Promise<any> {
  return apiRequest('/authapi/test', { method: 'GET' });
}

export async function signUp(payload: SignUpPayload): Promise<any> {
  return apiRequest('/authapi/signup', {
    method: 'POST',
    data: payload
  });
}

export async function login(payload: LoginPayload): Promise<{ token: string }> {
  return apiRequest('/authapi/login', {
    method: 'POST',
    data: payload
  });
}

export async function changeUserRole(userId: string, roleId: string): Promise<any> {
  return apiRequest('/authapi/change-role', {
    method: 'PUT',
    data: { userId, roleId }
  });
}
