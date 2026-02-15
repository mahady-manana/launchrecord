// services/user-service.ts
export const userService = {
  getCurrentUser: async (): Promise<any> => {
    const response = await fetch("/api/users/me", { cache: "no-store" });
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch user");
    }
    
    return data.user;
  },

  logout: async (): Promise<any> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to logout");
    }
    
    return data;
  }
};