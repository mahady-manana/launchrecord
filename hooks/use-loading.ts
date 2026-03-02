import { useCallback, useState } from "react";

export function useLoading(initial = false) {
  const [isLoading, setIsLoading] = useState(initial);
  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  return { isLoading, start, stop };
}
