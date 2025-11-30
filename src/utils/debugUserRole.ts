// Debug utility to check current user role and test role-based routing
// Run this in browser console: window.debugUserRole()

if (typeof window !== 'undefined') {
  (window as any).debugUserRole = function() {
    console.log("=== USER ROLE DEBUG ===");
    
    // Check localStorage
    const token = localStorage.getItem('token');
    console.log("1. Token exists:", !!token);
    
    // Check Zustand store
    const storeData = localStorage.getItem('timcare-global-store');
    if (storeData) {
      try {
        const parsed = JSON.parse(storeData);
        console.log("2. Zustand store data:", parsed);
        console.log("3. User object:", parsed.state?.user);
        console.log("4. User role:", parsed.state?.user?.role);
        console.log("5. Role type:", typeof parsed.state?.user?.role);
      } catch (e) {
        console.error("Failed to parse store:", e);
      }
    } else {
      console.log("2. No Zustand store found");
    }
    
    console.log("\n=== INSTRUCTIONS ===");
    console.log("If role is null or undefined:");
    console.log("1. Logout");
    console.log("2. Clear localStorage: localStorage.clear()");
    console.log("3. Refresh page");
    console.log("4. Login again with coach account");
    console.log("\nIf role is 'Coach' (capital C):");
    console.log("- The code now handles case-insensitive comparison");
    console.log("- Refresh the page to see the redirect");
    console.log("===================");
  };
  
  console.log("✅ Debug utility loaded. Run: window.debugUserRole()");
}

export {};
