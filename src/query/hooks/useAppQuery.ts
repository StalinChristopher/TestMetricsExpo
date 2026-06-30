import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useAppQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}
