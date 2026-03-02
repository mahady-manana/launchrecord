import { useCallback, useState } from "react";

interface ApiError {
  message: string;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const request = useCallback(async <T>(input: RequestInfo, init?: RequestInit) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(input, init);
      const result = (await response.json()) as T;
      if (!response.ok) {
        const message =
          (result as { message?: string }).message || "Request failed";
        setError({ message });
        return { ok: false, data: result, error: message };
      }
      return { ok: true, data: result };
    } catch {
      setError({ message: "Request failed" });
      return { ok: false, data: null, error: "Request failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { request, isLoading, error };
}
