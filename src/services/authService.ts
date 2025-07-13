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

export async function signUp(payload: SignUpPayload): Promise<LoginResponse> {
  const response = await apiRequest('/authapi/signup', {
    method: 'POST',
    data: payload
  });
  // The API wraps the actual data in a 'data' property
  return response.data;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiRequest('/authapi/login', {
    method: 'POST',
    data: payload
  });
  // The API wraps the actual data in a 'data' property
  return response.data;
}

export async function changeUserRole(userId: string, roleId: string): Promise<any> {
  return apiRequest('/authapi/change-role', {
    method: 'PUT',
    data: { userId, roleId }
  });
}

export async function validateToken(): Promise<{ valid: boolean; user?: any }> {
  try {
    // Use the test endpoint to validate if the token works
    await apiRequest('/authapi/test', { method: 'GET' });
    // If the request succeeds, the token is valid
    return { valid: true, user: null }; // We don't get user info from test endpoint
  } catch (error) {
    return { valid: false };
  }
}
