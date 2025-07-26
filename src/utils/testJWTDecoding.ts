// Test JWT decoding to verify admin role detection
import {
  decodeJWTToken,
  isAdminRole,
  isSuperAdminRole,
} from "@/services/authService";

export function testJWTDecoding() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found in localStorage");
    return;
  }

  console.log("🔍 Testing JWT decoding...");
  console.log("Token:", token);

  const decoded = decodeJWTToken(token);
  console.log("Decoded token:", decoded);

  if (decoded) {
    // Check for Microsoft identity claims
    const roleClaimKey =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const roleName = decoded[roleClaimKey] || decoded.role || decoded.roleName;

    console.log("Role from token:", roleName);
    console.log("Is Admin Role?", isAdminRole(roleName || ""));
    console.log("Is Super Admin Role?", isSuperAdminRole(roleName || ""));

    // Check all claims
    console.log("All token claims:");
    Object.keys(decoded).forEach((key) => {
      console.log(`  ${key}: ${decoded[key]}`);
    });
  }
}

// Add to window for easy testing in console
if (typeof window !== "undefined") {
  (window as any).testJWTDecoding = testJWTDecoding;
}
