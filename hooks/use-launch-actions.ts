import { CreateLaunchPayload, Launch, UpdateLaunchPayload } from "@/types";

interface LaunchActions {
  createLaunch: (
    payload: CreateLaunchPayload,
  ) => Promise<{ success: boolean; message?: string; launch?: Launch }>;
  updateLaunch: (
    payload: UpdateLaunchPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  fetchLaunches: (params: {
    query?: string;
    category?: string | string[];
    page?: number;
    limit?: number;
  }) => Promise<{
    success: boolean;

    launches?: Launch[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    message?: string;
  }>;
}

export function useLaunchActions(): LaunchActions {
  const fetchLaunches = async (params: {
    query?: string;
    category?: string | string[];
    timeFilter?: "all" | "today" | "week" | "month";
    prelaunchOnly?: boolean;
    page?: number;
    limit?: number;
  }) => {
    try {
      // Handle category serialization - if it's an array, join with commas
      let categoryParam = params.category;
      if (Array.isArray(params.category)) {
        categoryParam = params.category.join(",");
      }

      const urlParams = new URLSearchParams({
        ...(params.query && { q: params.query }),
        ...(categoryParam && { category: String(categoryParam) }),
        ...(params.timeFilter && { timeFilter: params.timeFilter }),
        ...(params.prelaunchOnly !== undefined && { prelaunchOnly: String(params.prelaunchOnly) }),
        page: String(params.page || 1),
        limit: String(params.limit || 20),
      });

      const response = await fetch(
        `/api/launches/get?${urlParams.toString()}`,
        {
          cache: "no-store",
        },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to fetch launches.",
        };
      }

      return {
        success: true,
        launches: data.launches || [],
        pagination: data.pagination,
      };
    } catch (error) {
      console.error("Error loading launches:", error);
      return {
        success: false,
        message: "Failed to fetch launches.",
      };
    }
  };

  const createLaunch = async (payload: CreateLaunchPayload) => {
    try {
      const response = await fetch("/api/launches/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to submit launch.",
        };
      }

      return { success: true, launch: data.launch };
    } catch (error) {
      console.error("Error creating launch:", error);
      return { success: false, message: "Failed to submit launch." };
    }
  };

  const updateLaunch = async (payload: UpdateLaunchPayload) => {
    try {
      const response = await fetch("/api/launches/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to update launch.",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating launch:", error);
      return { success: false, message: "Failed to update launch." };
    }
  };

  return {
    createLaunch,
    updateLaunch,
    fetchLaunches,
  };
}
