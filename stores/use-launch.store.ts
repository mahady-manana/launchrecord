import {
  mockPlacements,
  mockLaunches as originalMockLaunches,
} from "@/mocks/launch.mocks";
import { Launch, LaunchFilters, PaginationMeta } from "@/types";
import { Placement } from "@/types/placement";
import { create } from "zustand";

// Determine if we should use mock data (for development/testing purposes)
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  localStorage.getItem("useMockData") === "true";

// Create a mutable copy of mock data for development
let mockLaunches = [...originalMockLaunches];

// Type guard to determine if it's a placement or launch
const isPlacement = (item: any): item is Placement =>
  "placementType" in item && item.placementType !== undefined;

interface LaunchStore {
  // Launches state
  launches: Launch[];
  launchesPagination: PaginationMeta;
  
  // Placements state
  heroPlacements: Placement[];
  leftPlacements: Placement[];
  rightPlacements: Placement[];
  placementsPagination: PaginationMeta;
  
  // Filters
  filters: LaunchFilters;
  
  // Loading states
  launchesLoading: boolean;
  placementsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Launches actions
  setLaunchesData: (data: {
    launches: Launch[];
    pagination: PaginationMeta;
  }) => void;
  
  // Placements actions
  setPlacementsData: (data: {
    heroPlacements: Placement[];
    leftPlacements: Placement[];
    rightPlacements: Placement[];
    pagination: PaginationMeta;
  }) => void;
  
  // Combined actions
  setMockData: () => void;
  setLaunchesLoading: (loading: boolean) => void;
  setPlacementsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshPlacements: () => Promise<void>;

