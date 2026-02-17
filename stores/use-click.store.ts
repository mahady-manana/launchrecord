import { create } from "zustand";

export interface ClickStats {
  today: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
}

export interface ClickData {
  all_time: number;
  all_time_outbound: number;
  stats: {
    clicks: ClickStats;
    outbound: ClickStats;
  };
  daily_clicks?: Array<{ date: string; clicks: number }>;
  daily_outbound_clicks?: Array<{ date: string; clicks: number }>;
}

interface ProductClickState {
  recorded: boolean;
  loading: boolean;
  error: string | null;
  dwellTime: number;
  startTime: number | null;
  isVisible: boolean;
}

interface ClickStore {
  // Per-product click tracking state
  productStates: Map<string, ProductClickState>;

  // Click data cache
  clickDataCache: Map<string, { data: ClickData; timestamp: number }>;

  // Global settings
  dwellTimeThreshold: number;
  cacheTimeoutMs: number;

  // Actions for individual products
  initializeProduct: (productId: string) => void;
  setDwellTime: (productId: string, dwellTime: number) => void;
  setStartTime: (productId: string, startTime: number) => void;
  setVisibility: (productId: string, isVisible: boolean) => void;
  markAsRecorded: (productId: string) => void;
  setLoading: (productId: string, loading: boolean) => void;
  setError: (productId: string, error: string | null) => void;

  // Cache management
  setClickData: (productId: string, data: ClickData) => void;
  getCachedData: (productId: string) => ClickData | null;
  invalidateCache: (productId: string) => void;
  clearCache: () => void;

  // Reset product state
  resetProduct: (productId: string) => void;
}

const CACHE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const DWELL_TIME_THRESHOLD = 7000; // 7 seconds

const createInitialProductState = (): ProductClickState => ({
  recorded: false,
  loading: false,
  error: null,
  dwellTime: 0,
  startTime: null,
  isVisible: true,
});

export const useClickStore = create<ClickStore>((set, get) => ({
  productStates: new Map(),
  clickDataCache: new Map(),
  dwellTimeThreshold: DWELL_TIME_THRESHOLD,
  cacheTimeoutMs: CACHE_TIMEOUT_MS,

  initializeProduct: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      if (!newMap.has(productId)) {
        newMap.set(productId, createInitialProductState());
      }
      return { productStates: newMap };
    });
  },

  setDwellTime: (productId: string, dwellTime: number) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, dwellTime });
      }
      return { productStates: newMap };
    });
  },

  setStartTime: (productId: string, startTime: number) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, startTime });
      }
      return { productStates: newMap };
    });
  },

  setVisibility: (productId: string, isVisible: boolean) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, isVisible });
      }
      return { productStates: newMap };
    });
  },

  markAsRecorded: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, recorded: true });
      }
      return { productStates: newMap };
    });
  },

  setLoading: (productId: string, loading: boolean) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, loading });
      }
      return { productStates: newMap };
    });
  },

  setError: (productId: string, error: string | null) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      const currentState = newMap.get(productId);
      if (currentState) {
        newMap.set(productId, { ...currentState, error });
      }
      return { productStates: newMap };
    });
  },

  setClickData: (productId: string, data: ClickData) => {
    set((state) => {
      const newCache = new Map(state.clickDataCache);
      newCache.set(productId, {
        data,
        timestamp: Date.now(),
      });
      return { clickDataCache: newCache };
    });
  },

  getCachedData: (productId: string) => {
    const state = get();
    const cached = state.clickDataCache.get(productId);

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > state.cacheTimeoutMs) {
      get().invalidateCache(productId);
      return null;
    }

    return cached.data;
  },

  invalidateCache: (productId: string) => {
    set((state) => {
      const newCache = new Map(state.clickDataCache);
      newCache.delete(productId);
      return { clickDataCache: newCache };
    });
  },

  clearCache: () => {
    set({ clickDataCache: new Map() });
  },

  resetProduct: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.productStates);
      newMap.set(productId, createInitialProductState());
      return { productStates: newMap };
    });
  },
}));
