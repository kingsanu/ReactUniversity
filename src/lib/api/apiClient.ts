
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create an Axios instance with base URL and default headers
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor to handle errors uniformly
apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Generic API request function
export async function apiRequest<T = any>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.request<T>({ url: path, ...config });
  return response.data;
}