  // Filters
  setQuery: (query: string) => void;
  setCategory: (category: LaunchFilters["category"]) => void;
  setLaunchesPage: (page: number) => void;
  setPlacementsPage: (page: number) => void;
}

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useLaunchStore = create<LaunchStore>((set, get) => ({
  // Launches state
  launches: [],
  launchesPagination: initialPagination,
  
  // Placements state
  heroPlacements: [],
  leftPlacements: [],
  rightPlacements: [],
  placementsPagination: initialPagination,
  
  // Filters
  filters: {
    query: "",
    category: "all",
    timeFilter: "all",
    prelaunchOnly: false,
    page: 1,
    limit: 20,
  },
  
  // Loading states
  launchesLoading: false,
  placementsLoading: false,
  
  // Error state
  error: null,
  
  // Launches actions
  setLaunchesData: (data) =>
    set({
      launches: data.launches,
      launchesPagination: data.pagination,
      launchesLoading: false,
      error: null,
    }),
    
  // Placements actions
  setPlacementsData: (data) =>
    set({
      heroPlacements: data.heroPlacements,
      leftPlacements: data.leftPlacements,
      rightPlacements: data.rightPlacements,
      placementsPagination: data.pagination,
      placementsLoading: false,
      error: null,
    }),
    
  // Combined actions
  setMockData: () => {
    // Apply filters to mock data
    const { filters } = get();
    let filteredLaunches = [...mockLaunches];

    // Apply query filter
    if (filters.query) {
      const queryLower = filters.query.toLowerCase();
      filteredLaunches = filteredLaunches.filter(
        (launch) =>
          launch.name.toLowerCase().includes(queryLower) ||
          launch.tagline.toLowerCase().includes(queryLower) ||
          launch.description.toLowerCase().includes(queryLower)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      if (Array.isArray(filters.category)) {
        filteredLaunches = filteredLaunches.filter((launch) =>
          Array.isArray(launch.category)
            ? launch.category.some((cat) => filters.category.includes(cat))
            : filters.category.includes(launch.category)
        );
      } else {
        filteredLaunches = filteredLaunches.filter((launch) =>
          Array.isArray(launch.category)
            ? launch.category.includes(filters.category)
            : launch.category === filters.category
        );
      }
    }

    // Apply time filter
    if (filters.timeFilter && filters.timeFilter !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (filters.timeFilter) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          const dayOfWeek = now.getDay();
          const startOfWeek = now.getDate() - dayOfWeek;
          startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time if invalid filter
      }

      filteredLaunches = filteredLaunches.filter(
        (launch) => new Date(launch.createdAt) >= startDate
      );
    }

    // Apply prelaunch only filter
    if (filters.prelaunchOnly) {
      filteredLaunches = filteredLaunches.filter(
        (launch) => launch.status === "prelaunch"
      );
    }

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedLaunches = filteredLaunches.slice(startIndex, endIndex);

    // Get mock placements by position
    const mockLeftPlacements = mockPlacements.filter(
      (p) => p.position === "left",
    );
    const mockRightPlacements = mockPlacements.filter(
      (p) => p.position === "right",
    );
    const mockHeroPlacements = mockPlacements.filter(
      (p) => p.placementType === "featured",
    );

    set({
      launches: paginatedLaunches,
      launchesPagination: {
        page: filters.page,
        limit: filters.limit,
        total: filteredLaunches.length,
        totalPages: Math.ceil(filteredLaunches.length / filters.limit),
        hasNextPage: endIndex < filteredLaunches.length,
        hasPreviousPage: startIndex > 0,
      },
      heroPlacements: [...mockHeroPlacements],
      leftPlacements: mockLeftPlacements,
      rightPlacements: mockRightPlacements,
      placementsPagination: {
        page: 1,
        limit: 10,
        total: mockPlacements.length,
        totalPages: Math.ceil(mockPlacements.length / 10),
        hasNextPage: false,
        hasPreviousPage: false,
      },
      launchesLoading: false,
      placementsLoading: false,
      error: null,
    });
  },
  
  setLaunchesLoading: (loading) => set({ launchesLoading: loading }),
  setPlacementsLoading: (loading) => set({ placementsLoading: loading }),
  setError: (error) => set({ error, launchesLoading: false, placementsLoading: false }),
  
  // Refresh placements from API
  refreshPlacements: async () => {
    set({ placementsLoading: true, error: null });

    try {
      // Check if we should use mock data
      const useMockData =
        process.env.NODE_ENV === "development" &&
        typeof window !== "undefined" &&
        localStorage.getItem("useMockData") === "true";

      if (useMockData) {
        // Use mock data for development
        const mockLeftPlacements = mockPlacements.filter(
          (p) => p.position === "left",
        );
        const mockRightPlacements = mockPlacements.filter(
          (p) => p.position === "right",
        );
        const mockHeroPlacements = mockPlacements.filter(
          (p) => p.placementType === "featured",
        );

        set({
          heroPlacements: [...mockHeroPlacements],
          leftPlacements: mockLeftPlacements,
          rightPlacements: mockRightPlacements,
          placementsPagination: {
            page: 1,
            limit: 10,
            total: mockPlacements.length,
            totalPages: Math.ceil(mockPlacements.length / 10),
            hasNextPage: false,
            hasPreviousPage: false,
          },
          placementsLoading: false,
          error: null,
        });
      } else {
        // In a real implementation, you would call an API here
        // For now, we'll simulate the API call with mock data
        // const response = await fetch('/api/placements', {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        // });
        // const data = await response.json();

        // For now, we'll use mock data as fallback
        const mockLeftPlacements = mockPlacements.filter(
          (p) => p.position === "left",
        );
        const mockRightPlacements = mockPlacements.filter(
          (p) => p.position === "right",
        );
        const mockHeroPlacements = mockPlacements.filter(
          (p) => p.placementType === "featured",
        );

        set({
          heroPlacements: [...mockHeroPlacements],
          leftPlacements: mockLeftPlacements,
          rightPlacements: mockRightPlacements,
          placementsPagination: {
            page: 1,
            limit: 10,
            total: mockPlacements.length,
            totalPages: Math.ceil(mockPlacements.length / 10),
            hasNextPage: false,
            hasPreviousPage: false,
          },
          placementsLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to refresh placements",
        placementsLoading: false,
      });
    }
  },

  // Filters
  setQuery: (query) =>
    set((state) => ({
      filters: { ...state.filters, query, page: 1 },
    })),
  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category, page: 1 },
    })),
  setTimeFilter: (timeFilter) =>
    set((state) => ({
      filters: { ...state.filters, timeFilter, page: 1 },
    })),
  setPrelaunchOnly: (prelaunchOnly) =>
    set((state) => ({
      filters: { ...state.filters, prelaunchOnly, page: 1 },
    })),
  setLaunchesPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),
  setPlacementsPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),
}));
