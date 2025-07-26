// Admin service for handling admin-related API calls
import { decodeJWTToken, isAdminRole, isSuperAdminRole } from "./authService";
import { getRoleById } from "./roleService";

interface AdminVerificationResponse {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string;
  permissions: string[];
}

export async function verifyAdminAccess(): Promise<AdminVerificationResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  // Use role-based verification directly since verify-admin endpoint doesn't exist
  return await verifyAdminViaRoles(token);
}

// Verify admin access using role APIs
async function verifyAdminViaRoles(
  token: string
): Promise<AdminVerificationResponse> {
  try {
    console.log("🔍 verifyAdminViaRoles: Starting role-based verification...");

    // First, try to decode the JWT token to get role information
    const decodedToken = decodeJWTToken(token);
    let roleId = null;
    let roleName = null;

    console.log("🔍 verifyAdminViaRoles: Decoded token:", decodedToken);

    if (decodedToken) {
      // Check for standard role fields
      roleId = decodedToken.roleId || decodedToken.role_id;
      roleName =
        decodedToken.roleName || decodedToken.role_name || decodedToken.role;

      // Check for Microsoft identity claims format
      const roleClaimKey =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      if (decodedToken[roleClaimKey]) {
        roleName = decodedToken[roleClaimKey];
      }

      // Check for name identifier (user ID)
      const nameIdKey =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameididentifier";
      if (decodedToken[nameIdKey]) {
        roleId = decodedToken[nameIdKey];
      }

      console.log("🔍 verifyAdminViaRoles: Found role info in token:", {
        roleId,
        roleName,
        fullToken: decodedToken,
      });
    }

    // If we have roleId, get role details from API
    if (roleId) {
      try {
        const roleDetails = await getRoleById(roleId);
        roleName = roleDetails.name;
        console.log(
          "🔍 verifyAdminViaRoles: Got role details from API:",
          roleDetails
        );
      } catch (error) {
        console.warn("Failed to get role details from API:", error);
      }
    }

    // Check if the role name indicates admin access
    const isAdmin = roleName ? isAdminRole(roleName) : false;
    const isSuperAdmin = roleName ? isSuperAdminRole(roleName) : false;

    console.log("🔍 verifyAdminViaRoles: Role analysis:", {
      roleName,
      isAdmin,
      isSuperAdmin,
    });

    // If no role found in token, fall back to simulation
    if (!roleName) {
      console.log(
        "🔍 verifyAdminViaRoles: No role found in token, using simulation"
      );
      return simulateAdminVerification(token);
    }

    return {
      isAdmin,
      isSuperAdmin,
      role: roleName || "user",
      permissions: isAdmin ? ["read", "write", "delete"] : ["read"],
    };
  } catch (error) {
    console.warn("Role-based verification failed, using fallback:", error);
    return simulateAdminVerification(token);
  }
}

// Simulate admin verification for development/testing
function simulateAdminVerification(token: string): AdminVerificationResponse {
  console.log("🔧 simulateAdminVerification: Starting simulation...");

  // Simple simulation: check if token contains admin indicators
  const isTestAdmin = token.includes("admin") || token.includes("super");
  console.log(
    "🔧 simulateAdminVerification: Token contains admin?",
    isTestAdmin
  );

  // You can also check localStorage for user data
  const userData = localStorage.getItem("user");
  let userRole = "user";

  console.log("🔧 simulateAdminVerification: Raw user data:", userData);

  if (userData) {
    try {
      const user = JSON.parse(userData);
      userRole = user.role || "user";
      console.log("🔧 simulateAdminVerification: Parsed user role:", userRole);
    } catch (e) {
      console.warn("Failed to parse user data from localStorage");
    }
  }

  const isAdmin =
    userRole === "admin" || userRole === "super_admin" || isTestAdmin;
  const isSuperAdmin = userRole === "super_admin" || token.includes("super");

  console.log("🔧 simulateAdminVerification: Final result:", {
    isAdmin,
    isSuperAdmin,
    role: userRole,
    userRole,
    isTestAdmin,
  });

  return {
    isAdmin,
    isSuperAdmin,
    role: userRole,
    permissions: isAdmin ? ["read", "write", "delete"] : ["read"],
  };
}

// For testing purposes, you can manually set admin role
export function setTestAdminRole(role: "user" | "admin" | "super_admin") {
  const userData = { role };
  localStorage.setItem("user", JSON.stringify(userData));

  // Also update the token to include admin indicator
  const currentToken = localStorage.getItem("token") || "test-token";
  const adminToken =
    role === "admin"
      ? `${currentToken}-admin`
      : role === "super_admin"
      ? `${currentToken}-super-admin`
      : currentToken.replace(/-admin|-super-admin/g, "");

  localStorage.setItem("token", adminToken);

  console.log(`Test role set to: ${role}`);
  console.log(`Token updated to: ${adminToken}`);
  console.log(`User data: ${JSON.stringify(userData)}`);
}

// Debug function to check current admin status
export function debugAdminStatus() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  console.log("=== Admin Status Debug ===");
  console.log("Token:", token);
  console.log("User data:", userData);

  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Parsed user role:", user.role);
    } catch (e) {
      console.log("Failed to parse user data");
    }
  }

  // Test the verification
  verifyAdminAccess()
    .then((result) => {
      console.log("Admin verification result:", result);
      console.log("Is Admin?", result.isAdmin);
      console.log("Is Super Admin?", result.isSuperAdmin);
      console.log("Role:", result.role);
    })
    .catch((error) => {
      console.log("Admin verification error:", error);
    });
}
