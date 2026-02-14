import { 
  CreatePlacementPayload, 
  Placement, 
  UpdatePlacementPayload,
  PlacementSlot 
} from "@/types/placement";

interface PlacementActions {
  createPlacement: (
    payload: CreatePlacementPayload,
  ) => Promise<{ success: boolean; message?: string; placement?: Placement }>;
  updatePlacement: (
    payload: UpdatePlacementPayload,
  ) => Promise<{ success: boolean; message?: string }>;
  fetchPlacements: (params: {
    query?: string;
    type?: string | string[];
    position?: string | string[];
    page?: number;
    limit?: number;
  }) => Promise<{
    success: boolean;
    placements?: Placement[];
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
  fetchPlacementSlots: (params: {
    position?: string;
    type?: string;
  }) => Promise<{
    success: boolean;
    slots?: PlacementSlot[];
    message?: string;
  }>;
}

export function usePlacementActions(): PlacementActions {
  const fetchPlacements = async (params: {
    query?: string;
    type?: string | string[];
    position?: string | string[];
    page?: number;
    limit?: number;
  }) => {
    try {
      // Handle type and position serialization - if they're arrays, join with commas
      let typeParam = params.type;
      if (Array.isArray(params.type)) {
        typeParam = params.type.join(",");
      }
      
      let positionParam = params.position;
      if (Array.isArray(params.position)) {
        positionParam = params.position.join(",");
      }

      const urlParams = new URLSearchParams({
        ...(params.query && { q: params.query }),
        ...(typeParam && { type: String(typeParam) }),
        ...(positionParam && { position: String(positionParam) }),
        page: String(params.page || 1),
        limit: String(params.limit || 20),
      });

      const response = await fetch(
        `/api/placements/get?${urlParams.toString()}`,
        {
          cache: "no-store",
        },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to fetch placements.",
        };
      }

      return {
        success: true,
        placements: data.placements || [],
        pagination: data.pagination,
      };
    } catch (error) {
      console.error("Error loading placements:", error);
      return {
        success: false,
        message: "Failed to fetch placements.",
      };
    }
  };

  const createPlacement = async (payload: CreatePlacementPayload) => {
    try {
      const response = await fetch("/api/placements/create", {
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
          message: data.message || "Failed to create placement.",
        };
      }

      return { success: true, placement: data.placement };
    } catch (error) {
      console.error("Error creating placement:", error);
      return { success: false, message: "Failed to create placement." };
    }
  };

  const updatePlacement = async (payload: UpdatePlacementPayload) => {
    try {
      const response = await fetch("/api/placements/update", {
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
          message: data.message || "Failed to update placement.",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating placement:", error);
      return { success: false, message: "Failed to update placement." };
    }
  };

  const fetchPlacementSlots = async (params: {
    position?: string;
    type?: string;
  }) => {
    try {
      const urlParams = new URLSearchParams({
        ...(params.position && { position: params.position }),
        ...(params.type && { type: params.type }),
      });

      const response = await fetch(
        `/api/placements/slots?${urlParams.toString()}`,
        {
          cache: "no-store",
        },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to fetch placement slots.",
        };
      }

      return {
        success: true,
        slots: data.slots || [],
      };
    } catch (error) {
      console.error("Error loading placement slots:", error);
      return {
        success: false,
        message: "Failed to fetch placement slots.",
      };
    }
  };

  return {
    createPlacement,
    updatePlacement,
    fetchPlacements,
    fetchPlacementSlots,
  };
}