import { LoginResponse } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VerifyTokenResponse {
  isValid: boolean;
  student?: {
    name: string;
    email: string;
    avatar?: string;
  };
  message?: string;
}

export interface CompleteOnboardingResponse extends LoginResponse {
  success: boolean;
  message?: string;
}

// Helper for headers
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

/**
 * Verify if the onboarding token is valid and get student details
 */
export async function verifyStudentToken(token: string): Promise<VerifyTokenResponse> {
  // MOCK IMPLEMENTATION FOR DEVELOPMENT
  // Remove this block when real API is ready
  if (token.startsWith("test")) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    return {
      isValid: true,
      student: {
        name: "Alex Johnson",
        email: "alex.student@example.com"
      }
    };
  }

  if (token === "invalid") {
    return { isValid: false, message: "Invalid or expired token" };
  }
  // END MOCK

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/student/onboarding/verify/${token}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      // Allow 404/400 to just return isValid: false instead of throwing
      return { isValid: false, message: "Invalid or expired token" };
    }

    const data = await response.json();
    return data; // Expected matches interface
  } catch (error) {
    console.warn("verifyStudentToken API failed", error);
    return { isValid: false, message: "Network error verifying token" };
  }
}

/**
 * Complete onboarding by setting password
 */
export async function completeStudentOnboarding(token: string, password: string): Promise<CompleteOnboardingResponse> {
  // MOCK IMPLEMENTATION
  if (token.startsWith("test")) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      token: "mock-jwt-token",
      user: {
        id: "student-123",
        name: "Alex Johnson",
        email: "alex.student@example.com",
        roleId: "student-role-id",
        role: {
          id: "student-role-id",
          name: "Student",
          description: "Student Role",
          isActive: true
        }
      }
    };
  }
  // END MOCK

  const response = await fetch(
    `${API_BASE_URL}/api/v1/student/onboarding/complete`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ token, password }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to complete onboarding");
  }

  return response.json();
}
