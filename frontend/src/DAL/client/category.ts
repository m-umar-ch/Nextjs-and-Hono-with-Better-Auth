import { useQuery } from "@tanstack/react-query";
import { CacheTags } from "../utils/cacheTags";
import { api } from "../utils";

export function useCategories() {
  const { data, error, isLoading, refetch, isError } = useQuery({
    queryKey: [CacheTags.CATEGORIES, "client"],
    queryFn: () =>
      api.GET("/api/public/category", {
        params: { query: { limit: 30 } },
      }),
  });

  return { data: data?.data?.data, error, isLoading, refetch, isError };
}
