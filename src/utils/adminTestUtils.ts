// Utility functions for testing admin access in development

// Simple function to set admin role for testing
export function setAdminForTesting() {
  // Set user data
  const userData = { role: "super_admin" };
  localStorage.setItem("user", JSON.stringify(userData));

  // Set token with admin indicator
  localStorage.setItem("token", "test-token-super-admin");

  console.log("✅ Admin role set!");
  console.log("📝 User data:", userData);
  console.log("🔑 Token:", "test-token-super-admin");
  console.log("🔄 Please refresh the page and try accessing /dashboard/admin");

  return true;
}

// Function to check current status
export function checkAdminStatus() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  console.log("=== Current Status ===");
  console.log("Token:", token);
  console.log("User data:", userData);

  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Role:", user.role);
      console.log(
        "Is admin role?",
        ["admin", "super_admin"].includes(user.role)
      );
    } catch (e) {
      console.log("❌ Failed to parse user data");
    }
  } else {
    console.log("❌ No user data found");
  }

  return { token, userData };
}

// Function to clear all data
export function clearAdminData() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  console.log("🗑️ All admin data cleared");
  console.log("🔄 Please refresh the page");
}

// Make functions available globally for console testing
if (typeof window !== "undefined") {
  (window as any).setAdminForTesting = setAdminForTesting;
  (window as any).checkAdminStatus = checkAdminStatus;
  (window as any).clearAdminData = clearAdminData;
}
